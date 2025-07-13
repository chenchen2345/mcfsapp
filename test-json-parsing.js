// 测试双层JSON解析功能
function testJsonParsing() {
  console.log('🧪 开始测试双层JSON解析功能...\n');

  // 测试用例
  const testCases = [
    {
      name: '标准双层JSON',
      input: {
        reply: '{"thought": "用户打招呼，需要友好回应。", "response": "你好！我是FinBot，你的财务助手。有什么可以帮助你的吗？"}'
      }
    },
    {
      name: '只有response',
      input: {
        reply: '{"response": "这是一个简单的回复。"}'
      }
    },
    {
      name: '只有thought',
      input: {
        reply: '{"thought": "用户的问题很复杂，需要仔细思考。"}'
      }
    },
    {
      name: '无效JSON',
      input: {
        reply: '这不是有效的JSON格式'
      }
    },
    {
      name: '空reply',
      input: {
        reply: ''
      }
    }
  ];

  testCases.forEach((testCase, index) => {
    console.log(`📝 测试用例 ${index + 1}: ${testCase.name}`);
    console.log('输入:', JSON.stringify(testCase.input, null, 2));
    
    try {
      const result = parseReply(testCase.input.reply);
      console.log('解析结果:', result);
      console.log('✅ 解析成功\n');
    } catch (error) {
      console.log('❌ 解析失败:', error.message);
      console.log('✅ 错误处理正常\n');
    }
  });
}

// 解析reply字段的函数（与ChatContext中的逻辑相同）
function parseReply(reply) {
  if (!reply) {
    return {
      thought: '',
      response: '抱歉，我没有收到有效的回复。'
    };
  }

  try {
    // 解析reply字段中的JSON字符串
    const parsedReply = JSON.parse(reply);
    return {
      thought: parsedReply.thought || '',
      response: parsedReply.response || reply
    };
  } catch (parseError) {
    console.error('Failed to parse reply JSON:', parseError);
    // 如果解析失败，直接使用原始回复
    return {
      thought: '',
      response: reply || '抱歉，我没有收到有效的回复。'
    };
  }
}

// 模拟消息显示
function simulateMessageDisplay(thought, response) {
  console.log('💬 消息显示效果:');
  
  if (thought) {
    console.log('🤔 思考过程 (小字体灰色):', thought);
  }
  
  if (response) {
    console.log('💭 回复内容 (正常样式):', response);
  }
  
  console.log('---');
}

// 运行测试
if (require.main === module) {
  testJsonParsing();
  
  // 额外测试：模拟实际使用场景
  console.log('🎯 模拟实际使用场景:');
  const testReply = '{"thought": "用户询问金融概念，需要详细解释。", "response": "金融风险管理是指识别、评估和控制金融活动中可能出现的各种风险的过程。"}';
  const result = parseReply(testReply);
  simulateMessageDisplay(result.thought, result.response);
}

module.exports = {
  parseReply,
  testJsonParsing
}; 