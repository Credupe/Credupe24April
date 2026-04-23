"""
Iteration 4 — JwtAuthGuard optional-auth behaviour on @Public() routes.

Fix under test: /app/backend/src/common/guards/jwt-auth.guard.ts
  - Public routes now attempt super.canActivate(ctx) and swallow any throw,
    so `req.user` gets populated when a valid token is present, but missing /
    invalid / expired / malformed tokens never 401 the public route.
  - Protected routes are unchanged (401 on missing / bad token).

POST /api/v1/quotes is the canonical optional-auth route and is used as the
probe. GET /api/v1/auth/me and GET /api/v1/loan-applications/mine are used
as the protected-route regression probes.
"""
import os
import requests
import pytest


# ---------------- helpers ----------------

def _ok(body):
    assert isinstance(body, dict) and body.get("success") is True, body
    return body["data"]


def _quote_payload():
    return {
        "loanType": "PERSONAL_LOAN",
        "amount": 500000,
        "tenureMonths": 36,
        "monthlyIncome": 80000,
        "cibilScore": 760,
        "city": "Bengaluru",
        "state": "KA",
    }


# ---------------- optional-auth on POST /quotes ----------------

class TestOptionalAuthOnPublicQuoteRoute:
    def test_valid_token_populates_user_id(self, customer_client, api):
        """Baseline: a real Bearer token -> quote.userId == /auth/me id (the HIGH-3 fix)."""
        me = customer_client.get(f"{api}/auth/me")
        assert me.status_code == 200, me.text
        uid = (_ok(me.json()).get("id") or _ok(me.json()).get("sub"))
        assert uid

        r = customer_client.post(f"{api}/quotes", json=_quote_payload())
        assert r.status_code in (200, 201), r.text
        assert _ok(r.json())["userId"] == uid

    def test_no_header_yields_null_user_id(self, anon_client, api):
        """No Authorization header -> public access, userId is null."""
        r = anon_client.post(f"{api}/quotes", json=_quote_payload())
        assert r.status_code in (200, 201), r.text
        assert _ok(r.json())["userId"] is None

    @pytest.mark.parametrize(
        "token_label,token",
        [
            ("malformed_not_a_jwt", "this.is.not-a-jwt"),
            # Note: `Authorization: Bearer ` (empty value after Bearer) is an illegal
            # HTTP header and rejected by the starlette->httpx proxy with 502 before
            # it ever reaches Nest. Skipped as it does not exercise the guard.
            ("random_string", "abcdefg12345"),
            ("three_junk_parts", "aaa.bbb.ccc"),
            (
                # Expired HS256 JWT (exp=1700000000 → 2023-11-14, iat=1600000000).
                # Signature is arbitrary; passport-jwt should reject signature or expiry.
                "expired_or_bad_sig_jwt",
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
                "eyJzdWIiOiJ0ZXN0IiwiaWF0IjoxNjAwMDAwMDAwLCJleHAiOjE3MDAwMDAwMDB9."
                "invalidsignature",
            ),
        ],
    )
    def test_bad_token_still_returns_200_with_null_user_id(self, api, token_label, token):
        """Invalid / expired / malformed Bearer must NOT 401 on an optional-auth route."""
        r = requests.post(
            f"{api}/quotes",
            json=_quote_payload(),
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json",
            },
            timeout=30,
        )
        # Must not 401 — public route tolerates a bad token
        assert r.status_code in (200, 201), f"[{token_label}] expected 2xx got {r.status_code}: {r.text[:300]}"
        data = _ok(r.json())
        assert data["userId"] is None, f"[{token_label}] userId should be null when token is invalid, got {data['userId']!r}"


# ---------------- protected-route regression ----------------

class TestProtectedRoutesStillGuarded:
    def test_auth_me_without_token_is_401(self, api):
        r = requests.get(f"{api}/auth/me", timeout=30)
        assert r.status_code == 401, f"expected 401 got {r.status_code}: {r.text[:200]}"

    def test_auth_me_with_valid_token_is_200(self, customer_client, api):
        r = customer_client.get(f"{api}/auth/me")
        assert r.status_code == 200, r.text
        assert _ok(r.json())

    def test_loan_applications_mine_without_token_is_401(self, api):
        r = requests.get(f"{api}/loan-applications/mine", timeout=30)
        assert r.status_code == 401, f"expected 401 got {r.status_code}: {r.text[:200]}"

    def test_loan_applications_mine_with_valid_token_is_200(self, customer_client, api):
        r = customer_client.get(f"{api}/loan-applications/mine")
        assert r.status_code == 200, r.text
        body = r.json()
        assert body.get("success") is True, body

    def test_auth_me_with_malformed_token_is_401(self, api):
        r = requests.get(
            f"{api}/auth/me",
            headers={"Authorization": "Bearer this.is.not-a-jwt"},
            timeout=30,
        )
        assert r.status_code == 401, f"expected 401 got {r.status_code}: {r.text[:200]}"
