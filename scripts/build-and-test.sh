#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "==> [1/5] Checking code formatting with Prettier..."
npm run format:check

echo "==> [2/5] Running ESLint..."
npm run lint

echo "==> [3/5] Running API unit tests with coverage..."
npm --prefix api test

echo "==> [4/5] Running Web unit tests with coverage..."
npm --prefix web test

echo "==> [5/5] Building Docker images locally..."
docker build -t quicknotes-api:local ./api
docker build -t quicknotes-web:local ./web

echo "All local checks and Docker builds succeeded!"
