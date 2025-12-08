#!/bin/bash
# Test production build locally before deploying

set -e

echo "🧪 Testing Production Build"
echo "=========================="
echo ""

# Clean previous builds
echo "1. Cleaning..."
rm -rf dist
echo "✅ Cleaned"
echo ""

# Install dependencies
echo "2. Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Build
echo "3. Building..."
npm run build
echo "✅ Build complete"
echo ""

# Verify output
echo "4. Verifying output..."
if [ ! -f "dist/index.html" ]; then
  echo "❌ ERROR: dist/index.html not found!"
  exit 1
fi

if [ ! -d "dist/assets" ]; then
  echo "❌ ERROR: dist/assets directory not found!"
  exit 1
fi

echo "✅ Output verified"
echo ""

# Check file sizes
echo "5. Build output:"
ls -lh dist/ | head -10
echo ""

echo "✅ Production build test PASSED"
echo ""
echo "🚀 Ready to deploy!"
echo ""
echo "To test locally:"
echo "  npx serve -s dist -l 3000"
echo ""
echo "To deploy to Vercel:"
echo "  npx vercel --prod"

