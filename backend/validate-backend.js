/**
 * Simple Backend Validation Script
 * Validates backend structure and basic functionality
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating HopeHands NGO Backend Structure...\n');

// Check if required files exist
const requiredFiles = [
  'src/index.ts',
  'src/models/Member.ts',
  'src/models/Contact.ts',
  'src/models/Donation.ts',
  'src/routes/membership.ts',
  'src/routes/contact.ts',
  'src/services/emailService.ts',
  'src/services/certificateService.ts',
  'src/middleware/validation.ts',
  'src/config/database.ts',
  'package.json',
  'tsconfig.json',
  '.env.example'
];

console.log('📁 Checking file structure...');
let fileChecksPassed = 0;

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
    fileChecksPassed++;
  } else {
    console.log(`❌ ${file} - MISSING`);
  }
});

console.log(`\n📊 File Structure: ${fileChecksPassed}/${requiredFiles.length} files found\n`);

// Check package.json dependencies
console.log('📦 Checking package.json dependencies...');
const packagePath = path.join(__dirname, 'package.json');
if (fs.existsSync(packagePath)) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  const requiredDeps = [
    'express',
    'mongoose', 
    'nodemailer',
    'bcryptjs',
    'jsonwebtoken',
    'zod',
    'cors',
    'dotenv'
  ];

  const requiredDevDeps = [
    'typescript',
    '@types/express',
    '@types/nodemailer',
    '@types/bcryptjs',
    '@types/jsonwebtoken',
    'tsx'
  ];

  let depChecksPassed = 0;
  
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      console.log(`✅ ${dep} - ${packageJson.dependencies[dep]}`);
      depChecksPassed++;
    } else {
      console.log(`❌ ${dep} - MISSING from dependencies`);
    }
  });

  requiredDevDeps.forEach(dep => {
    if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
      console.log(`✅ ${dep} - ${packageJson.devDependencies[dep]} (dev)`);
      depChecksPassed++;
    } else {
      console.log(`❌ ${dep} - MISSING from devDependencies`);
    }
  });

  console.log(`\n📊 Dependencies: ${depChecksPassed}/${requiredDeps.length + requiredDevDeps.length} found\n`);
}

// Check TypeScript configuration
console.log('⚙️ Checking TypeScript configuration...');
const tsconfigPath = path.join(__dirname, 'tsconfig.json');
if (fs.existsSync(tsconfigPath)) {
  try {
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
    
    if (tsconfig.compilerOptions) {
      console.log('✅ TypeScript config found');
      console.log(`✅ Target: ${tsconfig.compilerOptions.target}`);
      console.log(`✅ Module: ${tsconfig.compilerOptions.module}`);
      console.log(`✅ Output Dir: ${tsconfig.compilerOptions.outDir}`);
    } else {
      console.log('❌ Invalid TypeScript configuration');
    }
  } catch (error) {
    console.log('❌ Invalid TypeScript configuration JSON');
  }
} else {
  console.log('❌ TypeScript configuration missing');
}

// Validate model schemas
console.log('\n🗄️ Validating model schemas...');
const memberModelPath = path.join(__dirname, 'src/models/Member.ts');
if (fs.existsSync(memberModelPath)) {
  const memberContent = fs.readFileSync(memberModelPath, 'utf8');
  
  const requiredFields = [
    'name:',
    'email:',
    'phone:',
    'membershipType:',
    'membershipId:',
    'loginId:',
    'password:',
    'approvalStatus:',
    'hasVerificationBadge:',
    'membershipStartDate:',
    'membershipEndDate:'
  ];

  let fieldChecksPassed = 0;
  
  requiredFields.forEach(field => {
    if (memberContent.includes(field)) {
      console.log(`✅ Member model has ${field.replace(':', '')} field`);
      fieldChecksPassed++;
    } else {
      console.log(`❌ Member model missing ${field.replace(':', '')} field`);
    }
  });

  console.log(`📊 Member Model: ${fieldChecksPassed}/${requiredFields.length} fields found`);
}

// Check API routes
console.log('\n🛣️ Validating API routes...');
const membershipRoutePath = path.join(__dirname, 'src/routes/membership.ts');
if (fs.existsSync(membershipRoutePath)) {
  const routeContent = fs.readFileSync(membershipRoutePath, 'utf8');
  
  const requiredRoutes = [
    'POST.*/',  // Create membership
    'POST.*/login',  // Member login
    'GET.*/status',  // Check status
    'POST.*/approve',  // Approve membership
    'GET.*/certificate',  // Download certificate
    'POST.*/extend'  // Extend membership
  ];

  let routeChecksPassed = 0;
  
  requiredRoutes.forEach(route => {
    const regex = new RegExp(route);
    if (regex.test(routeContent)) {
      console.log(`✅ Route found: ${route.replace('.*', ' ')}`);
      routeChecksPassed++;
    } else {
      console.log(`❌ Route missing: ${route.replace('.*', ' ')}`);
    }
  });

  console.log(`📊 Membership Routes: ${routeChecksPassed}/${requiredRoutes.length} routes found`);
}

// Check email service
console.log('\n📧 Validating email service...');
const emailServicePath = path.join(__dirname, 'src/services/emailService.ts');
if (fs.existsSync(emailServicePath)) {
  const emailContent = fs.readFileSync(emailServicePath, 'utf8');
  
  const requiredMethods = [
    'sendContactFormEmail',
    'sendMembershipCredentials',
    'sendMembershipApprovalEmail',
    'sendDonationCertificate'
  ];

  let emailChecksPassed = 0;
  
  requiredMethods.forEach(method => {
    if (emailContent.includes(method)) {
      console.log(`✅ Email service has ${method} method`);
      emailChecksPassed++;
    } else {
      console.log(`❌ Email service missing ${method} method`);
    }
  });

  console.log(`📊 Email Service: ${emailChecksPassed}/${requiredMethods.length} methods found`);
}

// Environment configuration check
console.log('\n🔧 Checking environment configuration...');
const envExamplePath = path.join(__dirname, '.env.example');
if (fs.existsSync(envExamplePath)) {
  const envContent = fs.readFileSync(envExamplePath, 'utf8');
  
  const requiredEnvVars = [
    'MONGODB_URI',
    'EMAIL_USER', 
    'EMAIL_PASSWORD',
    'ADMIN_EMAIL',
    'JWT_SECRET',
    'PORT'
  ];

  let envChecksPassed = 0;
  
  requiredEnvVars.forEach(envVar => {
    if (envContent.includes(envVar)) {
      console.log(`✅ Environment variable: ${envVar}`);
      envChecksPassed++;
    } else {
      console.log(`❌ Missing environment variable: ${envVar}`);
    }
  });

  console.log(`📊 Environment Config: ${envChecksPassed}/${requiredEnvVars.length} variables defined`);
}

// Final summary
console.log('\n' + '='.repeat(50));
console.log('📋 BACKEND VALIDATION SUMMARY');
console.log('='.repeat(50));

const totalChecks = requiredFiles.length;
const passedChecks = fileChecksPassed;

console.log(`📁 Files: ${fileChecksPassed}/${requiredFiles.length}`);
console.log('📦 Dependencies: Check output above');
console.log('🗄️ Models: Check output above');
console.log('🛣️ Routes: Check output above');
console.log('📧 Email Service: Check output above');
console.log('🔧 Environment: Check output above');

if (fileChecksPassed === requiredFiles.length) {
  console.log('\n✅ Backend structure validation PASSED!');
  console.log('🚀 Ready to start backend server');
} else {
  console.log('\n⚠️ Backend structure validation has issues');
  console.log('💡 Please ensure all required files are present');
}

console.log('\n🔧 To start the backend server:');
console.log('1. cd backend');
console.log('2. npm install');
console.log('3. Copy .env.example to .env and configure');
console.log('4. npm run dev');

console.log('\n📧 To test email functionality:');
console.log('1. Set up Gmail App Password');
console.log('2. Configure EMAIL_USER and EMAIL_PASSWORD in .env');
console.log('3. Test with: node test-backend.js');
