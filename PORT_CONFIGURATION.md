# 🔌 Port Configuration Guide

## Default Ports

To avoid conflicts with other applications running on your system, GenRizz uses:

- **Development:** Port `5174` (instead of the common 5173)
- **Production:** Port `8080` (Docker container)

## Why Port 5174?

Port 5173 is the default Vite port and is commonly used by other projects. We use 5174 to avoid conflicts.

## Setting a Custom Port

### Option 1: Environment Variable (Recommended)

Create a `.env.local` file in the project root:

```bash
PORT=5175
VITE_PORT=5175
```

Or set it when running:

```bash
PORT=5175 npm run dev
```

### Option 2: Using the Safe Dev Script

```bash
npm run dev:safe  # Always uses port 5174
```

### Option 3: Custom Port Script

```bash
PORT=5175 npm run dev:custom
```

## Checking Port Availability

Before starting the dev server, check if your desired port is available:

```bash
npm run check:port dev 5174
```

Or check a specific port:

```bash
npm run check:port dev 5175
```

## Docker Ports

Docker containers use different port mappings:

- **Development Container:** Maps host port to container port 5173
- **Production Container:** Maps host port 8080 to container port 80

To change Docker ports, edit `docker-compose.yml`:

```yaml
ports:
  - "5175:5173"  # Host:Container
```

## Troubleshooting Port Conflicts

If you get a "port already in use" error:

1. **Check what's using the port:**
   ```bash
   lsof -i :5174
   ```

2. **Kill the process (if safe to do so):**
   ```bash
   kill -9 <PID>
   ```

3. **Or use a different port:**
   ```bash
   PORT=5175 npm run dev
   ```

4. **Use the port checker:**
   ```bash
   npm run check:port dev
   ```

## Recommended Ports

- **5174-5179:** Safe range for Vite dev servers
- **3000-3010:** Alternative range (if 5174+ are taken)
- **8080:** Production/Docker (avoid if you have other services)

## Environment Files

- `.env.example` - Template with default values
- `.env.local` - Your local overrides (gitignored)
- `.env` - Shared environment (if needed)

Always copy `.env.example` to `.env.local` and fill in your values.

