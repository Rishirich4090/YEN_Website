/**
 * Debug Login Issue - Test script to identify the authentication problem
 */

console.log('🔍 Debug Login Issue');

// Test 1: Check localStorage data
console.log('\n--- localStorage Data ---');
const authData = localStorage.getItem('hopehands_auth_token');
const userData = localStorage.getItem('hopehands_user_data');
const persistedAuth = localStorage.getItem('persist:ngo-platform-root');

console.log('Auth Token:', authData);
console.log('User Data:', userData);
console.log('Persisted Auth:', persistedAuth);

// Test 2: Check Redux persist data
if (persistedAuth) {
  try {
    const parsed = JSON.parse(persistedAuth);
    console.log('Parsed Persisted Data:', parsed);
    
    if (parsed.auth) {
      console.log('Auth Slice Data:', JSON.parse(parsed.auth));
    }
  } catch (error) {
    console.error('Error parsing persisted data:', error);
  }
}

// Test 3: Test login API directly
async function testLoginAPI() {
  try {
    console.log('\n--- Testing Login API ---');
    
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'arunkmrkhata@gmail.com',
        password: 'Amit@123'
      })
    });
    
    const data = await response.json();
    console.log('Raw API Response:', data);
    
    // Test saving to localStorage manually
    if (data.success && data.user && data.token) {
      localStorage.setItem('hopehands_auth_token', data.token);
      localStorage.setItem('hopehands_user_data', JSON.stringify(data.user));
      console.log('✅ Manually saved to localStorage');
      console.log('Token saved:', localStorage.getItem('hopehands_auth_token'));
      console.log('User saved:', localStorage.getItem('hopehands_user_data'));
    }
    
  } catch (error) {
    console.error('API Test Error:', error);
  }
}

// Test 4: Check if API client is working
async function testApiClient() {
  try {
    console.log('\n--- Testing API Client ---');
    
    // This would work if we had access to the apiClient
    // For now, we'll test manually
    console.log('API Client test would go here');
    
  } catch (error) {
    console.error('API Client Error:', error);
  }
}

// Run tests
testLoginAPI();

console.log('\n🔍 Debug complete - check console output');
