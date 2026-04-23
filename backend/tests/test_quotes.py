"""
Iteration 3 — Pre-qualified Offers (Quote Engine) tests.

Covers the 3 new endpoints:
  POST   /api/v1/quotes              (Public; binds to user if JWT present)
  GET    /api/v1/quotes/:id          (Public; 404 envelope if missing)
  POST   /api/v1/quotes/:id/apply    (CUSTOMER only; ADMIN/PARTNER -> 403)

Also re-validates EMI math, Redis 24h persistence (immediate-read), the
no-matching-products edge case, and the JWT user binding.
"""
import os
import time
import requests
import pytest


# ---------------- helpers ----------------

def _envelope_ok(body):
    assert isinstance(body, dict) and body.get("success") is True, body
    assert "data" in body, body
    return body["data"]


def _envelope_err(body):
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
    }
    p.update(overrides)
    return p


# ---------------- POST /quotes (public) ----------------

class TestQuoteCreatePublic:
    def test_create_quote_unauth_returns_ranked_offers(self, anon_client, api):
        r = anon_client.post(f"{api}/quotes", json=_new_quote_payload())
        assert r.status_code in (200, 201), r.text
        data = _envelope_ok(r.json())

        # top-level shape
        assert data["id"].startswith("Q-")
        assert data["userId"] is None
        assert data["loanType"] == "PERSONAL_LOAN"
        assert data["amount"] == 500000
        assert data["tenureMonths"] == 36
        assert "expiresAt" in data and "createdAt" in data
        assert isinstance(data["offers"], list)
        assert data["offersCount"] == len(data["offers"])
        assert data["offersCount"] >= 1
        assert data["bestOffer"] is not None
        assert data["bestOffer"]["productId"] == data["offers"][0]["productId"]

        # offers ranked ascending by emi.best
        emis = [o["emi"]["best"] for o in data["offers"]]
        assert emis == sorted(emis), f"offers not sorted asc by emi.best: {emis}"

        # each offer carries the documented fields
        for o in data["offers"]:
            for k in ("emi", "processingFee", "totalInterestBest", "totalPayableBest"):
                assert k in o, f"missing {k} on offer {o.get('productId')}"
            for k in ("best", "worst", "rateBest", "rateWorst"):
                assert k in o["emi"]

    def test_expires_at_is_24h_after_created_at(self, anon_client, api):
        r = anon_client.post(f"{api}/quotes", json=_new_quote_payload())
        data = _envelope_ok(r.json())
        # very loose parse: difference between expiresAt and createdAt ~= 24h
        from datetime import datetime
        c = datetime.fromisoformat(data["createdAt"].replace("Z", "+00:00"))
        e = datetime.fromisoformat(data["expiresAt"].replace("Z", "+00:00"))
        delta_h = (e - c).total_seconds() / 3600.0
        assert 23.99 <= delta_h <= 24.01, f"expiresAt - createdAt = {delta_h}h"

    def test_emi_math_500k_36m_at_1049pct(self, anon_client, api):
        r = anon_client.post(f"{api}/quotes", json=_new_quote_payload())
        data = _envelope_ok(r.json())
        # find HDFC (10.49% best rate per seed) — verify monthly EMI ≈ 16249
        hdfc = next(
            (o for o in data["offers"] if o["emi"]["rateBest"] == 10.49),
            None,
        )
        assert hdfc is not None, "expected an offer at 10.49% best rate"
        assert abs(hdfc["emi"]["best"] - 16248.86) < 1.0, hdfc["emi"]

    def test_create_quote_with_jwt_binds_user_id(self, customer_tokens, customer_client, api):
        # customer has a user id we can read from /auth/me
        me = customer_client.get(f"{api}/auth/me")
        assert me.status_code == 200, me.text
        me_data = _envelope_ok(me.json())
        uid = me_data.get("id") or me_data.get("sub")
        assert uid, f"could not read user id from /auth/me: {me_data}"

        r = customer_client.post(f"{api}/quotes", json=_new_quote_payload())
        assert r.status_code in (200, 201), r.text
        data = _envelope_ok(r.json())
        assert data["userId"] == uid

    def test_create_quote_no_matching_products_returns_zero_offers(self, anon_client, api):
        # Wildly insufficient income + low CIBIL => no eligible products
        payload = _new_quote_payload(
            amount=10_000_000_000,  # 1000 crore
            monthlyIncome=1,
            cibilScore=300,
        )
        r = anon_client.post(f"{api}/quotes", json=payload)
        assert r.status_code in (200, 201), r.text
        data = _envelope_ok(r.json())
        assert data["offersCount"] == 0
        assert data["bestOffer"] is None
        assert data["offers"] == []


# ---------------- GET /quotes/:id (public) ----------------

class TestQuoteGet:
    def test_get_existing_quote_returns_same_payload(self, anon_client, api):
        c = anon_client.post(f"{api}/quotes", json=_new_quote_payload())
        created = _envelope_ok(c.json())
        qid = created["id"]

        # immediate-read confirms Redis persistence
        g = anon_client.get(f"{api}/quotes/{qid}")
        assert g.status_code == 200, g.text
        fetched = _envelope_ok(g.json())
        assert fetched["id"] == qid
        assert fetched["offersCount"] == created["offersCount"]
        assert fetched["bestOffer"]["productId"] == created["bestOffer"]["productId"]

    def test_get_unknown_quote_returns_404_envelope(self, anon_client, api):
        r = anon_client.get(f"{api}/quotes/Q-DOES-NOT-EXIST")
        assert r.status_code == 404, r.text
        err = _envelope_err(r.json())
        # Standard envelope: error.message present
        assert "message" in err


# ---------------- POST /quotes/:id/apply (CUSTOMER only) ----------------

class TestQuoteApplyRBAC:
    def test_admin_forbidden(self, anon_client, admin_client, api):
        c = anon_client.post(f"{api}/quotes", json=_new_quote_payload())
        qid = _envelope_ok(c.json())["id"]
        r = admin_client.post(f"{api}/quotes/{qid}/apply", json={})
        assert r.status_code == 403, r.text

    def test_partner_forbidden(self, anon_client, partner_client, api):
        c = anon_client.post(f"{api}/quotes", json=_new_quote_payload())
        qid = _envelope_ok(c.json())["id"]
        r = partner_client.post(f"{api}/quotes/{qid}/apply", json={})
        assert r.status_code == 403, r.text

    def test_anon_unauthorized(self, anon_client, api):
        c = anon_client.post(f"{api}/quotes", json=_new_quote_payload())
        qid = _envelope_ok(c.json())["id"]
        r = anon_client.post(f"{api}/quotes/{qid}/apply", json={})
        assert r.status_code in (401, 403), r.text


class TestQuoteApplyConversion:
    def test_customer_apply_creates_lead_application(self, customer_client, api):
        c = customer_client.post(f"{api}/quotes", json=_new_quote_payload())
        created = _envelope_ok(c.json())
        qid = created["id"]
        best = created["bestOffer"]

        r = customer_client.post(f"{api}/quotes/{qid}/apply", json={"purpose": "TEST_quote_apply"})
        assert r.status_code in (200, 201), r.text
        body = _envelope_ok(r.json())

        assert body["status"] == "LEAD"
        app = body["application"]
        assert app["status"] == "LEAD"
        assert app.get("referenceNo"), f"expected referenceNo on application, got {app}"
        # Form data binding
        fd = app.get("formData") or app.get("form_data") or {}
        assert fd.get("sourceQuoteId") == qid
        assert abs(float(fd.get("expectedEmi")) - best["emi"]["best"]) < 0.5
        assert float(fd.get("expectedRate")) == best["emi"]["rateBest"]
        assert fd.get("lender") == best["lender"]["name"]
        # appliedOffer matches bestOffer when productId omitted
        assert body["appliedOffer"]["productId"] == best["productId"]

    def test_customer_apply_with_specific_product_id(self, customer_client, api):
        c = customer_client.post(f"{api}/quotes", json=_new_quote_payload())
        created = _envelope_ok(c.json())
        qid = created["id"]
        # pick a NON-best offer (last in list) so we know productId selection works
        chosen = created["offers"][-1]
        r = customer_client.post(
            f"{api}/quotes/{qid}/apply",
            json={"productId": chosen["productId"], "purpose": "TEST_specific_offer"},
        )
        assert r.status_code in (200, 201), r.text
        body = _envelope_ok(r.json())
        assert body["appliedOffer"]["productId"] == chosen["productId"]
        fd = body["application"].get("formData") or body["application"].get("form_data") or {}
        assert fd.get("lender") == chosen["lender"]["name"]

    def test_customer_apply_on_zero_offer_quote_returns_400(self, customer_client, api):
        # Build a quote with no matching products (under customer auth, so apply is reachable)
        bad = _new_quote_payload(amount=10_000_000_000, monthlyIncome=1, cibilScore=300)
        c = customer_client.post(f"{api}/quotes", json=bad)
        created = _envelope_ok(c.json())
        assert created["offersCount"] == 0
        qid = created["id"]
        r = customer_client.post(f"{api}/quotes/{qid}/apply", json={})
        assert r.status_code == 400, r.text
        err = _envelope_err(r.json())
        # Iter-4 fix verification: error.code must now be the stable machine code NO_MATCHING_OFFER
        assert err.get("code") == "NO_MATCHING_OFFER", f"expected code NO_MATCHING_OFFER, got {err!r}"
        msg = err.get("message")
        if isinstance(msg, list):
            msg = " ".join(str(m) for m in msg)
        assert "No matching offer" in (msg or ""), err


# ---------------- Persistence (Redis 24h TTL — immediate read) ----------------

class TestQuotePersistenceImmediate:
    def test_create_then_get_within_seconds(self, anon_client, api):
        c = anon_client.post(f"{api}/quotes", json=_new_quote_payload())
        qid = _envelope_ok(c.json())["id"]
        time.sleep(0.5)
        g = anon_client.get(f"{api}/quotes/{qid}")
        assert g.status_code == 200
        assert _envelope_ok(g.json())["id"] == qid
