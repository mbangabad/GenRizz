#!/usr/bin/env node
/**
 * NUCLEAR AUDIT SCRIPT
 * Checks EVERYTHING: imports, dependencies, paths, syntax, build config
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const issues = [];
const warnings = [];

// 1. Check package.json
console.log('🔍 Phase 1: Package.json Audit');
try {
  const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8'));
  const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
  console.log(`✅ Found ${Object.keys(allDeps).length} dependencies`);
} catch (e) {
  issues.push(`Package.json error: ${e.message}`);
}

// 2. Check all imports
console.log('\n🔍 Phase 2: Import Audit');
const srcFiles = [];
function findFiles(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory() && !filePath.includes('node_modules')) {
      findFiles(filePath);
    } else if (/\.(js|jsx|ts|tsx)$/.test(file)) {
      srcFiles.push(filePath);
    }
  });
}
findFiles(path.join(rootDir, 'src'));

console.log(`✅ Found ${srcFiles.length} source files`);

// Extract all imports
const imports = new Set();
srcFiles.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf-8');
    const importMatches = content.matchAll(/from\s+['"]([^'"]+)['"]/g);
    for (const match of importMatches) {
      const importPath = match[1];
      if (!importPath.startsWith('.') && !importPath.startsWith('/') && !importPath.startsWith('@/')) {
        const pkgName = importPath.split('/')[0].replace('@', '');
        imports.add(pkgName);
      }
    }
  } catch (e) {
    warnings.push(`Could not read ${file}: ${e.message}`);
  }
});

console.log(`✅ Found ${imports.size} unique package imports`);

// 3. Check if all imports are in package.json
console.log('\n🔍 Phase 3: Dependency Verification');
const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8'));
const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
const missing = [];

imports.forEach(imp => {
  const normalized = imp.startsWith('@') ? imp : imp.split('/')[0];
  if (!allDeps[normalized] && !allDeps[`@${normalized}`]) {
    // Check if it's a subpath import
    const basePkg = normalized.split('/')[0];
    if (!allDeps[basePkg] && !allDeps[`@${basePkg}`]) {
      missing.push(normalized);
    }
  }
});

if (missing.length > 0) {
  issues.push(`Missing dependencies: ${missing.join(', ')}`);
  console.log(`❌ Missing: ${missing.join(', ')}`);
} else {
  console.log('✅ All imports have corresponding dependencies');
}

// 4. Check file paths
console.log('\n🔍 Phase 4: File Path Verification');
let pathErrors = 0;
srcFiles.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf-8');
    const pathMatches = content.matchAll(/from\s+['"](\.[^'"]+)['"]/g);
    for (const match of pathMatches) {
      const importPath = match[1];
      const dir = path.dirname(file);
      const resolved = path.resolve(dir, importPath);
      if (!fs.existsSync(resolved) && !fs.existsSync(`${resolved}.js`) && !fs.existsSync(`${resolved}.jsx`) && !fs.existsSync(`${resolved}.ts`) && !fs.existsSync(`${resolved}.tsx`)) {
        pathErrors++;
        if (pathErrors <= 10) {
          warnings.push(`Possible broken path in ${file}: ${importPath}`);
        }
      }
    }
  } catch (e) {
    // Skip
  }
});

if (pathErrors > 0) {
  console.log(`⚠️  Found ${pathErrors} potential path issues`);
} else {
  console.log('✅ All relative paths appear valid');
}

// 5. Check build
console.log('\n🔍 Phase 5: Build Verification');
try {
  execSync('npm run build', { cwd: rootDir, stdio: 'pipe' });
  console.log('✅ Build successful');
} catch (e) {
  issues.push(`Build failed: ${e.message}`);
  console.log(`❌ Build failed`);
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 NUCLEAR AUDIT SUMMARY');
console.log('='.repeat(60));
console.log(`Files checked: ${srcFiles.length}`);
console.log(`Imports found: ${imports.size}`);
console.log(`Issues: ${issues.length}`);
console.log(`Warnings: ${warnings.length}`);

if (issues.length > 0) {
  console.log('\n❌ CRITICAL ISSUES:');
  issues.forEach(i => console.log(`  - ${i}`));
}

if (warnings.length > 0) {
  console.log('\n⚠️  WARNINGS:');
  warnings.slice(0, 20).forEach(w => console.log(`  - ${w}`));
}

if (issues.length === 0 && warnings.length === 0) {
  console.log('\n✅ ALL CHECKS PASSED');
} else {
  process.exit(1);
}

