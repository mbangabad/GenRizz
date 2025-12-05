#!/usr/bin/env node

/**
 * Port conflict checker
 * Checks if a port is already in use before starting the application
 */

import net from 'net';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Default ports (5174 to avoid conflicts with other Vite apps)
const DEFAULT_DEV_PORT = 5174;
const DEFAULT_PROD_PORT = 8080;

/**
 * Check if a port is available
 */
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.listen(port, () => {
      server.once('close', () => resolve(true));
      server.close();
    });
    
    server.on('error', () => resolve(false));
  });
}

/**
 * Find an available port starting from the given port
 */
async function findAvailablePort(startPort, maxAttempts = 10) {
  for (let i = 0; i < maxAttempts; i++) {
    const port = startPort + i;
    const available = await isPortAvailable(port);
    if (available) {
      return port;
    }
  }
  return null;
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const mode = args[0] || 'dev'; // 'dev' or 'prod'
  const requestedPort = args[1] ? parseInt(args[1], 10) : null;
  
  const defaultPort = mode === 'prod' ? DEFAULT_PROD_PORT : DEFAULT_DEV_PORT;
  const port = requestedPort || defaultPort;
  
  console.log(`\n🔍 Checking port ${port} for ${mode} mode...\n`);
  
  const available = await isPortAvailable(port);
  
  if (available) {
    console.log(`✅ Port ${port} is available!\n`);
    process.exit(0);
  } else {
    console.log(`❌ Port ${port} is already in use!\n`);
    console.log(`🔎 Searching for an available port...\n`);
    
    const alternativePort = await findAvailablePort(port);
    
    if (alternativePort) {
      console.log(`✅ Found available port: ${alternativePort}\n`);
      console.log(`💡 To use this port, set the environment variable:\n`);
      console.log(`   export APP_PORT=${alternativePort}  # for dev`);
      console.log(`   export PROD_PORT=${alternativePort}  # for prod\n`);
      console.log(`   Or update docker-compose.yml:\n`);
      console.log(`   ports:\n`);
      console.log(`     - "${alternativePort}:${alternativePort}"\n`);
      process.exit(1);
    } else {
      console.log(`❌ Could not find an available port in range ${port}-${port + 10}\n`);
      console.log(`💡 Please free up a port or specify a different one.\n`);
      process.exit(1);
    }
  }
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});

