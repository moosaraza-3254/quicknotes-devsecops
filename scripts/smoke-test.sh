#!/usr/bin/env bash
set -euo pipefail

WEB_URL="${1:-http://localhost:3000}"
API_URL="${2:-http://localhost:4000}"
MAX_RETRIES="${MAX_RETRIES:-15}"
SLEEP_SECONDS="${SLEEP_SECONDS:-4}"

wait_for_health() {
  local name="$1"
  local url="$2"
  local attempt=1

  while [ "$attempt" -le "$MAX_RETRIES" ]; do
    if curl -fsS "$url" >/dev/null 2>&1; then
      echo "[OK] $name healthy at $url"
      return 0
    fi
    echo "[WAIT] $name not ready yet ($attempt/$MAX_RETRIES)..."
    sleep "$SLEEP_SECONDS"
    attempt=$((attempt + 1))
  done

  echo "[FAIL] $name failed health check at $url after $MAX_RETRIES attempts" >&2
  return 1
}

echo "==> Running post-deployment smoke tests..."
wait_for_health "API service" "${API_URL}/health"
wait_for_health "Web service" "${WEB_URL}/health"

TEST_MARKER="smoke-test-$(date +%s)"
echo "==> Testing POST ${API_URL}/api/notes..."
CREATE_RESP=$(curl -fsS -X POST "${API_URL}/api/notes" \
  -H "Content-Type: application/json" \
  -d "{\"content\":\"${TEST_MARKER}\"}")

if ! echo "$CREATE_RESP" | grep -q "$TEST_MARKER"; then
  echo "[FAIL] Created note did not echo expected marker" >&2
  exit 1
fi

echo "==> Testing GET ${WEB_URL}/notes proxy..."
LIST_RESP=$(curl -fsS "${WEB_URL}/notes")
if ! echo "$LIST_RESP" | grep -q "$TEST_MARKER"; then
  echo "[FAIL] Created note not returned through web proxy" >&2
  exit 1
fi

echo "[PASS] Smoke tests passed successfully!"
