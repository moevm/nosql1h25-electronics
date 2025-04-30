#!/usr/bin/env sh

BACKEND_SWAGGER_PATH='./schema/schema.json'
FRONTEND_API_DIR='./src/api'
TMP_DIR=$(mktemp -d)

echo 'generating API client...'

if [ -f "$FRONTEND_API_DIR/apiClient.ts" ]; then
  cp "$FRONTEND_API_DIR/apiClient.ts" "$TMP_DIR"
fi

if [ -d "$FRONTEND_API_DIR/middleware" ]; then
  cp -r "$FRONTEND_API_DIR/middleware" "$TMP_DIR"
fi

ls "$TMP_DIR/middleware"

rm -rf "$FRONTEND_API_DIR/*"

npx openapi-typescript-codegen --input "$BACKEND_SWAGGER_PATH" \
  --output "$FRONTEND_API_DIR" \
  --client axios \
  --useOptions \
  --useUnionTypes

if [ -f "$TMP_DIR/apiClient.ts" ]; then
  cp "$TMP_DIR/apiClient.ts" "$FRONTEND_API_DIR"
fi

if [ -d "$TMP_DIR/middleware" ]; then
  cp -r "$TMP_DIR/middleware" "$FRONTEND_API_DIR"
fi

rm -rf "$TMP_DIR"

echo 'API client generated'

npm run patch-request
