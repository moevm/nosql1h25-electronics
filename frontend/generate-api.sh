#!/bin/bash

USE_DOCKER=false

for arg in "$@"
do
  if [ "$arg" == "--docker" ]; then
    USE_DOCKER=true
  fi
done

BACKEND_SWAGGER_PATH="./schema.json"
FRONTEND_API_DIR="./src/api"
TMP_DIR="./tmp/openapi_codegen_tmp"

if [ "$USE_DOCKER" = true ]; then
  echo "generating schema.json using Docker..."

  echo "running backend container..."
  docker-compose -f ../docker-compose.yml up --build backend -d
  echo "backend container is running"

  echo "executing swagger generation in backend..."
  docker-compose -f ../docker-compose.yml exec backend python manage.py spectacular --format openapi-json --file /app/schema.json
  
  echo "executing swagger generation in backend..."
  cp ../backend/schema.json ./schema.json
else
  echo "generating schema.json locally..."
  
  python ../backend/manage.py spectacular --format openapi-json --file schema.json
fi

if [ $? -ne 0 ]; then
  echo "Error: Failed to generate schema.json (command failed)"
  exit 1
fi

echo "swagger file succesfully generated"
echo "generating API client..."

mkdir -p "$TMP_DIR"

if [ -f "$FRONTEND_API_DIR/apiClient.ts" ]; then
  cp "$FRONTEND_API_DIR/apiClient.ts" "$TMP_DIR"
fi

if [ -d "$FRONTEND_API_DIR/middleware" ]; then
  cp -r "$FRONTEND_API_DIR/middleware" "$TMP_DIR"
fi

rm -rf "$FRONTEND_API_DIR"

npx openapi-typescript-codegen --input "$BACKEND_SWAGGER_PATH" \
  --output "$FRONTEND_API_DIR" \
  --client axios \
  --useOptions \
  --useUnionTypes

if [ -f "$TMP_DIR/apiClient.ts" ]; then
  cp "$TMP_DIR/apiClient.ts" "$FRONTEND_API_DIR"
fi

if [ -d "$TMP_DIR/middleware" ]; then
  cp -r "$TMP_DIR/middleware" "$FRONTEND_API_DIR/middleware"
fi

rm -rf "$TMP_DIR"

echo "API client generated"

npm run patch-request
