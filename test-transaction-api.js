// Test script for Transaction API
const API_URL = 'http://localhost:8080/api';

// Test data
const testTransaction = {
  type: 'TRANSFER',
  amount: 1000.00,
  nameOrig: 'C1234567890',
  oldBalanceOrig: 5000.00,
  newBalanceOrig: 4000.00,
  nameDest: 'C0987654321',
  oldBalanceDest: 2000.00,
  newBalanceDest: 3000.00
};

// Helper function to make API requests
async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP ${response.status}: ${errorData.message || errorData.details || 'Unknown error'}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}

// Test functions
async function testListTransactions() {
  console.log('Testing: List Transactions');
  try {
    const data = await makeRequest(`${API_URL}/transactions?page=1&size=10`);
    console.log('✅ List transactions successful:', data);
    return data;
  } catch (error) {
    console.error('❌ List transactions failed:', error.message);
  }
}

async function testCreateTransaction() {
  console.log('Testing: Create Transaction');
  try {
    const data = await makeRequest(`${API_URL}/transactions`, {
      method: 'POST',
      body: JSON.stringify(testTransaction)
    });
    console.log('✅ Create transaction successful:', data);
    return data.id;
  } catch (error) {
    console.error('❌ Create transaction failed:', error.message);
  }
}

async function testGetTransaction(id) {
  console.log(`Testing: Get Transaction ${id}`);
  try {
    const data = await makeRequest(`${API_URL}/transactions/${id}`);
    console.log('✅ Get transaction successful:', data);
    return data;
  } catch (error) {
    console.error('❌ Get transaction failed:', error.message);
  }
}

async function testUpdateTransaction(id) {
  console.log(`Testing: Update Transaction ${id}`);
  const updateData = {
    ...testTransaction,
    amount: 1500.00,
    newBalanceOrig: 3500.00,
    newBalanceDest: 3500.00
  };
  
  try {
    const data = await makeRequest(`${API_URL}/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
    console.log('✅ Update transaction successful:', data);
    return data;
  } catch (error) {
    console.error('❌ Update transaction failed:', error.message);
  }
}

async function testDeleteTransaction(id) {
  console.log(`Testing: Delete Transaction ${id}`);
  try {
    await makeRequest(`${API_URL}/transactions/${id}`, {
      method: 'DELETE'
    });
    console.log('✅ Delete transaction successful');
    return true;
  } catch (error) {
    console.error('❌ Delete transaction failed:', error.message);
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Starting Transaction API Tests...\n');
  
  // Test 1: List transactions
  await testListTransactions();
  console.log('');
  
  // Test 2: Create transaction
  const newId = await testCreateTransaction();
  console.log('');
  
  if (newId) {
    // Test 3: Get specific transaction
    await testGetTransaction(newId);
    console.log('');
    
    // Test 4: Update transaction
    await testUpdateTransaction(newId);
    console.log('');
    
    // Test 5: Delete transaction
    await testDeleteTransaction(newId);
    console.log('');
  }
  
  console.log('🏁 Transaction API Tests completed!');
}

// Run tests if this script is executed directly
if (typeof window === 'undefined') {
  // Node.js environment
  runTests().catch(console.error);
} else {
  // Browser environment
  window.runTransactionTests = runTests;
  console.log('Transaction API tests loaded. Run window.runTransactionTests() to start testing.');
} 