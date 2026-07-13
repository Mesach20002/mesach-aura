#!/usr/bin/env bash

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"

echo "Checking for processes using ports 3000 and 3001..."

for PORT in 3000 3001; do
  if command -v fuser >/dev/null 2>&1 && fuser -s -n tcp "$PORT"; then
    echo "Stopping the process using port $PORT..."
    fuser -k -n tcp "$PORT" >/dev/null 2>&1 || true
  elif command -v lsof >/dev/null 2>&1; then
    PIDS="$(lsof -ti "tcp:$PORT" || true)"
    if [ -n "$PIDS" ]; then
      echo "Stopping process(es) $PIDS on port $PORT..."
      kill $PIDS || true
    fi
  fi

  for _ in $(seq 1 20); do
    if ! fuser -s -n tcp "$PORT" 2>/dev/null; then
      break
    fi
    sleep 0.25
  done

  if fuser -s -n tcp "$PORT" 2>/dev/null; then
    echo "Port $PORT is still in use. Stop its process and try again." >&2
    exit 1
  fi
done

echo "Starting Aurora SkinSense on http://localhost:3000"
npm run dev
