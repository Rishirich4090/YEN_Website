#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const path = require('path');

console.log('🌟 Starting HopeHands NGO Complete System...\n');

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

function log(color, prefix, message) {
  console.log(`${color}${colors.bright}[${prefix}]${colors.reset}${color} ${message}${colors.reset}`);
}

// Check if MongoDB is running
function checkMongoDB() {
  return new Promise((resolve) => {
    exec('mongosh --eval "db.adminCommand(\'ping\')"', (error) => {
      if (error) {
        log(colors.yellow, 'WARN', 'MongoDB not detected locally. Make sure MongoDB is running or using Atlas.');
      } else {
        log(colors.green, 'INFO', 'MongoDB connection verified ✅');
      }
      resolve();
    });
  });
}

// Install dependencies
async function installDependencies() {
  log(colors.blue, 'SETUP', 'Installing backend dependencies...');
  
  return new Promise((resolve, reject) => {
    const backendInstall = spawn('npm', ['install'], { 
      cwd: path.join(__dirname, 'backend'),
      stdio: 'inherit'
    });
    
    backendInstall.on('close', (code) => {
      if (code === 0) {
        log(colors.green, 'SETUP', 'Backend dependencies installed ✅');
        
        log(colors.blue, 'SETUP', 'Installing frontend dependencies...');
        const frontendInstall = spawn('npm', ['install'], { 
          cwd: __dirname,
          stdio: 'inherit'
        });
        
        frontendInstall.on('close', (code) => {
          if (code === 0) {
            log(colors.green, 'SETUP', 'Frontend dependencies installed ✅');
            resolve();
          } else {
            reject(new Error('Frontend dependency installation failed'));
          }
        });
      } else {
        reject(new Error('Backend dependency installation failed'));
      }
    });
  });
}

// Start backend server
function startBackend() {
  log(colors.magenta, 'BACKEND', 'Starting backend server on port 3001...');
  
  const backendProcess = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, 'backend'),
    stdio: 'pipe'
  });
  
  backendProcess.stdout.on('data', (data) => {
    const message = data.toString().trim();
    if (message) {
      log(colors.magenta, 'BACKEND', message);
    }
  });
  
  backendProcess.stderr.on('data', (data) => {
    const message = data.toString().trim();
    if (message && !message.includes('DeprecationWarning')) {
      log(colors.red, 'BACKEND', message);
    }
  });
  
  return backendProcess;
}

// Start frontend server
function startFrontend() {
  log(colors.cyan, 'FRONTEND', 'Starting frontend server on port 8080...');
  
  const frontendProcess = spawn('npm', ['run', 'dev'], {
    cwd: __dirname,
    stdio: 'pipe'
  });
  
  frontendProcess.stdout.on('data', (data) => {
    const message = data.toString().trim();
    if (message) {
      log(colors.cyan, 'FRONTEND', message);
    }
  });
  
  frontendProcess.stderr.on('data', (data) => {
    const message = data.toString().trim();
    if (message) {
      log(colors.red, 'FRONTEND', message);
    }
  });
  
  return frontendProcess;
}

// Main startup sequence
async function start() {
  try {
    // Check MongoDB
    await checkMongoDB();
    
    // Install dependencies
    await installDependencies();
    
    // Start backend
    const backendProcess = startBackend();
    
    // Wait a bit for backend to start
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Start frontend
    const frontendProcess = startFrontend();
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      log(colors.yellow, 'SHUTDOWN', 'Shutting down servers...');
      backendProcess.kill();
      frontendProcess.kill();
      process.exit(0);
    });
    
    // Wait a bit then show ready message
    setTimeout(() => {
      console.log('\n' + '='.repeat(60));
      log(colors.green, 'READY', '🎉 HopeHands NGO System is running!');
      log(colors.green, 'READY', '🌐 Frontend: http://localhost:8080');
      log(colors.green, 'READY', '🔧 Backend API: http://localhost:3001');
      log(colors.yellow, 'INFO', '📧 Check backend/.env for email configuration');
      log(colors.yellow, 'INFO', '🗄️  Make sure MongoDB is running');
      console.log('='.repeat(60) + '\n');
    }, 5000);
    
  } catch (error) {
    log(colors.red, 'ERROR', `Startup failed: ${error.message}`);
    process.exit(1);
  }
}

start();
