#!/usr/bin/env bash
set -euo pipefail

API_URL="${API_URL:-http://localhost:3000}"
REDIS_HOST="${REDIS_HOST:-localhost}"
REDIS_PORT="${REDIS_PORT:-6379}"
REDIS_CONTAINER="${REDIS_CONTAINER:-mini-loja-redis}"

pass() { echo "✓ $1"; }
fail() { echo "✗ $1"; exit 1; }

redis_available() {
  if command -v redis-cli >/dev/null 2>&1; then
    return 0
  fi

  if command -v docker >/dev/null 2>&1; then
    docker ps --format '{{.Names}}' 2>/dev/null | grep -qx "$REDIS_CONTAINER"
    return $?
  fi

  return 1
}

redis_get() {
  local key="$1"

  if command -v redis-cli >/dev/null 2>&1; then
    redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" GET "$key"
    return
  fi

  docker exec "$REDIS_CONTAINER" redis-cli GET "$key"
}

echo "=== Mini Loja — integration validation ==="
echo "API: $API_URL"
echo

health=$(curl -sf "$API_URL/health") || fail "Backend unreachable at $API_URL/health"
echo "$health" | grep -q '"databaseConnected":true' || fail "Database not connected"
echo "$health" | grep -q '"redisConnected":true' || fail "Redis not connected"
pass "Health check"

category=$(curl -sf -X POST "$API_URL/categories" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Integration Category"}')
category_id=$(echo "$category" | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)
[ -n "$category_id" ] || fail "Category creation failed"
pass "Create category (id=$category_id)"

product=$(curl -sf -X POST "$API_URL/products" \
  -H 'Content-Type: application/json' \
  -d "{\"name\":\"Integration Product\",\"description\":\"E2E test\",\"price\":12.5,\"categoryId\":$category_id}")
product_id=$(echo "$product" | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)
[ -n "$product_id" ] || fail "Product creation failed"
pass "Create product (id=$product_id)"

curl -sf "$API_URL/products?page=1&limit=10" | grep -q 'Integration Product' \
  || fail "Product not found in list"
pass "List products"

curl -sf "$API_URL/products/$product_id" | grep -q 'Integration Product' \
  || fail "Product detail failed"
pass "Get product detail"

if redis_available; then
  redis_get "product:$product_id" | grep -q 'Integration Product' \
    || fail "Product detail cache miss after GET"
  pass "Cache populated for product detail"

  curl -sf "$API_URL/products?page=1&limit=10" >/dev/null
  redis_get 'products:list:page=1:limit=10' | grep -q 'Integration Product' \
    || fail "Product list cache miss after GET"
  pass "Cache populated for product list"
else
  echo "⚠ Skipping Redis cache checks (redis-cli and container $REDIS_CONTAINER unavailable)"
fi

curl -sf -X PATCH "$API_URL/products/$product_id" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Integration Product Updated"}' >/dev/null \
  || fail "Product update failed"
pass "Update product"

if redis_available; then
  cache=$(redis_get "product:$product_id")
  [ -z "$cache" ] && pass "Product detail cache invalidated after update" \
    || fail "Product detail cache still present after update"
fi

curl -sf -X DELETE "$API_URL/products/$product_id" >/dev/null \
  || fail "Product delete failed"
pass "Delete product"

if redis_available; then
  cache=$(redis_get 'products:list:page=1:limit=10')
  [ -z "$cache" ] && pass "Product list cache invalidated after delete" \
    || fail "Product list cache still present after delete"
fi

echo
echo "All integration checks passed."
