# 🔌 Dynamic Port Configuration Guide

## Overview

GenRizz now supports **fully dynamic port configuration** for both local development and containerized deployments. This prevents port conflicts and makes the app more flexible.

## How It Works

### Port Resolution Priority

The app checks for ports in this order:

1. `PORT` environment variable
2. `VITE_PORT` environment variable  
3. `VITE_DEV_PORT` environment variable
4. `DEV_PORT` environment variable
5. Default: `5174`

### Local Development

#### Option 1: Auto-find Available Port (Recommended)

```bash
npm run dev:auto
```

This automatically finds an available port starting from 5174.

#### Option 2: Specify Port

```bash
PORT=5175 npm run dev
# or
VITE_PORT=5175 npm run dev
```

#### Option 3: Safe Default Port

```bash
npm run dev:safe  # Always uses 5174
```

### Docker Development

#### Using Environment Variable

```bash
# Set port in .env or environment
export APP_PORT=5175

# Start container
docker-compose up app-dev
```

#### Using docker-compose.override.yml

Create `docker-compose.override.yml`:

```yaml
services:
  app-dev:
    ports:
      - "5175:5175"
    environment:
      - PORT=5175
      - VITE_PORT=5175
```

#### Direct Port Override

```bash
APP_PORT=5175 docker-compose up app-dev
```

### Docker Production

Production uses Nginx on port 80 inside the container:

```bash
# Map to custom host port
PROD_PORT=8081 docker-compose --profile production up app-prod
```

## Port Checking Tools

### Check Specific Port

```bash
npm run check:port dev 5174
```

### Find Available Port

```bash
node scripts/find-available-port.js 5174
# Outputs: 5174 (or next available)
```

### Full Application Audit

```bash
npm run audit
```

Checks:
- Port availability
- Environment configuration
- Dependencies
- Common issues

## Container Port Mapping

### Development Container

```yaml
ports:
  - "${APP_PORT:-5174}:${APP_PORT:-5174}"
```

This maps:
- **Host port** = Container port
- Both use the same `APP_PORT` value
- Default: 5174

### Production Container

```yaml
ports:
  - "${PROD_PORT:-8080}:80"
```

This maps:
- **Host port** = `PROD_PORT` (default: 8080)
- **Container port** = 80 (Nginx)

## Environment Variables

### Local Development

```env
# .env.local
PORT=5174
VITE_PORT=5174
```

### Docker Development

```env
# .env or docker-compose environment
APP_PORT=5174
PORT=5174
VITE_PORT=5174
```

### Docker Production

```env
PROD_PORT=8080
```

## Troubleshooting

### Port Already in Use

**Local:**
```bash
# Find what's using the port
lsof -i :5174

# Use auto-find
npm run dev:auto

# Or specify different port
PORT=5175 npm run dev
```

**Docker:**
```bash
# Check container ports
docker ps

# Use different port
APP_PORT=5175 docker-compose up app-dev
```

### Container Port Conflicts

If you have multiple containers:

1. **Use different ports per container:**
   ```bash
   # Container 1
   APP_PORT=5174 docker-compose up app-dev
   
   # Container 2 (different project)
   APP_PORT=5175 docker-compose -p other-project up app-dev
   ```

2. **Use docker-compose.override.yml:**
   ```yaml
   services:
     app-dev:
       ports:
         - "5175:5175"
   ```

### Vite Port Fallback

If the specified port is in use, Vite will:
- Try the next available port (if `strictPort: false`)
- Show a warning in the console
- Display the actual port in use

## Best Practices

1. **Use `npm run dev:auto`** for local development
2. **Set `APP_PORT` in .env** for Docker consistency
3. **Use port checker** before starting: `npm run check:port`
4. **Document custom ports** in your team's setup guide
5. **Use different ports** for different environments (dev/staging/prod)

## Examples

### Local Development

```bash
# Auto-find port
npm run dev:auto

# Custom port
PORT=5175 npm run dev

# Check before starting
npm run check:port dev 5175 && PORT=5175 npm run dev
```

### Docker Development

```bash
# Default port (5174)
docker-compose up app-dev

# Custom port
APP_PORT=5175 docker-compose up app-dev

# With environment file
echo "APP_PORT=5175" > .env
docker-compose up app-dev
```

### Production

```bash
# Default (8080)
docker-compose --profile production up app-prod

# Custom port
PROD_PORT=8081 docker-compose --profile production up app-prod
```

## Scripts Reference

- `npm run dev` - Start with default port (5174)
- `npm run dev:safe` - Always use 5174
- `npm run dev:auto` - Auto-find available port
- `npm run dev:custom` - Use PORT env var
- `npm run check:port` - Check port availability
- `npm run audit` - Full application audit

