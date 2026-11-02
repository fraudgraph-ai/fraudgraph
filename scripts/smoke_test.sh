#!/usr/bin/env bash
# FraudGraph AI — Automated API Smoke Test & System Health Verification
set -e

export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

PORT=8011
echo "🚀 Launching transient FastAPI instance on port $PORT for smoke testing..."
PYTHONPATH=apps/api apps/api/.venv/bin/uvicorn src.main:app --port $PORT --log-level warning &
PID=$!

cleanup() {
  echo "🧹 Terminating transient smoke test server (PID: $PID)..."
  kill $PID 2>/dev/null || true
  wait $PID 2>/dev/null || true
}
trap cleanup EXIT

# Wait for service readiness
for i in {1..15}; do
  if curl -s http://127.0.0.1:$PORT/health | grep -q "HEALTHY"; then
    echo "✅ Service reached HEALTHY state in iteration $i"
    break
  fi
  sleep 0.5
done

echo "🔍 Validating Core Healthcheck Endpoint..."
curl -sf http://127.0.0.1:$PORT/health | grep -q '"status":"HEALTHY"'
echo "   [PASSED] /health"

echo "🔍 Validating Datasets Catalog Endpoint..."
curl -sf http://127.0.0.1:$PORT/api/v1/datasets/ | grep -q "ibm_amlsim_500k"
echo "   [PASSED] /api/v1/datasets/"

echo "🔍 Validating Benchmark Leaderboard Matrix (RQ-07)..."
curl -sf http://127.0.0.1:$PORT/api/v1/benchmarks/leaderboard | grep -q "MOD-FUSION-AGENTS"
echo "   [PASSED] /api/v1/benchmarks/leaderboard"

echo "🔍 Validating FinCEN SAR XML Export (RQ-04)..."
curl -sf http://127.0.0.1:$PORT/api/v1/evidence/FG-8421/sar-xml | grep -q "<SuspiciousActivityReport"
echo "   [PASSED] /api/v1/evidence/FG-8421/sar-xml"

echo "🔍 Validating Alert Intelligence Feed Endpoint..."
curl -sf http://127.0.0.1:$PORT/api/v1/alerts/ | grep -q "ALT-1094"
echo "   [PASSED] /api/v1/alerts/"

echo "🔍 Validating Transaction Intelligence Feed Endpoint..."
curl -sf "http://127.0.0.1:$PORT/api/v1/transactions/?min_amount=1000000" | grep -q "TX-901842"
echo "   [PASSED] /api/v1/transactions/"

echo "🔍 Validating AML Rule Studio & Simulation Endpoints (RQ-06)..."
curl -sf http://127.0.0.1:$PORT/api/v1/rules/ | grep -q "RUL-CIRC-01"
echo "   [PASSED] /api/v1/rules/"
curl -sf -X POST http://127.0.0.1:$PORT/api/v1/rules/RUL-CIRC-01/simulate -H "Content-Type: application/json" -d '{"dataset":"ibm_amlsim_500k","sample_entities_limit":50}' | grep -q '"rule_id":"RUL-CIRC-01"'
echo "   [PASSED] /api/v1/rules/RUL-CIRC-01/simulate"

echo "🔍 Validating Compliance Four-Eye Audit Ledger Endpoint..."
curl -sf http://127.0.0.1:$PORT/api/v1/compliance/audit-logs | grep -q "AUD-901"
echo "   [PASSED] /api/v1/compliance/audit-logs"

echo "🎉 All smoke test endpoints verified successfully!"
