#!/usr/bin/env node

/**
 * Find Available Port
 * Dynamically finds an available port starting from a base port
 * Useful for containerized environments and avoiding conflicts
 */

import net from 'net';

const BASE_PORT = parseInt(process.env.BASE_PORT || '5174', 10);
const MAX_ATTEMPTS = parseInt(process.env.MAX_PORT_ATTEMPTS || '50', 10);

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
 * Find an available port starting from base port
 */
async function findAvailablePort(startPort = BASE_PORT, maxAttempts = MAX_ATTEMPTS) {
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
  const requestedPort = process.argv[2] ? parseInt(process.argv[2], 10) : BASE_PORT;
  
  const availablePort = await findAvailablePort(requestedPort);
  
  if (availablePort) {
    // Output port to stdout for use in scripts
    console.log(availablePort);
    process.exit(0);
  } else {
    console.error(`❌ Could not find available port in range ${requestedPort}-${requestedPort + MAX_ATTEMPTS}`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});

