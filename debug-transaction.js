// Debug script for Transaction creation issues
const API_URL = 'http://localhost:8080/api';

// Test data with different scenarios
const testCases = [
  {
    name: "Valid transaction data",
    data: {
      type: "TRANSFER",
      amount: 1000.00,
      nameOrig: "C1234567890",
      oldBalanceOrig: 5000.00,
      newBalanceOrig: 4000.00,
      nameDest: "C0987654321",
      oldBalanceDest: 2000.00,
      newBalanceDest: 3000.00
    }
  },
  {
    name: "Missing type",
    data: {
      amount: 1000.00,
      nameOrig: "C1234567890",
      oldBalanceOrig: 5000.00,
      newBalanceOrig: 4000.00,
      nameDest: "C0987654321",
      oldBalanceDest: 2000.00,
      newBalanceDest: 3000.00
    }
  },
  {
    name: "Invalid amount (0)",
    data: {
      type: "TRANSFER",
      amount: 0,
      nameOrig: "C1234567890",
      oldBalanceOrig: 5000.00,
      newBalanceOrig: 4000.00,
      nameDest: "C0987654321",
      oldBalanceDest: 2000.00,
      newBalanceDest: 3000.00
    }
  },
  {
    name: "Missing nameOrig",
    data: {
      type: "TRANSFER",
      amount: 1000.00,
      oldBalanceOrig: 5000.00,
      newBalanceOrig: 4000.00,
      nameDest: "C0987654321",
      oldBalanceDest: 2000.00,
      newBalanceDest: 3000.00
    }
  },
  {
    name: "Missing nameDest",
    data: {
      type: "TRANSFER",
      amount: 1000.00,
      nameOrig: "C1234567890",
      oldBalanceOrig: 5000.00,
      newBalanceOrig: 4000.00,
      oldBalanceDest: 2000.00,
      newBalanceDest: 3000.00
    }
  },
  {
    name: "String amount (should be number)",
    data: {
      type: "TRANSFER",
      amount: "1000.00",
      nameOrig: "C1234567890",
      oldBalanceOrig: 5000.00,
      newBalanceOrig: 4000.00,
      nameDest: "C0987654321",
      oldBalanceDest: 2000.00,
      newBalanceDest: 3000.00
    }
  }
];

let authToken = null;

async function login() {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: 'testuser', password: 'password123' })
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.status}`);
    }

    const data = await response.json();
    authToken = data.token;
    console.log('✅ Login successful');
    return true;
  } catch (error) {
    console.error('❌ Login failed:', error.message);
    return false;
  }
}

async function testTransactionCreation(testCase) {
  console.log(`\n🧪 Testing: ${testCase.name}`);
  console.log('📤 Sending data:', JSON.stringify(testCase.data, null, 2));

  try {
    const response = await fetch(`${API_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(testCase.data)
    });

    const responseData = await response.json();
    
    console.log(`📥 Response status: ${response.status}`);
    console.log('📥 Response data:', JSON.stringify(responseData, null, 2));

    if (response.ok) {
      console.log('✅ Test passed');
    } else {
      console.log('❌ Test failed');
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

async function runDebugTests() {
  console.log('🚀 Starting Transaction Creation Debug Tests...\n');

  // First login
  const loginSuccess = await login();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without login');
    return;
  }

  // Run all test cases
  for (const testCase of testCases) {
    await testTransactionCreation(testCase);
  }

  console.log('\n🏁 Debug tests completed!');
}

// Run tests if this script is executed directly
if (typeof window === 'undefined') {
  // Node.js environment
  runDebugTests().catch(console.error);
} else {
  // Browser environment
  window.runDebugTests = runDebugTests;
  console.log('Transaction debug tests loaded. Run window.runDebugTests() to start testing.');
} 