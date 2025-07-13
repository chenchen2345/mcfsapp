// 简单的API测试脚本
const axios = require('axios');

const API_URL = 'http://localhost:8080/api';

async function testAPI() {
  try {
    // 测试ping端点
    console.log('Testing ping endpoint...');
    const pingResponse = await axios.get(`${API_URL.replace('/api', '')}/ping`);
    console.log('Ping response:', pingResponse.data);

    // 测试注册
    console.log('\nTesting registration...');
    const registerResponse = await axios.post(`${API_URL}/auth/register`, {
      username: 'testuser',
      password: 'testpass123',
      email: 'test@example.com'
    });
    console.log('Register response:', registerResponse.data);

    // 测试登录
    console.log('\nTesting login...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      username: 'testuser',
      password: 'testpass123'
    });
    console.log('Login response:', loginResponse.data);

    // 测试获取用户信息（需要token）
    if (loginResponse.data.token) {
      console.log('\nTesting get user info...');
      const userInfoResponse = await axios.get(`${API_URL}/user/info`, {
        headers: {
          'Authorization': `Bearer ${loginResponse.data.token}`
        }
      });
      console.log('User info response:', userInfoResponse.data);
    }

  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testAPI(); 