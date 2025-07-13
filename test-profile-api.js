const axios = require('axios');

const API_URL = 'http://localhost:8080/api';

// 模拟登录获取token
async function testProfileAPI() {
  try {
    console.log('Testing Profile API...\n');

    // 1. 先登录获取token
    console.log('1. Testing login to get token...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      username: 'testuser',
      password: 'password123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful, token received\n');

    // 2. 使用token获取用户信息
    console.log('2. Testing get user info with token...');
    const userInfoResponse = await axios.get(`${API_URL}/user/info`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ User info retrieved successfully:');
    console.log('Response data:', JSON.stringify(userInfoResponse.data, null, 2));
    console.log('\nUser details:');
    console.log('- User ID:', userInfoResponse.data.user_id);
    console.log('- Username:', userInfoResponse.data.username);
    console.log('- Email:', userInfoResponse.data.email);
    console.log('- Created at:', userInfoResponse.data.created_at);

  } catch (error) {
    console.error('❌ Error:', error.response ? error.response.data : error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
  }
}

// 运行测试
testProfileAPI(); 