#!/bin/bash

# Migration helper script to find remaining base44 references
# This helps identify files that still need updating

echo "🔍 Finding remaining base44 references..."
echo ""

# Find files with base44 references
grep -r "base44\.\(auth\|entities\|integrations\)" src/ --include="*.jsx" --include="*.js" --include="*.ts" --include="*.tsx" | cut -d: -f1 | sort -u | while read file; do
  echo "  📄 $file"
done

echo ""
echo "✅ Run this to see which files still need migration"

