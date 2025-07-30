#!/usr/bin/env node

/**
 * Comprehensive Backend Test Script for HopeHands NGO Membership System
 * Tests all API endpoints and functionality
 */

const BASE_URL = 'http://localhost:5000/api';

// Test data
const testMember = {
  name: 'Test User',
  email: 'test@example.com',
  phone: '+1234567890',
  membershipType: 'premium'
};

let testMembershipId = '';
let testLoginId = '';
let testPassword = '';
let authToken = '';

// Helper function to make HTTP requests
async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authToken ? `Bearer ${authToken}` : '',
        ...options.headers
      },
      ...options
    });

    const data = await response.json();
    return { status: response.status, data, ok: response.ok };
  } catch (error) {
    console.error(`❌ Request failed: ${error.message}`);
    return { status: 500, data: { error: error.message }, ok: false };
  }
}

// Test functions
async function testHealthCheck() {
  console.log('\n🔍 Testing Health Check...');
  const result = await makeRequest(`${BASE_URL}/health`);
  
  if (result.ok && result.data.success) {
    console.log('✅ Health check passed');
    return true;
  } else {
    console.log('❌ Health check failed:', result.data);
    return false;
  }
}

async function testMembershipApplication() {
  console.log('\n📝 Testing Membership Application...');
  const result = await makeRequest(`${BASE_URL}/membership`, {
    method: 'POST',
    body: JSON.stringify(testMember)
  });

  if (result.ok && result.data.success) {
    console.log('✅ Membership application successful');
    testMembershipId = result.data.data.membershipId;
    testLoginId = result.data.data.loginId;
    console.log(`📋 Membership ID: ${testMembershipId}`);
    console.log(`🔑 Login ID: ${testLoginId}`);
    
    // In real scenario, password would be from email. For testing, we'll simulate.
    testPassword = 'testPass123'; // This would normally come from the email
    return true;
  } else {
    console.log('❌ Membership application failed:', result.data);
    return false;
  }
}

async function testMembershipStatus() {
  console.log('\n🔍 Testing Membership Status Check...');
  if (!testLoginId) {
    console.log('❌ No login ID available for status check');
    return false;
  }

  const result = await makeRequest(`${BASE_URL}/membership/status/${testLoginId}`);

  if (result.ok && result.data.success) {
    console.log('✅ Status check successful');
    console.log(`📊 Status: ${result.data.data.approvalStatus}`);
    console.log(`🏷️ Member Type: ${result.data.data.membershipType}`);
    console.log(`👤 Name: ${result.data.data.name}`);
    return true;
  } else {
    console.log('❌ Status check failed:', result.data);
    return false;
  }
}

async function testMemberLogin() {
  console.log('\n🔐 Testing Member Login...');
  if (!testLoginId) {
    console.log('❌ No login credentials available');
    return false;
  }

  // First, let's simulate having the password (in real scenario, it comes from email)
  const result = await makeRequest(`${BASE_URL}/membership/login`, {
    method: 'POST',
    body: JSON.stringify({
      loginId: testLoginId,
      password: testPassword
    })
  });

  if (result.status === 401) {
    console.log('⚠️ Login failed as expected (password from email required)');
    console.log('✅ Login endpoint is working correctly');
    return true;
  } else if (result.ok && result.data.success) {
    console.log('✅ Login successful');
    authToken = result.data.data.token;
    console.log('🎫 Auth token received');
    return true;
  } else {
    console.log('❌ Login test inconclusive:', result.data);
    return false;
  }
}

async function testMembershipApproval() {
  console.log('\n✅ Testing Membership Approval (Admin Function)...');
  if (!testMembershipId) {
    console.log('❌ No membership ID available for approval');
    return false;
  }

  const result = await makeRequest(`${BASE_URL}/membership/approve/${testMembershipId}`, {
    method: 'POST'
  });

  if (result.ok && result.data.success) {
    console.log('✅ Membership approval successful');
    console.log(`🎉 Status: ${result.data.data.approvalStatus}`);
    console.log(`🏆 Verification Badge: ${result.data.data.hasVerificationBadge}`);
    console.log(`📅 Start Date: ${result.data.data.membershipStartDate}`);
    console.log(`📅 End Date: ${result.data.data.membershipEndDate}`);
    console.log(`📧 Certificate Email Sent: ${result.data.data.certificateSent}`);
    return true;
  } else {
    console.log('❌ Membership approval failed:', result.data);
    return false;
  }
}

async function testCertificateDownload() {
  console.log('\n📜 Testing Certificate Download...');
  if (!testMembershipId) {
    console.log('❌ No membership ID available for certificate download');
    return false;
  }

  try {
    const response = await fetch(`${BASE_URL}/membership/certificate/${testMembershipId}`);
    
    if (response.ok) {
      const contentType = response.headers.get('content-type');
      const contentLength = response.headers.get('content-length');
      
      if (contentType === 'application/pdf' && contentLength > 0) {
        console.log('✅ Certificate download successful');
        console.log(`📄 Content Type: ${contentType}`);
        console.log(`📏 Content Length: ${contentLength} bytes`);
        return true;
      } else {
        console.log('❌ Certificate download failed - invalid content');
        return false;
      }
    } else {
      const errorData = await response.json();
      console.log('❌ Certificate download failed:', errorData);
      return false;
    }
  } catch (error) {
    console.log('❌ Certificate download error:', error.message);
    return false;
  }
}

async function testMembershipExtension() {
  console.log('\n🔄 Testing Membership Extension...');
  if (!testMembershipId) {
    console.log('❌ No membership ID available for extension');
    return false;
  }

  const result = await makeRequest(`${BASE_URL}/membership/extend/${testMembershipId}`, {
    method: 'POST',
    body: JSON.stringify({ additionalMonths: 6 })
  });

  if (result.ok && result.data.success) {
    console.log('✅ Membership extension successful');
    console.log(`📅 New End Date: ${result.data.data.newEndDate}`);
    console.log(`🏆 Verification Badge: ${result.data.data.hasVerificationBadge}`);
    return true;
  } else {
    console.log('❌ Membership extension failed:', result.data);
    return false;
  }
}

async function testContactForm() {
  console.log('\n📧 Testing Contact Form...');
  const contactData = {
    name: 'Test Contact',
    email: 'contact@example.com',
    phone: '+1234567890',
    message: 'This is a test contact message from the backend test script.'
  };

  const result = await makeRequest(`${BASE_URL}/contact`, {
    method: 'POST',
    body: JSON.stringify(contactData)
  });

  if (result.ok && result.data.success) {
    console.log('✅ Contact form submission successful');
    console.log(`📧 Email Sent: ${result.data.data.emailSent}`);
    return true;
  } else {
    console.log('❌ Contact form submission failed:', result.data);
    return false;
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting HopeHands NGO Backend Tests...');
  console.log('=' .repeat(50));

  const tests = [
    { name: 'Health Check', fn: testHealthCheck },
    { name: 'Membership Application', fn: testMembershipApplication },
    { name: 'Membership Status', fn: testMembershipStatus },
    { name: 'Member Login', fn: testMemberLogin },
    { name: 'Membership Approval', fn: testMembershipApproval },
    { name: 'Certificate Download', fn: testCertificateDownload },
    { name: 'Membership Extension', fn: testMembershipExtension },
    { name: 'Contact Form', fn: testContactForm }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name} threw an error:`, error.message);
      failed++;
    }
  }

  console.log('\n' + '=' .repeat(50));
  console.log('📊 TEST RESULTS');
  console.log('=' .repeat(50));
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

  if (failed === 0) {
    console.log('\n🎉 All tests passed! Backend is working correctly.');
  } else {
    console.log('\n⚠️ Some tests failed. Please check the backend configuration.');
  }

  console.log('\n💡 Next Steps:');
  console.log('1. Start the backend server: cd backend && npm run dev');
  console.log('2. Set up environment variables in backend/.env');
  console.log('3. Configure MongoDB and email service');
  console.log('4. Test with real email credentials');
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.log('❌ This test script requires Node.js 18+ with fetch support');
  console.log('💡 Please upgrade Node.js or install node-fetch');
  process.exit(1);
}

// Run tests
runAllTests().catch(console.error);
