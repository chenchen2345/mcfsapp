const axios = require('axios');

const API_URL = 'http://localhost:8080/api';

// 模拟登录获取token
async function testTransactionAPI() {
  try {
    console.log('Testing Transaction and Fraud Report APIs...\n');

    // 1. 先登录获取token
    console.log('1. Testing login to get token...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      username: 'testuser',
      password: 'password123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful, token received\n');

    // 设置请求头
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // 2. 获取交易列表
    console.log('2. Testing get transactions list...');
    const transactionsResponse = await axios.get(`${API_URL}/transactions`, { headers });
    console.log('✅ Transactions retrieved successfully');
    console.log('Total transactions:', transactionsResponse.data.length);
    if (transactionsResponse.data.length > 0) {
      console.log('Sample transaction:', JSON.stringify(transactionsResponse.data[0], null, 2));
    }

    // 3. 获取欺诈报告列表
    console.log('\n3. Testing get fraud reports list...');
    const fraudReportsResponse = await axios.get(`${API_URL}/fraud-reports`, { headers });
    console.log('✅ Fraud reports retrieved successfully');
    console.log('Total fraud reports:', fraudReportsResponse.data.length);
    if (fraudReportsResponse.data.length > 0) {
      console.log('Sample fraud report:', JSON.stringify(fraudReportsResponse.data[0], null, 2));
    }

    // 4. 创建新交易
    console.log('\n4. Testing create new transaction...');
    const newTransaction = {
      type: 'TRANSFER',
      amount: 1000.00,
      nameOrig: 'John Doe',
      oldBalanceOrig: 5000.00,
      newBalanceOrig: 4000.00,
      nameDest: 'Jane Smith',
      oldBalanceDest: 2000.00,
      newBalanceDest: 3000.00
    };
    
    const createResponse = await axios.post(`${API_URL}/transactions`, newTransaction, { headers });
    console.log('✅ Transaction created successfully');
    console.log('Created transaction ID:', createResponse.data.id);

    // 5. 获取刚创建的交易
    console.log('\n5. Testing get specific transaction...');
    const transactionId = createResponse.data.id;
    const getTransactionResponse = await axios.get(`${API_URL}/transactions/${transactionId}`, { headers });
    console.log('✅ Transaction retrieved successfully');
    console.log('Transaction details:', JSON.stringify(getTransactionResponse.data, null, 2));

    // 6. 为交易生成欺诈报告
    console.log('\n6. Testing generate fraud report...');
    const generateReportResponse = await axios.post(`${API_URL}/fraud-reports/generate/${transactionId}`, {}, { headers });
    console.log('✅ Fraud report generated successfully');
    console.log('Generated report:', JSON.stringify(generateReportResponse.data, null, 2));

    // 7. 获取该交易的欺诈报告
    console.log('\n7. Testing get fraud report by transaction...');
    const fraudReportResponse = await axios.get(`${API_URL}/fraud-reports/transaction/${transactionId}`, { headers });
    console.log('✅ Fraud report retrieved successfully');
    console.log('Fraud report details:', JSON.stringify(fraudReportResponse.data, null, 2));

    // 8. 更新交易
    console.log('\n8. Testing update transaction...');
    const updateData = {
      type: 'PAYMENT',
      amount: 1500.00,
      nameOrig: 'John Doe Updated',
      oldBalanceOrig: 5000.00,
      newBalanceOrig: 3500.00,
      nameDest: 'Jane Smith Updated',
      oldBalanceDest: 2000.00,
      newBalanceDest: 3500.00
    };
    
    const updateResponse = await axios.put(`${API_URL}/transactions/${transactionId}`, updateData, { headers });
    console.log('✅ Transaction updated successfully');
    console.log('Updated transaction:', JSON.stringify(updateResponse.data, null, 2));

    // 9. 删除交易
    console.log('\n9. Testing delete transaction...');
    await axios.delete(`${API_URL}/transactions/${transactionId}`, { headers });
    console.log('✅ Transaction deleted successfully');

    console.log('\n🎉 All API tests completed successfully!');

  } catch (error) {
    console.error('❌ Error:', error.response ? error.response.data : error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
  }
}

// 运行测试
testTransactionAPI(); 