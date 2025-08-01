// API Validation Script - Test all backend endpoints
import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

// Test data
const testUser = {
  name: 'Test User',
  email: `test_${Date.now()}@example.com`,
  password: 'password123',
  phone: '+1234567890'
};

const testMembership = {
  name: 'Test Member',
  email: `member_${Date.now()}@example.com`,
  phone: '+1234567890',
  membershipType: 'basic',
  reason: 'Testing API validation'
};

const testDonation = {
  donorName: 'Test Donor',
  donorEmail: 'donor@example.com',
  amount: 100,
  currency: 'USD',
  isAnonymous: false
};

const testContact = {
  name: 'Test Contact',
  email: 'contact@example.com',
  phone: '+1234567890',
  subject: 'Test Subject',
  message: 'Test message for API validation'
};

async function validateAPI(method, endpoint, data = null, token = null) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {}
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    console.log(`✅ ${method.toUpperCase()} ${endpoint} - Status: ${response.status}`);
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response) {
      console.log(`❌ ${method.toUpperCase()} ${endpoint} - Status: ${error.response.status} - ${error.response.data?.message || 'Error'}`);
      return { success: false, status: error.response.status, message: error.response.data?.message };
    } else {
      console.log(`💥 ${method.toUpperCase()} ${endpoint} - Network Error: ${error.message}`);
      return { success: false, error: error.message };
    }
  }
}

async function runValidation() {
  console.log('🚀 Starting API Validation...\n');

  // 1. Health Check
  console.log('--- Health Check ---');
  await validateAPI('GET', '/api/health');

  // 2. Authentication Routes
  console.log('\n--- Authentication Routes ---');
  
  // Register user
  const registerResult = await validateAPI('POST', '/api/auth/register', testUser);
  
  // Login user
  const loginResult = await validateAPI('POST', '/api/auth/login', {
    email: testUser.email,
    password: testUser.password
  });
  
  const userToken = loginResult.success ? loginResult.data.token : null;

  // 3. Contact Routes
  console.log('\n--- Contact Routes ---');
  await validateAPI('POST', '/api/contact', testContact);
  await validateAPI('GET', '/api/contact');

  // 4. Membership Routes
  console.log('\n--- Membership Routes ---');
  const membershipResult = await validateAPI('POST', '/api/membership', testMembership);
  
  // Get membership status (if created)
  if (membershipResult.success && membershipResult.data?.data?.loginId) {
    await validateAPI('GET', `/api/membership/status/${membershipResult.data.data.loginId}`);
  }

  // 5. Donation Routes
  console.log('\n--- Donation Routes ---');
  await validateAPI('POST', '/api/donations', testDonation);
  await validateAPI('GET', '/api/donations');
  await validateAPI('GET', '/api/donations/stats/summary');
  await validateAPI('GET', `/api/donations/user/${testDonation.donorEmail}`);

  // 6. Test 404 Routes
  console.log('\n--- Testing 404 Routes ---');
  await validateAPI('GET', '/api/nonexistent');
  await validateAPI('POST', '/api/invalid/route');
  await validateAPI('GET', '/nonapi/route');

  console.log('\n✨ API Validation Complete!');
}

runValidation().catch(console.error);
