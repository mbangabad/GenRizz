#!/bin/bash
# GenRizz Deployment Script
# This script helps deploy to Supabase and Vercel

set -e

echo "🚀 GenRizz Deployment Script"
echo "============================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Supabase CLI is available
if command -v supabase &> /dev/null || command -v npx &> /dev/null; then
    echo -e "${GREEN}✅ Supabase CLI available${NC}"
    SUPABASE_CMD="supabase"
    if ! command -v supabase &> /dev/null; then
        SUPABASE_CMD="npx supabase"
    fi
else
    echo -e "${RED}❌ Supabase CLI not found${NC}"
    echo "Install with: npm install -g supabase"
    exit 1
fi

# Check if Vercel CLI is available
if command -v vercel &> /dev/null || command -v npx &> /dev/null; then
    echo -e "${GREEN}✅ Vercel CLI available${NC}"
    VERCEL_CMD="vercel"
    if ! command -v vercel &> /dev/null; then
        VERCEL_CMD="npx vercel"
    fi
else
    echo -e "${RED}❌ Vercel CLI not found${NC}"
    echo "Install with: npm install -g vercel"
    exit 1
fi

echo ""
echo "What would you like to do?"
echo "1. Deploy database schema to Supabase"
echo "2. Deploy to Vercel"
echo "3. Do both"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "📊 Deploying database schema..."
        echo "Make sure you're logged in: $SUPABASE_CMD login"
        echo "And linked to a project: $SUPABASE_CMD link"
        echo ""
        read -p "Press Enter to continue or Ctrl+C to cancel..."
        
        if [ -f "supabase/schema.sql" ]; then
            echo "Running schema..."
            $SUPABASE_CMD db push || {
                echo "If db push doesn't work, try:"
                echo "$SUPABASE_CMD db execute -f supabase/schema.sql"
            }
        else
            echo "❌ supabase/schema.sql not found"
        fi
        ;;
    2)
        echo ""
        echo "🚀 Deploying to Vercel..."
        echo "Make sure you're logged in: $VERCEL_CMD login"
        echo ""
        read -p "Press Enter to continue or Ctrl+C to cancel..."
        
        echo "Building..."
        npm run build
        
        echo "Deploying..."
        $VERCEL_CMD --prod
        ;;
    3)
        echo ""
        echo "📊 Step 1: Deploying database schema..."
        if [ -f "supabase/schema.sql" ]; then
            $SUPABASE_CMD db push || echo "Note: You may need to run this manually in Supabase dashboard"
        fi
        
        echo ""
        echo "🚀 Step 2: Deploying to Vercel..."
        npm run build
        $VERCEL_CMD --prod
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"

