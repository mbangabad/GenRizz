#!/usr/bin/env node

/**
 * Comprehensive Platform Audit Script
 * Checks for issues, broken paths, inconsistencies, and UX problems
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const issues = {
  critical: [],
  high: [],
  medium: [],
  low: [],
  suggestions: []
};

// Helper to add issues
function addIssue(severity, category, message, file = null, line = null) {
  const issue = { category, message, file, line };
  issues[severity].push(issue);
  console.log(`[${severity.toUpperCase()}] ${category}: ${message}${file ? ` (${file}${line ? `:${line}` : ''})` : ''}`);
}

// Check if file exists
function fileExists(filePath) {
  try {
    return fs.existsSync(path.resolve(rootDir, filePath));
  } catch {
    return false;
  }
}

// Read file content
function readFile(filePath) {
  try {
    return fs.readFileSync(path.resolve(rootDir, filePath), 'utf-8');
  } catch {
    return null;
  }
}

// Find all JSX/JS files
function findFiles(dir, ext = ['.jsx', '.js'], files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
      findFiles(fullPath, ext, files);
    } else if (ext.some(e => entry.name.endsWith(e))) {
      files.push(fullPath);
    }
  }
  return files;
}

console.log('🔍 Starting Comprehensive Platform Audit...\n');

// 1. Check all route files exist
console.log('📋 Checking Routes...');
const routes = [
  'src/pages/Home.jsx',
  'src/pages/Landing.jsx',
  'src/pages/Gameplay.jsx',
  'src/pages/PersonalityGameplay.jsx',
  'src/pages/OpinionGameplay.jsx',
  'src/pages/Profile.jsx',
  'src/pages/Leaderboards.jsx',
  'src/pages/Challenges.jsx',
  'src/pages/Social.jsx',
  'src/pages/Achievements.jsx',
  'src/pages/Help.jsx',
  'src/pages/Settings.jsx',
  'src/pages/Shop.jsx',
  'src/pages/Squads.jsx',
  'src/pages/CreatorStudio.jsx',
  'src/pages/Admin.jsx',
  'src/pages/BattleArena.jsx',
  'src/pages/WorldMap.jsx',
  'src/pages/Blueprint.jsx',
  'src/pages/Notifications.jsx',
  'src/pages/StatsDeepDive.jsx',
  'src/pages/TestDashboard.jsx',
  'src/pages/Challenge.jsx',
  'src/pages/FamilyChallenge.jsx',
  'src/pages/Onboarding.jsx',
  'src/pages/Premium.jsx',
  'src/pages/Roadmap.jsx',
];

routes.forEach(route => {
  if (!fileExists(route)) {
    addIssue('critical', 'Missing Route', `Route file missing: ${route}`);
  }
});

// 2. Check critical dependencies
console.log('\n📦 Checking Dependencies...');
const packageJson = JSON.parse(readFile('package.json') || '{}');
const criticalDeps = [
  'react', 'react-dom', 'react-router-dom', '@supabase/supabase-js',
  '@tanstack/react-query', 'framer-motion', 'lucide-react'
];

criticalDeps.forEach(dep => {
  if (!packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]) {
    addIssue('critical', 'Missing Dependency', `Critical dependency missing: ${dep}`);
  }
});

// 3. Check environment variables
console.log('\n🔐 Checking Environment Configuration...');
const envExample = readFile('.env.example');
if (!envExample) {
  addIssue('high', 'Configuration', 'Missing .env.example file');
} else {
  const requiredVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
  requiredVars.forEach(varName => {
    if (!envExample.includes(varName)) {
      addIssue('high', 'Configuration', `Missing required env var in .env.example: ${varName}`);
    }
  });
}

// 4. Check for broken imports
console.log('\n🔗 Checking Imports...');
const srcFiles = findFiles(path.resolve(rootDir, 'src'));
const importPattern = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;

srcFiles.forEach(file => {
  const content = readFile(file);
  if (!content) return;
  
  let match;
  while ((match = importPattern.exec(content)) !== null) {
    const importPath = match[1];
    
    // Skip node_modules and external packages
    if (importPath.startsWith('@/') || importPath.startsWith('./') || importPath.startsWith('../')) {
      const relativePath = importPath.replace('@/', 'src/');
      const fileDir = path.dirname(file);
      const resolvedPath = path.resolve(fileDir, relativePath);
      
      // Check if file exists
      const possiblePaths = [
        resolvedPath,
        resolvedPath + '.jsx',
        resolvedPath + '.js',
        path.resolve(rootDir, relativePath),
        path.resolve(rootDir, relativePath + '.jsx'),
        path.resolve(rootDir, relativePath + '.js'),
      ];
      
      const exists = possiblePaths.some(p => {
        try {
          return fs.existsSync(p) && fs.statSync(p).isFile();
        } catch {
          return false;
        }
      });
      
      if (!exists && !importPath.includes('node_modules')) {
        addIssue('high', 'Broken Import', `Import not found: ${importPath}`, file.replace(rootDir + '/', ''));
      }
    }
  }
});

// 5. Check for error handling
console.log('\n🛡️ Checking Error Handling...');
srcFiles.forEach(file => {
  const content = readFile(file);
  if (!content) return;
  
  // Check for async functions without try-catch
  const asyncFuncPattern = /(async\s+function|const\s+\w+\s*=\s*async|async\s+\([^)]*\)\s*=>)/g;
  const tryCatchPattern = /try\s*{/g;
  
  if (file.includes('pages/') || file.includes('components/')) {
    const asyncMatches = content.match(asyncFuncPattern) || [];
    const tryCatchMatches = content.match(tryCatchPattern) || [];
    
    // Rough check - async functions should have error handling
    if (asyncMatches.length > tryCatchMatches.length * 2 && asyncMatches.length > 3) {
      addIssue('medium', 'Error Handling', `Multiple async functions may lack error handling`, file.replace(rootDir + '/', ''));
    }
  }
});

// 6. Check for console.logs in production code
console.log('\n📝 Checking for Debug Code...');
srcFiles.forEach(file => {
  const content = readFile(file);
  if (!content) return;
  
  if (content.includes('console.log(') && !file.includes('scripts/')) {
    addIssue('low', 'Debug Code', `console.log found in production code`, file.replace(rootDir + '/', ''));
  }
});

// 7. Check for missing error boundaries
console.log('\n🔒 Checking Error Boundaries...');
const hasErrorBoundary = srcFiles.some(file => {
  const content = readFile(file);
  return content && (content.includes('ErrorBoundary') || content.includes('componentDidCatch'));
});

if (!hasErrorBoundary) {
  addIssue('high', 'Error Handling', 'No ErrorBoundary component found');
}

// 8. Check API service files
console.log('\n🌐 Checking API Services...');
const apiFiles = [
  'src/api/auth.js',
  'src/api/entities.js',
  'src/api/integrations.js',
  'src/lib/supabase.js'
];

apiFiles.forEach(file => {
  if (!fileExists(file)) {
    addIssue('critical', 'Missing API Service', `API service missing: ${file}`);
  } else {
    const content = readFile(file);
    if (content && content.includes('base44')) {
      addIssue('high', 'Migration', `Still references Base44: ${file}`);
    }
  }
});

// 9. Check question files
console.log('\n❓ Checking Question Files...');
const questionFiles = [
  'src/components/constants/questions/gen-z-fluency.jsx',
  'src/components/constants/questions/index.jsx'
];

questionFiles.forEach(file => {
  if (!fileExists(file)) {
    addIssue('critical', 'Missing Questions', `Question file missing: ${file}`);
  }
});

// 10. Check for hardcoded values
console.log('\n🔧 Checking for Hardcoded Values...');
srcFiles.forEach(file => {
  const content = readFile(file);
  if (!content) return;
  
  // Check for hardcoded URLs
  if (content.includes('http://') || content.includes('https://')) {
    const urlMatch = content.match(/https?:\/\/[^\s'"]+/g);
    if (urlMatch && !urlMatch.some(url => url.includes('supabase.co') || url.includes('openai.com') || url.includes('resend.com'))) {
      addIssue('medium', 'Hardcoded URL', `Hardcoded URL found`, file.replace(rootDir + '/', ''));
    }
  }
});

// Generate Report
console.log('\n📊 Audit Summary:');
console.log(`\n✅ Critical Issues: ${issues.critical.length}`);
console.log(`⚠️  High Priority: ${issues.high.length}`);
console.log(`🔶 Medium Priority: ${issues.medium.length}`);
console.log(`ℹ️  Low Priority: ${issues.low.length}`);
console.log(`💡 Suggestions: ${issues.suggestions.length}`);

// Write report
const report = {
  timestamp: new Date().toISOString(),
  summary: {
    critical: issues.critical.length,
    high: issues.high.length,
    medium: issues.medium.length,
    low: issues.low.length,
    suggestions: issues.suggestions.length
  },
  issues
};

fs.writeFileSync(
  path.resolve(rootDir, 'AUDIT_REPORT.json'),
  JSON.stringify(report, null, 2)
);

console.log('\n📄 Full report saved to AUDIT_REPORT.json');

if (issues.critical.length > 0 || issues.high.length > 0) {
  console.log('\n❌ CRITICAL/HIGH ISSUES FOUND - Review before launch!');
  process.exit(1);
} else {
  console.log('\n✅ No critical issues found!');
  process.exit(0);
}

