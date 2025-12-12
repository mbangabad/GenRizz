#!/usr/bin/env bash
set -euo pipefail
SCHEMA_FILE="$(dirname "$0")/../supabase/schema.sql"
if [ ! -f "$SCHEMA_FILE" ]; then
  echo "Schema file not found: $SCHEMA_FILE" >&2
  exit 1
fi
supabase db push --file "$SCHEMA_FILE"
