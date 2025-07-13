const axios = require('axios');

const API_BASE_URL = 'http://localhost:8080/api';

// 创建axios实例
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 存储token
let authToken = null;

// 登录函数
async function login(username, password) {
  try {
    console.log('🔐 正在登录...');
    const response = await api.post('/auth/login', {
      username: username,
      password: password
    });
    
    authToken = response.data.token;
    console.log('✅ 登录成功！');
    console.log('Token:', authToken.substring(0, 50) + '...');
    
    return authToken;
  } catch (error) {
    console.error('❌ 登录失败:', error.response?.data || error.message);
    throw error;
  }
}

// 发送聊天消息
async function sendChatMessage(prompt, model = 'qwen-turbo') {
  if (!authToken) {
    throw new Error('请先登录获取token');
  }
  
  try {
    console.log('💬 发送聊天消息...');
    console.log('Prompt:', prompt);
    console.log('Model:', model);
    
    const response = await api.post('/chat', {
      prompt: prompt,
      model: model
    }, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    console.log('✅ 收到回复:');
    console.log('Reply:', response.data.reply);
    
    return response.data;
  } catch (error) {
    console.error('❌ 发送消息失败:', error.response?.data || error.message);
    throw error;
  }
}

// 获取用户信息
async function getUserInfo() {
  if (!authToken) {
    throw new Error('请先登录获取token');
  }
  
  try {
    console.log('👤 获取用户信息...');
    const response = await api.get('/user/info', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    console.log('✅ 用户信息:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ 获取用户信息失败:', error.response?.data || error.message);
    throw error;
  }
}

// 主测试函数
async function testChatAPI() {
  try {
    // 1. 登录
    await login('testuser', 'password123'); // 替换为你的用户名和密码
    
    // 2. 获取用户信息
    await getUserInfo();
    
    // 3. 测试基本对话
    await sendChatMessage('你好，请介绍一下你自己');
    
    // 4. 测试金融相关问题
    await sendChatMessage('什么是金融风险管理？');
    
    // 5. 测试不指定模型
    await sendChatMessage('请解释一下区块链技术', '');
    
    console.log('🎉 所有测试完成！');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  console.log('🚀 开始测试 Chat API...\n');
  testChatAPI();
}

module.exports = {
  login,
  sendChatMessage,
  getUserInfo,
  testChatAPI
}; 