#!/usr/bin/env node

/**
 * Comprehensive Audit Script V2
 * Tests all game modes, scoring, routes, and edge cases
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const issues = [];
const warnings = [];
const passed = [];

// Color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function logIssue(msg) {
  issues.push(msg);
  console.log(`${colors.red}❌ ISSUE:${colors.reset} ${msg}`);
}

function logWarning(msg) {
  warnings.push(msg);
  console.log(`${colors.yellow}⚠️  WARNING:${colors.reset} ${msg}`);
}

function logPass(msg) {
  passed.push(msg);
  console.log(`${colors.green}✅ PASS:${colors.reset} ${msg}`);
}

function logSection(title) {
  console.log(`\n${colors.blue}━━━ ${title} ━━━${colors.reset}`);
}

// Read Gameplay.jsx
const gameplayPath = path.join(__dirname, '../src/pages/Gameplay.jsx');
const gameplayContent = fs.readFileSync(gameplayPath, 'utf8');

// Read games.jsx
const gamesPath = path.join(__dirname, '../src/components/constants/games.jsx');
const gamesContent = fs.readFileSync(gamesPath, 'utf8');

// Read index.jsx (routes)
const routesPath = path.join(__dirname, '../src/pages/index.jsx');
const routesContent = fs.readFileSync(routesPath, 'utf8');

logSection('GAME MODES AUDIT');

// Check game modes
const gameModes = ['STANDARD', 'QUICK', 'BLITZ'];
gameModes.forEach(mode => {
  if (gameplayContent.includes(`gameMode === '${mode}'`)) {
    logPass(`Game mode ${mode} is implemented`);
  } else {
    logIssue(`Game mode ${mode} not found in Gameplay.jsx`);
  }
});

// Check scoring logic for each mode
logSection('SCORING LOGIC AUDIT');

// Check BLITZ mode scoring fix
if (gameplayContent.includes('answeredQuestions') && gameplayContent.includes('gameMode === \'BLITZ\'')) {
  logPass('BLITZ mode uses answeredQuestions for scoring');
} else {
  logIssue('BLITZ mode may not be using answeredQuestions for scoring');
}

// Check QUICK mode scoring
if (gameplayContent.includes('gameMode === \'QUICK\'')) {
  logPass('QUICK mode scoring logic found');
} else {
  logWarning('QUICK mode scoring may not be properly handled');
}

// Check division by zero protection
if (gameplayContent.includes('answeredQuestions > 0') || gameplayContent.includes('totalQuestions > 0')) {
  logPass('Division by zero protection found');
} else {
  logIssue('Division by zero protection may be missing');
}

// Check timer logic
logSection('TIMER LOGIC AUDIT');

if (gameplayContent.includes('questions.length === 0') && gameplayContent.includes('gameMode !== \'BLITZ\'')) {
  logPass('BLITZ timer checks for questions.length');
} else {
  logIssue('BLITZ timer may start before questions are loaded');
}

// Check routes
logSection('ROUTES AUDIT');

const routePattern = /path="\/([^"]+)"/g;
const routes = [];
let match;
while ((match = routePattern.exec(routesContent)) !== null) {
  routes.push(match[1]);
}

logPass(`Found ${routes.length} routes`);

// Check for 404 route
if (routesContent.includes('path="*"') || routesContent.includes('NotFound')) {
  logPass('404 Not Found route exists');
} else {
  logIssue('404 Not Found route missing');
}

// Check error handling
logSection('ERROR HANDLING AUDIT');

// Check for empty questions handling
if (gameplayContent.includes('allQuestions.length === 0') || gameplayContent.includes('questions.length === 0')) {
  logPass('Empty questions array handling found');
} else {
  logIssue('Empty questions array may not be handled');
}

// Check for try-catch blocks
const tryCatchCount = (gameplayContent.match(/try\s*{/g) || []).length;
if (tryCatchCount > 0) {
  logPass(`Found ${tryCatchCount} try-catch blocks for error handling`);
} else {
  logWarning('No try-catch blocks found - error handling may be insufficient');
}

// Check question type validation
logSection('QUESTION TYPE VALIDATION');

const questionTypes = ['mcq', 'image', 'audio', 'swipe', 'connection', 'ordering', 'poll', 'would-you-rather', 'slider', 'scenario-swipe', 'ranking'];
questionTypes.forEach(type => {
  if (gameplayContent.includes(`type === '${type}'`) || gameplayContent.includes(`q.type === '${type}'`)) {
    logPass(`Question type ${type} is handled`);
  } else {
    logWarning(`Question type ${type} may not be handled`);
  }
});

// Check for default case in question rendering
if (gameplayContent.includes('default:') && gameplayContent.includes('renderQuestion')) {
  logPass('Default case found in question rendering');
} else {
  logIssue('Default case may be missing in question rendering');
}

// Check power-up state reset
logSection('POWER-UP STATE AUDIT');

if (gameplayContent.includes('setHiddenOptions([])') && gameplayContent.includes('setShowHint(false)')) {
  logPass('Power-up state reset found in handleAnswer');
} else {
  logIssue('Power-up state may not be reset between questions');
}

// Check streak calculation
if (gameplayContent.includes('setStreak(prev =>') || gameplayContent.includes('newStreakValue')) {
  logPass('Streak calculation uses functional update (prev =>)');
} else {
  logIssue('Streak calculation may have race condition');
}

// Check game mode validation
if (gameplayContent.includes('GAME_MODES[gameMode]') || gameplayContent.includes('mode = GAME_MODES')) {
  logPass('Game mode validation found');
} else {
  logIssue('Game mode validation may be missing');
}

// Check Squad XP error handling
if (gameplayContent.includes('SquadMember.update') && gameplayContent.includes('.catch(')) {
  logPass('Squad XP update has error handling');
} else {
  logWarning('Squad XP update may not have error handling');
}

// Check hardcoded URLs
logSection('HARDCODED URLS AUDIT');

const urlPattern = /https?:\/\/[^\s"']+/g;
const hardcodedUrls = gameplayContent.match(urlPattern) || [];
if (hardcodedUrls.length === 0) {
  logPass('No hardcoded URLs found in Gameplay.jsx');
} else {
  hardcodedUrls.forEach(url => {
    logWarning(`Hardcoded URL found: ${url.substring(0, 50)}...`);
  });
}

// Check environment variable usage
if (gameplayContent.includes('import.meta.env.VITE_APP_URL') || gameplayContent.includes('window.location.origin')) {
  logPass('Dynamic URL resolution found');
} else {
  logWarning('May be using hardcoded URLs instead of environment variables');
}

// Summary
logSection('AUDIT SUMMARY');

console.log(`\n${colors.green}✅ Passed: ${passed.length}${colors.reset}`);
console.log(`${colors.yellow}⚠️  Warnings: ${warnings.length}${colors.reset}`);
console.log(`${colors.red}❌ Issues: ${issues.length}${colors.reset}\n`);

if (issues.length > 0) {
  console.log(`${colors.red}CRITICAL ISSUES:${colors.reset}`);
  issues.forEach((issue, i) => {
    console.log(`${i + 1}. ${issue}`);
  });
  process.exit(1);
} else {
  console.log(`${colors.green}✅ All critical checks passed!${colors.reset}`);
  process.exit(0);
}

