document.addEventListener('DOMContentLoaded', () => {
    const messagesContainer = document.getElementById('messages');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');

    // 自动调整文本框高度
    userInput.addEventListener('input', () => {
        userInput.style.height = 'auto';
        userInput.style.height = userInput.scrollHeight + 'px';
    });

    // 发送消息
    const sendMessage = async () => {
        const message = userInput.value.trim();
        if (!message) return;

        // 添加用户消息到界面
        addMessage(message, 'user');
        userInput.value = '';
        userInput.style.height = 'auto';

        // 显示加载状态
        const loadingMessage = addMessage('Thinking...', 'ai');

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });

            const data = await response.json();

            // 移除加载消息
            loadingMessage.remove();

            if (data.error) {
                addMessage('Sorry, something went wrong. Please try again.', 'ai');
            } else {
                addMessage(data.response, 'ai');
            }
        } catch (error) {
            loadingMessage.remove();
            addMessage('Sorry, something went wrong. Please try again.', 'ai');
        }

        // 滚动到底部
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    // 添加消息到界面
    const addMessage = (text, type) => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', type);
        messageDiv.textContent = text;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return messageDiv;
    };

    // 发送按钮点击事件
    sendButton.addEventListener('click', sendMessage);

    // 回车发送消息（Shift+Enter换行）
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
});
