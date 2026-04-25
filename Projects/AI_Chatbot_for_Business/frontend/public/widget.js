(function() {
  const config = window.chatbotConfig || {};
  const botId = config.botId;
  const apiUrl = config.apiUrl || 'http://localhost:8000/api';

  if (!botId) {
    console.error('Chatbot: botId is required in chatbotConfig');
    return;
  }

  let sessionId = localStorage.getItem(`chatbot_session_${botId}`) || null;
  let isOpen = false;
  let messages = [];

  const styles = `
    .chatbot-widget {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }
    
    .chatbot-button {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .chatbot-button:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }
    
    .chatbot-button svg {
      width: 28px;
      height: 28px;
      fill: white;
    }
    
    .chatbot-window {
      position: fixed;
      bottom: 100px;
      right: 20px;
      width: 380px;
      height: 600px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transform: scale(0.8);
      opacity: 0;
      pointer-events: none;
      transition: transform 0.3s, opacity 0.3s;
    }
    
    .chatbot-window.open {
      transform: scale(1);
      opacity: 1;
      pointer-events: all;
    }
    
    .chatbot-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .chatbot-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }
    
    .chatbot-header p {
      margin: 4px 0 0 0;
      font-size: 13px;
      opacity: 0.9;
    }
    
    .chatbot-close {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.8;
      transition: opacity 0.2s;
    }
    
    .chatbot-close:hover {
      opacity: 1;
    }
    
    .chatbot-messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      background: #f9fafb;
    }
    
    .chatbot-message {
      margin-bottom: 16px;
      display: flex;
      gap: 8px;
      animation: slideIn 0.3s ease-out;
    }
    
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .chatbot-message.user {
      flex-direction: row-reverse;
    }
    
    .chatbot-message-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    
    .chatbot-message.bot .chatbot-message-avatar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .chatbot-message.user .chatbot-message-avatar {
      background: #e5e7eb;
    }
    
    .chatbot-message-avatar svg {
      width: 18px;
      height: 18px;
    }
    
    .chatbot-message.bot .chatbot-message-avatar svg {
      fill: white;
    }
    
    .chatbot-message.user .chatbot-message-avatar svg {
      fill: #6b7280;
    }
    
    .chatbot-message-content {
      max-width: 70%;
      padding: 12px 16px;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.5;
    }
    
    .chatbot-message.bot .chatbot-message-content {
      background: white;
      color: #1f2937;
      border-bottom-left-radius: 4px;
    }
    
    .chatbot-message.user .chatbot-message-content {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-bottom-right-radius: 4px;
    }
    
    .chatbot-typing {
      display: flex;
      gap: 4px;
      padding: 12px 16px;
    }
    
    .chatbot-typing span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #9ca3af;
      animation: typing 1.4s infinite;
    }
    
    .chatbot-typing span:nth-child(2) {
      animation-delay: 0.2s;
    }
    
    .chatbot-typing span:nth-child(3) {
      animation-delay: 0.4s;
    }
    
    @keyframes typing {
      0%, 60%, 100% {
        transform: translateY(0);
      }
      30% {
        transform: translateY(-10px);
      }
    }
    
    .chatbot-input-container {
      padding: 16px;
      background: white;
      border-top: 1px solid #e5e7eb;
    }
    
    .chatbot-input-form {
      display: flex;
      gap: 8px;
    }
    
    .chatbot-input {
      flex: 1;
      padding: 12px 16px;
      border: 1px solid #e5e7eb;
      border-radius: 24px;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
    }
    
    .chatbot-input:focus {
      border-color: #667eea;
    }
    
    .chatbot-send {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s;
    }
    
    .chatbot-send:hover:not(:disabled) {
      transform: scale(1.05);
    }
    
    .chatbot-send:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .chatbot-send svg {
      width: 20px;
      height: 20px;
      fill: white;
    }
    
    @media (max-width: 480px) {
      .chatbot-window {
        width: calc(100vw - 40px);
        height: calc(100vh - 140px);
        bottom: 100px;
        right: 20px;
      }
    }
  `;

  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);

  const widget = document.createElement('div');
  widget.className = 'chatbot-widget';
  widget.innerHTML = `
    <button class="chatbot-button" id="chatbot-toggle">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
      </svg>
    </button>
    
    <div class="chatbot-window" id="chatbot-window">
      <div class="chatbot-header">
        <div>
          <h3>AI Assistant</h3>
          <p>We're here to help!</p>
        </div>
        <button class="chatbot-close" id="chatbot-close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div class="chatbot-messages" id="chatbot-messages"></div>
      
      <div class="chatbot-input-container">
        <form class="chatbot-input-form" id="chatbot-form">
          <input 
            type="text" 
            class="chatbot-input" 
            id="chatbot-input" 
            placeholder="Type your message..."
            autocomplete="off"
          />
          <button type="submit" class="chatbot-send" id="chatbot-send">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </form>
      </div>
    </div>
  `;

  document.body.appendChild(widget);

  const toggleButton = document.getElementById('chatbot-toggle');
  const closeButton = document.getElementById('chatbot-close');
  const chatWindow = document.getElementById('chatbot-window');
  const messagesContainer = document.getElementById('chatbot-messages');
  const form = document.getElementById('chatbot-form');
  const input = document.getElementById('chatbot-input');
  const sendButton = document.getElementById('chatbot-send');

  function toggleChat() {
    isOpen = !isOpen;
    chatWindow.classList.toggle('open', isOpen);
    if (isOpen && messages.length === 0) {
      addMessage('bot', 'Hi! How can I help you today?');
    }
    if (isOpen) {
      input.focus();
    }
  }

  function addMessage(role, content) {
    messages.push({ role, content });
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${role}`;
    
    const avatarSvg = role === 'bot' 
      ? '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 9V7c0-1.1-.9-2-2-2h-3c0-1.66-1.34-3-3-3S9 3.34 9 5H6c-1.1 0-2 .9-2 2v2c-1.66 0-3 1.34-3 3s1.34 3 3 3v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4c1.66 0 3-1.34 3-3s-1.34-3-3-3zM9 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm6 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg>'
      : '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>';
    
    messageDiv.innerHTML = `
      <div class="chatbot-message-avatar">
        ${avatarSvg}
      </div>
      <div class="chatbot-message-content">
        ${content}
      </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function showTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chatbot-message bot';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
      <div class="chatbot-message-avatar">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 9V7c0-1.1-.9-2-2-2h-3c0-1.66-1.34-3-3-3S9 3.34 9 5H6c-1.1 0-2 .9-2 2v2c-1.66 0-3 1.34-3 3s1.34 3 3 3v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4c1.66 0 3-1.34 3-3s-1.34-3-3-3zM9 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm6 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg>
      </div>
      <div class="chatbot-message-content">
        <div class="chatbot-typing">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function hideTyping() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  async function sendMessage(message) {
    if (!message.trim()) return;

    addMessage('user', message);
    input.value = '';
    sendButton.disabled = true;
    showTyping();

    try {
      const response = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          bot_id: botId,
          session_id: sessionId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        hideTyping();
        addMessage('bot', data.response);
        
        if (data.session_id && !sessionId) {
          sessionId = data.session_id;
          localStorage.setItem(`chatbot_session_${botId}`, sessionId);
        }
      } else {
        hideTyping();
        addMessage('bot', 'Sorry, I encountered an error. Please try again.');
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      hideTyping();
      addMessage('bot', 'Sorry, I\'m having trouble connecting. Please try again later.');
    } finally {
      sendButton.disabled = false;
      input.focus();
    }
  }

  toggleButton.addEventListener('click', toggleChat);
  closeButton.addEventListener('click', toggleChat);
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = input.value.trim();
    if (message) {
      sendMessage(message);
    }
  });

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      form.dispatchEvent(new Event('submit'));
    }
  });
})();
