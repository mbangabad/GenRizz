# 🔧 Install CLI Tools & MCP Servers

## Install Supabase CLI

### Option 1: Via Homebrew (macOS)
```bash
brew install supabase/tap/supabase
```

### Option 2: Via npm (Global)
```bash
npm install -g supabase
```

### Option 3: Via npx (No installation needed)
```bash
npx supabase --version
```

## Install Vercel CLI

### Option 1: Via npm (Global)
```bash
npm install -g vercel
```

### Option 2: Via npx (No installation needed)
```bash
npx vercel --version
```

## Install MCP Servers (Optional)

MCP (Model Context Protocol) servers can be configured in Cursor settings. Here's how:

### 1. Check Cursor Settings
- Open Cursor Settings
- Look for "MCP Servers" or "Model Context Protocol" section

### 2. Add Supabase MCP Server
If available, add:
```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server"]
    }
  }
}
```

### 3. Add Vercel MCP Server
If available, add:
```json
{
  "mcpServers": {
    "vercel": {
      "command": "npx",
      "args": ["-y", "@vercel/mcp-server"]
    }
  }
}
```

## Quick Install Script

I can create a script to install everything. Would you like me to:
1. Install Supabase CLI globally
2. Install Vercel CLI globally
3. Check for MCP server availability
4. Set up deployment scripts

Let me know and I'll proceed!

