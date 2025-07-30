#!/usr/bin/env node

const { exec } = require('child_process');
const path = require('path');

console.log('🚀 Starting HopeHands Backend Server...');

// Set environment
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Build TypeScript if needed
console.log('📦 Building TypeScript...');
exec('npm run build', { cwd: __dirname }, (buildError, buildStdout, buildStderr) => {
  if (buildError) {
    console.error('❌ Build failed:', buildError);
    return;
  }
  
  console.log('✅ Build completed');
  
  // Start the server
  console.log('🌟 Starting server...');
  const server = exec('npm run start', { cwd: __dirname });
  
  server.stdout.on('data', (data) => {
    console.log(data.toString());
  });
  
  server.stderr.on('data', (data) => {
    console.error(data.toString());
  });
  
  server.on('close', (code) => {
    console.log(`Server process exited with code ${code}`);
  });
});
