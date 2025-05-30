import React, { useState } from 'react';
import './ChatBot.css';

const ChatBot = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const toggleChat = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      setMessages([...messages, { text: inputMessage, sender: 'user' }]);
      setInputMessage('');
      // 这里可以添加与聊天机器人的实际交互逻辑
    }
  };

  return (
    <div className={`chatbot-container ${isExpanded ? 'expanded' : 'minimized'}`}>
      {!isExpanded ? (
        <button className="chatbot-button" onClick={toggleChat}>
          <span>💬</span>
        </button>
      ) : (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>Chat Assistant</h3>
            <button className="minimize-button" onClick={toggleChat}>−</button>
          </div>
          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                {message.text}
              </div>
            ))}
          </div>
          <form className="chatbot-input" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot; 