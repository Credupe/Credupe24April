import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "http://localhost:8001").rstrip("/")
API = f"{BASE_URL}/api/v1"

ADMIN = {"email": "admin@credupe.local", "password": "Admin@12345"}
CUSTOMER = {"email": "customer@credupe.local", "password": "Customer@123"}
PARTNER = {"email": "partner@credupe.local", "password": "Partner@123"}


def _login(creds):
    # After HIGH-1 fix, proxy no longer forwards stale content-encoding — drop workaround.
    r = requests.post(f"{API}/auth/login", json=creds, timeout=30)
    assert r.status_code in (200, 201), f"login {creds['email']} failed: {r.status_code} {r.text}"
    body = r.json()
    assert body.get("success") is True
    return body["data"]


@pytest.fixture(scope="session")
def api():
    return API


@pytest.fixture(scope="session")
def admin_tokens():
    return _login(ADMIN)


@pytest.fixture(scope="session")
def customer_tokens():
    return _login(CUSTOMER)


@pytest.fixture(scope="session")
def partner_tokens():
    return _login(PARTNER)


def _client(token=None):
    s = requests.Session()
    s.headers["Content-Type"] = "application/json"
    # Intentionally allow default Accept-Encoding (gzip/deflate) after HIGH-1 fix.
    if token:
        s.headers["Authorization"] = f"Bearer {token}"
    return s


@pytest.fixture
def admin_client(admin_tokens):
    return _client(admin_tokens["accessToken"])


@pytest.fixture
def customer_client(customer_tokens):
    return _client(customer_tokens["accessToken"])


@pytest.fixture
def partner_client(partner_tokens):
    return _client(partner_tokens["accessToken"])


@pytest.fixture
def anon_client():
    return _client()
