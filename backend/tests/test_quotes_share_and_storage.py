"""
Iteration 5 — Share quote routes + Storage mock-mode regression.

New endpoints under review:
  POST /api/v1/quotes/:id/share   -> {slug, shareUrl, expiresAt}  (Public, Redis qshare:<slug> TTL=7d)
  GET  /api/v1/quotes/s/:slug     -> sanitised public quote (strips userId/contact, narrows profile)

Storage drop-in (AWS SDK v3) regression:
  POST /api/v1/documents/presign still behaves in MOCK mode when S3_* env is unset.
"""
from datetime import datetime, timezone
import re
import pytest


def _env_ok(body):
    assert isinstance(body, dict) and body.get("success") is True, body
    assert "data" in body, body
    return body["data"]


def _env_err(body):
    assert isinstance(body, dict) and body.get("success") is False, body
    assert "error" in body and isinstance(body["error"], dict), body
    return body["error"]


def _new_quote_payload(**overrides):
    p = {
        "loanType": "PERSONAL_LOAN",
        "amount": 500000,
        "tenureMonths": 36,
        "monthlyIncome": 80000,
        "cibilScore": 760,
        "city": "Bengaluru",
        "state": "KA",
        "fullName": "TEST_Share User",
        "mobile": "9999900011",
        "email": "TEST_share@example.com",
    }
    p.update(overrides)
    return p


def _create_quote(client, api, **overrides):
    r = client.post(f"{api}/quotes", json=_new_quote_payload(**overrides))
    assert r.status_code in (200, 201), r.text
    return _env_ok(r.json())


# ---------------- POST /quotes/:id/share ----------------

class TestQuoteShareCreate:
    def test_share_returns_slug_url_and_expiry(self, anon_client, api):
        q = _create_quote(anon_client, api)
        r = anon_client.post(f"{api}/quotes/{q['id']}/share", json={})
        assert r.status_code in (200, 201), r.text
        data = _env_ok(r.json())

        # shape
        assert set(["slug", "shareUrl", "expiresAt"]).issubset(data.keys()), data
        slug = data["slug"]
        assert isinstance(slug, str) and len(slug) >= 6

        # base64url-safe: A-Z a-z 0-9 - _ (no +,/,=)
        assert re.fullmatch(r"[A-Za-z0-9_-]+", slug), f"slug not base64url-safe: {slug!r}"
        # 6 random bytes -> base64url encodes to 8 chars
        assert len(slug) == 8, f"expected ~8-char slug, got {len(slug)}: {slug!r}"

        # shareUrl embeds slug
        assert slug in data["shareUrl"], data["shareUrl"]

        # expiresAt ~7 days in the future
        exp = datetime.fromisoformat(data["expiresAt"].replace("Z", "+00:00"))
        now = datetime.now(timezone.utc)
        delta_days = (exp - now).total_seconds() / 86400.0
        assert 6.9 <= delta_days <= 7.1, f"expiresAt not ~7d away: {delta_days} days"

    def test_share_nonexistent_quote_returns_404(self, anon_client, api):
        r = anon_client.post(f"{api}/quotes/Q-DOESNOTEXIST-XYZ/share", json={})
        assert r.status_code == 404, r.text
        err = _env_err(r.json())
        # standard envelope must carry an error.code
        assert err.get("code"), err

    def test_share_twice_yields_two_distinct_resolving_slugs(self, anon_client, api):
        q = _create_quote(anon_client, api)
        s1 = _env_ok(anon_client.post(f"{api}/quotes/{q['id']}/share", json={}).json())
        s2 = _env_ok(anon_client.post(f"{api}/quotes/{q['id']}/share", json={}).json())

        assert s1["slug"] != s2["slug"], "two share calls returned the same slug"

        # both must resolve
        for slug in (s1["slug"], s2["slug"]):
            r = anon_client.get(f"{api}/quotes/s/{slug}")
            assert r.status_code == 200, (slug, r.text)
            data = _env_ok(r.json())
            assert data["id"] == q["id"]


# ---------------- GET /quotes/s/:slug ----------------

class TestQuoteShareFetch:
    def test_public_fetch_returns_offers_and_strips_pii(self, customer_client, anon_client, api):
        # Create quote as authenticated customer so userId + contact are populated on the underlying quote.
        q = _create_quote(customer_client, api)
        assert q["userId"], "fixture: expected customer-bound quote to carry userId"

        share = _env_ok(anon_client.post(f"{api}/quotes/{q['id']}/share", json={}).json())
        slug = share["slug"]

        r = anon_client.get(f"{api}/quotes/s/{slug}")
        assert r.status_code == 200, r.text
        pub = _env_ok(r.json())

        # quote shape preserved
        assert pub["id"] == q["id"]
        assert "offers" in pub and isinstance(pub["offers"], list)
        assert "bestOffer" in pub
        assert "offersCount" in pub and pub["offersCount"] == q["offersCount"]
        # emi is per-offer; top-level bestOffer should carry emi block
        if pub["bestOffer"]:
            assert "emi" in pub["bestOffer"]

        # PII stripped
        assert "userId" not in pub, f"userId leaked in public share: {pub.get('userId')!r}"
        assert "contact" not in pub, f"contact leaked in public share: {pub.get('contact')!r}"

        # profile narrowed to city/state only
        prof = pub.get("profile")
        if prof is not None:
            assert set(prof.keys()).issubset({"city", "state"}), f"profile has extra keys: {prof}"
            # make sure identifying fields are gone
            for forbidden in ("monthlyIncome", "cibilScore", "panNumber", "aadhaarNumber"):
                assert forbidden not in prof, f"{forbidden} leaked via profile"

        # sharedVia == slug
        assert pub.get("sharedVia") == slug

    def test_public_fetch_unknown_slug_returns_404_envelope(self, anon_client, api):
        r = anon_client.get(f"{api}/quotes/s/doesnotexist1234")
        assert r.status_code == 404, r.text
        err = _env_err(r.json())
        assert err.get("code"), err  # error.code present

    def test_anon_created_quote_share_hides_contact(self, anon_client, api):
        # Anonymous quote-create populates `contact` on the underlying quote; public share must strip it.
        q = _create_quote(anon_client, api)
        share = _env_ok(anon_client.post(f"{api}/quotes/{q['id']}/share", json={}).json())
        r = anon_client.get(f"{api}/quotes/s/{share['slug']}")
        assert r.status_code == 200, r.text
        pub = _env_ok(r.json())
        assert "contact" not in pub
        assert pub.get("userId") in (None, ...) and "userId" not in pub


# ---------------- Storage (mock mode) regression ----------------

class TestStoragePresignMockMode:
    def test_presign_mock_mode_shape(self, customer_client, api):
        r = customer_client.post(
            f"{api}/documents/presign",
            json={"fileName": "TEST_share_pan.pdf", "contentType": "application/pdf"},
        )
        assert r.status_code in (200, 201), r.text
        data = _env_ok(r.json())

        # required fields
        for k in ("storageKey", "key", "uploadUrl", "method", "headers", "expiresInSec"):
            assert k in data, f"missing {k} in presign: {data.keys()}"

        assert data["method"] == "PUT"
        assert data["storageKey"] == data["key"]
        assert isinstance(data["headers"], dict)
        assert isinstance(data["expiresInSec"], int) and data["expiresInSec"] > 0

        # mock-mode marker: uploadUrl is the local proxy route
        assert data["uploadUrl"].startswith("/api/v1/documents/mock-upload/"), (
            f"expected mock-upload URL, got {data['uploadUrl']!r}"
        )
