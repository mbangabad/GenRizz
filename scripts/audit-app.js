#!/usr/bin/env node

/**
 * Application Audit Script
 * Checks for common issues, port conflicts, missing dependencies, etc.
 */

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import net from 'net';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const issues = [];
const warnings = [];
const info = [];

/**
 * Check if port is available
 */
function checkPort(port) {
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
 * Check environment file
 */
function checkEnvFile() {
  const envLocal = join(projectRoot, '.env.local');
  const envExample = join(projectRoot, '.env.example');
  
  if (!existsSync(envLocal)) {
    warnings.push('⚠️  .env.local not found - copy .env.example to .env.local');
    if (existsSync(envExample)) {
      info.push('💡 Run: cp .env.example .env.local');
    }
  } else {
    info.push('✅ .env.local exists');
    
    // Check for required vars
    const envContent = readFileSync(envLocal, 'utf-8');
    const requiredVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
    
    requiredVars.forEach(varName => {
      if (!envContent.includes(varName) || envContent.includes('your_')) {
        issues.push(`❌ ${varName} not configured in .env.local`);
      } else {
        info.push(`✅ ${varName} is set`);
      }
    });
  }
}

/**
 * Check package.json
 */
function checkPackageJson() {
  try {
    const pkg = JSON.parse(readFileSync(join(projectRoot, 'package.json'), 'utf-8'));
    
    // Check for base44 dependency
    if (pkg.dependencies && pkg.dependencies['@base44/sdk']) {
      warnings.push('⚠️  @base44/sdk still in dependencies (can be removed after full migration)');
    }
    
    // Check scripts
    if (pkg.scripts && pkg.scripts.dev) {
      info.push('✅ dev script configured');
    }
    
    return pkg;
  } catch (error) {
    issues.push(`❌ Error reading package.json: ${error.message}`);
    return null;
  }
}

/**
 * Check for base44 references
 */
function checkBase44References() {
  // This would require file system traversal - simplified for now
  info.push('💡 Run: grep -r "base44" src/ --include="*.jsx" --include="*.js" | grep -v "base44Client.js"');
}

/**
 * Check port availability
 */
async function checkPorts() {
  const defaultPort = 5174;
  const isAvailable = await checkPort(defaultPort);
  
  if (isAvailable) {
    info.push(`✅ Port ${defaultPort} is available`);
  } else {
    warnings.push(`⚠️  Port ${defaultPort} is in use`);
    info.push('💡 Use: npm run dev:auto (finds available port automatically)');
  }
}

/**
 * Check node_modules
 */
function checkDependencies() {
  const nodeModules = join(projectRoot, 'node_modules');
  if (!existsSync(nodeModules)) {
    issues.push('❌ node_modules not found - run: npm install');
  } else {
    info.push('✅ node_modules exists');
  }
}

/**
 * Main audit function
 */
async function audit() {
  console.log('\n🔍 GenRizz Application Audit\n');
  console.log('=' .repeat(50) + '\n');
  
  // Run checks
  checkEnvFile();
  checkPackageJson();
  checkDependencies();
  await checkPorts();
  
  // Print results
  if (info.length > 0) {
    console.log('📋 Information:');
    info.forEach(msg => console.log(`   ${msg}`));
    console.log('');
  }
  
  if (warnings.length > 0) {
    console.log('⚠️  Warnings:');
    warnings.forEach(msg => console.log(`   ${msg}`));
    console.log('');
  }
  
  if (issues.length > 0) {
    console.log('❌ Issues:');
    issues.forEach(msg => console.log(`   ${msg}`));
    console.log('');
  }
  
  // Summary
  console.log('=' .repeat(50));
  if (issues.length === 0 && warnings.length === 0) {
    console.log('✅ All checks passed! Ready to run.\n');
    console.log('🚀 Start with: npm run dev:auto\n');
  } else if (issues.length === 0) {
    console.log('✅ No critical issues. Some warnings above.\n');
    console.log('🚀 Start with: npm run dev:auto\n');
  } else {
    console.log(`❌ Found ${issues.length} issue(s) that need attention.\n`);
  }
  
  process.exit(issues.length > 0 ? 1 : 0);
}

audit().catch((error) => {
  console.error('Audit error:', error);
  process.exit(1);
});

