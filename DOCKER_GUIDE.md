# 🐳 Docker Containerization Guide

This guide explains how to run GenRizz in Docker containers to avoid port conflicts and ensure consistent deployments.

## 📋 Overview

The application uses Docker for:
- **Development**: Hot-reload development server in a container
- **Production**: Optimized production build served with nginx
- **Port Management**: Configurable ports to avoid conflicts

## 🚀 Quick Start

### Development Mode

```bash
# Start development server (default port 5173)
npm run docker:dev

# Or with custom port
APP_PORT=3000 npm run docker:dev

# Build and start
npm run docker:dev:build
npm run docker:dev
```

### Production Mode

```bash
# Build and start production server (default port 8080)
npm run docker:prod:build
npm run docker:prod

# Or with custom port
PROD_PORT=9000 npm run docker:prod
```

## 🔧 Configuration

### Port Configuration

Ports can be configured via environment variables or `docker-compose.override.yml`:

**Environment Variables:**
```bash
export APP_PORT=5173      # Development port
export PROD_PORT=8080     # Production port
```

**docker-compose.override.yml:**
```yaml
services:
  app-dev:
    ports:
      - "3000:3000"  # Change if port is in use
    environment:
      - APP_PORT=3000
```

### Check Port Availability

Before starting, check if your desired port is available:

```bash
npm run check:port dev 5173
npm run check:port prod 8080
```

The script will:
- ✅ Confirm if the port is available
- ❌ Warn if the port is in use
- 🔍 Suggest an alternative port if needed

## 📁 Docker Files

### `Dockerfile` (Production)
- Multi-stage build for optimal image size
- Uses nginx to serve static files
- Exposes port 80 (mapped to host port via docker-compose)

### `Dockerfile.dev` (Development)
- Development server with hot-reload
- Exposes configurable port (default 5173)
- Mounts source code as volume for live updates

### `docker-compose.yml`
- Orchestrates development and production services
- Manages port mappings
- Handles environment variables
- Sets up networking

## 🛠️ Common Commands

### Development

```bash
# Start development container
docker-compose up app-dev

# Start in background
docker-compose up -d app-dev

# View logs
docker-compose logs -f app-dev

# Stop container
docker-compose down

# Rebuild after dependency changes
docker-compose build app-dev
docker-compose up app-dev
```

### Production

```bash
# Build production image
docker build -t genrizz:latest .

# Run production container
docker run -p 8080:80 genrizz:latest

# Or use docker-compose
docker-compose --profile production up app-prod
```

### Troubleshooting

```bash
# Check if port is in use
lsof -i :5173  # macOS/Linux
netstat -ano | findstr :5173  # Windows

# Find and kill process using port
kill -9 $(lsof -t -i:5173)  # macOS/Linux

# View container logs
docker-compose logs app-dev

# Access container shell
docker-compose exec app-dev sh

# Remove all containers and volumes
docker-compose down -v
```

## 🔒 Port Conflict Prevention

### Strategy 1: Use Environment Variables

```bash
# Set custom port before starting
export APP_PORT=3000
npm run docker:dev
```

### Strategy 2: Use docker-compose Override

Create `docker-compose.override.yml`:

```yaml
version: '3.8'
services:
  app-dev:
    ports:
      - "3000:3000"
    environment:
      - APP_PORT=3000
```

Docker Compose automatically merges this with `docker-compose.yml`.

### Strategy 3: Check Before Starting

```bash
# Check port availability
npm run check:port dev 5173

# If port is in use, use suggested alternative
export APP_PORT=<suggested_port>
npm run docker:dev
```

## 🌐 Network Configuration

The application uses a Docker bridge network (`genrizz-network`) to:
- Isolate containers
- Enable service discovery
- Manage port mappings

### Accessing the Application

- **Development**: http://localhost:5173 (or your configured port)
- **Production**: http://localhost:8080 (or your configured port)

### External Access

To access from other machines on your network:

```yaml
# In docker-compose.yml
ports:
  - "0.0.0.0:5173:5173"  # Listen on all interfaces
```

## 📦 Image Optimization

### Production Image Size

The production image uses:
- Multi-stage build to reduce size
- Alpine Linux base images
- Only production dependencies
- Optimized nginx configuration

### Build Optimization

```bash
# Build with cache
docker build --cache-from genrizz:latest -t genrizz:latest .

# Build without cache (fresh build)
docker build --no-cache -t genrizz:latest .
```

## 🔐 Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **Port Exposure**: Only expose necessary ports
3. **User Permissions**: Run containers as non-root when possible
4. **Image Scanning**: Regularly scan images for vulnerabilities

```bash
# Scan image for vulnerabilities
docker scan genrizz:latest
```

## 🚢 Deployment

### Vercel Deployment

Vercel automatically handles containerization, but you can also:

1. Build the Docker image
2. Push to a container registry (Docker Hub, GitHub Container Registry)
3. Deploy using Vercel's Docker support

### Other Platforms

The Docker setup works with:
- **Railway**: Supports Dockerfiles
- **Fly.io**: Supports Dockerfiles
- **Render**: Supports Dockerfiles
- **AWS ECS/Fargate**: Container-based deployment
- **Google Cloud Run**: Container-based deployment

## 📝 Environment Variables

Required environment variables (set in `.env` or docker-compose):

```bash
# Application
APP_PORT=5173
PROD_PORT=8080
NODE_ENV=development

# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key

# Optional Integrations
VITE_OPENAI_API_KEY=your_openai_key
VITE_RESEND_API_KEY=your_resend_key
```

## 🐛 Debugging

### Container Won't Start

1. Check port availability: `npm run check:port dev`
2. Check logs: `docker-compose logs app-dev`
3. Verify environment variables are set
4. Check Docker daemon is running

### Port Already in Use

1. Find process: `lsof -i :5173`
2. Kill process: `kill -9 <PID>`
3. Or use different port: `APP_PORT=3000 npm run docker:dev`

### Build Failures

1. Clear Docker cache: `docker system prune -a`
2. Rebuild without cache: `docker-compose build --no-cache app-dev`
3. Check Dockerfile syntax
4. Verify all dependencies in package.json

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Vite Docker Guide](https://vitejs.dev/guide/static-deploy.html)
- [Nginx Configuration](https://nginx.org/en/docs/)

---

**Need help?** Check the logs first: `docker-compose logs -f app-dev`

