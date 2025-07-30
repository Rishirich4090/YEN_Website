#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(color, status, message) {
  const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
  console.log(`${color}${icon} ${message}${colors.reset}`);
}

async function checkSystemHealth() {
  console.log(`${colors.bright}${colors.blue}🔍 HopeHands NGO System Health Check${colors.reset}\n`);

  let passCount = 0;
  let totalChecks = 0;

  // Check 1: Frontend package.json
  totalChecks++;
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    if (packageJson.scripts && packageJson.scripts['dev:system']) {
      log(colors.green, 'PASS', 'Frontend package.json configured');
      passCount++;
    } else {
      log(colors.red, 'FAIL', 'Frontend package.json missing system scripts');
    }
  } catch (error) {
    log(colors.red, 'FAIL', 'Frontend package.json not found');
  }

  // Check 2: Backend package.json
  totalChecks++;
  try {
    const backendPackageJson = JSON.parse(fs.readFileSync('backend/package.json', 'utf8'));
    if (backendPackageJson.scripts && backendPackageJson.scripts.dev) {
      log(colors.green, 'PASS', 'Backend package.json configured');
      passCount++;
    } else {
      log(colors.red, 'FAIL', 'Backend package.json missing dev script');
    }
  } catch (error) {
    log(colors.red, 'FAIL', 'Backend package.json not found');
  }

  // Check 3: Backend environment file
  totalChecks++;
  if (fs.existsSync('backend/.env')) {
    const envContent = fs.readFileSync('backend/.env', 'utf8');
    const requiredVars = ['MONGODB_URI', 'EMAIL_USER', 'JWT_SECRET', 'ADMIN_EMAIL'];
    const missingVars = requiredVars.filter(v => !envContent.includes(v));
    
    if (missingVars.length === 0) {
      log(colors.green, 'PASS', 'Backend environment variables configured');
      passCount++;
    } else {
      log(colors.yellow, 'WARN', `Backend .env missing: ${missingVars.join(', ')}`);
    }
  } else {
    log(colors.red, 'FAIL', 'Backend .env file not found');
  }

  // Check 4: Frontend environment file
  totalChecks++;
  if (fs.existsSync('.env.local')) {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    if (envContent.includes('VITE_API_BASE_URL')) {
      log(colors.green, 'PASS', 'Frontend environment configured');
      passCount++;
    } else {
      log(colors.yellow, 'WARN', 'Frontend .env.local missing API URL');
    }
  } else {
    log(colors.yellow, 'WARN', 'Frontend .env.local file not found (optional)');
    passCount++; // Not critical
  }

  // Check 5: Critical backend files
  totalChecks++;
  const backendFiles = [
    'backend/src/index.ts',
    'backend/src/models/Member.ts',
    'backend/src/routes/membership.ts',
    'backend/src/services/emailService.ts'
  ];
  
  const missingBackendFiles = backendFiles.filter(file => !fs.existsSync(file));
  if (missingBackendFiles.length === 0) {
    log(colors.green, 'PASS', 'Backend core files present');
    passCount++;
  } else {
    log(colors.red, 'FAIL', `Missing backend files: ${missingBackendFiles.join(', ')}`);
  }

  // Check 6: Critical frontend files
  totalChecks++;
  const frontendFiles = [
    'client/lib/apiService.ts',
    'client/components/Layout.tsx',
    'client/pages/AdminDashboard.tsx',
    'client/pages/Membership.tsx'
  ];
  
  const missingFrontendFiles = frontendFiles.filter(file => !fs.existsSync(file));
  if (missingFrontendFiles.length === 0) {
    log(colors.green, 'PASS', 'Frontend core files present');
    passCount++;
  } else {
    log(colors.red, 'FAIL', `Missing frontend files: ${missingFrontendFiles.join(', ')}`);
  }

  // Check 7: Node modules
  totalChecks++;
  if (fs.existsSync('node_modules') && fs.existsSync('backend/node_modules')) {
    log(colors.green, 'PASS', 'Dependencies installed');
    passCount++;
  } else {
    log(colors.yellow, 'WARN', 'Run `npm run setup` to install dependencies');
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  const percentage = Math.round((passCount / totalChecks) * 100);
  const color = percentage >= 80 ? colors.green : percentage >= 60 ? colors.yellow : colors.red;
  
  console.log(`${color}${colors.bright}Health Score: ${passCount}/${totalChecks} (${percentage}%)${colors.reset}`);
  
  if (percentage >= 80) {
    console.log(`${colors.green}${colors.bright}✅ System is ready to run!${colors.reset}`);
    console.log(`${colors.cyan}Run: ${colors.bright}npm run dev:system${colors.reset}`);
  } else if (percentage >= 60) {
    console.log(`${colors.yellow}${colors.bright}⚠️  System has some issues but may work${colors.reset}`);
    console.log(`${colors.cyan}Check SETUP.md for configuration help${colors.reset}`);
  } else {
    console.log(`${colors.red}${colors.bright}❌ System needs configuration${colors.reset}`);
    console.log(`${colors.cyan}Follow SETUP.md step by step${colors.reset}`);
  }
  
  console.log('='.repeat(50));
}

checkSystemHealth().catch(console.error);
