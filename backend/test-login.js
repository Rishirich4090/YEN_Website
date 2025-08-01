import fetch from 'node-fetch';

async function testLogin() {
  try {
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
    
    console.log('🌐 Response Status:', response.status);
    console.log('📦 Response Data:', JSON.stringify(data, null, 2));
    console.log('✅ Login Success:', data.success);
    
    if (data.success) {
      console.log('🎉 Login successful!');
      console.log('👤 User:', data.user?.name);
      console.log('🎫 Token received:', !!data.token);
    } else {
      console.log('❌ Login failed:', data.message);
      console.log('🔍 Error details:', data.error);
    }
    
  } catch (error) {
    console.error('💥 Request failed:', error.message);
  }
}

testLogin();
