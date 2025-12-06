# 🔌 MCP Server Setup (Optional)

MCP (Model Context Protocol) servers allow AI assistants to interact directly with Supabase and Vercel. Here's how to set them up:

## What Are MCP Servers?

MCP servers provide a standardized way for AI assistants to:
- Query Supabase databases
- Deploy to Vercel
- Manage projects
- All without manual CLI commands

## Setting Up MCP Servers in Cursor

### Step 1: Open Cursor Settings
1. Open Cursor
2. Go to Settings (Cmd/Ctrl + ,)
3. Search for "MCP" or "Model Context Protocol"

### Step 2: Configure MCP Servers

Add this to your Cursor settings (usually in a config file):

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server"],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "your-access-token"
      }
    },
    "vercel": {
      "command": "npx",
      "args": ["-y", "@vercel/mcp-server"],
      "env": {
        "VERCEL_TOKEN": "your-vercel-token"
      }
    }
  }
}
```

### Step 3: Get Access Tokens

**Supabase Token:**
1. Go to https://supabase.com/dashboard/account/tokens
2. Create new access token
3. Copy token

**Vercel Token:**
1. Go to https://vercel.com/account/tokens
2. Create new token
3. Copy token

### Step 4: Restart Cursor
After adding MCP servers, restart Cursor for changes to take effect.

## Alternative: Use CLI Directly

If MCP servers aren't available or configured, we can use the CLIs directly via `npx`:
- `npx supabase` - For Supabase operations
- `npx vercel` - For Vercel operations

This works just as well and doesn't require MCP setup!

## Current Status

✅ CLIs available via `npx`  
⏳ MCP servers - Optional (can deploy without them)

**We can deploy right now using `npx` commands!**

