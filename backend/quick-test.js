// Simple Node.js test without interfering with running servers
import fetch from 'node-fetch';

async function quickLoginTest() {
  try {
    console.log('🔄 Testing login API...');
    
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'arunkmrkhata@gmail.com',
        password: 'Amit@123'
      })
    });

    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

quickLoginTest();
