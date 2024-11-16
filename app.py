from flask import Flask, request, jsonify, render_template
from dotenv import load_dotenv
import os
import requests

# 加载环境变量
load_dotenv()

app = Flask(__name__)

# 从.env文件加载API密钥
XAI_API_KEY = os.getenv('XAI_API_KEY')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    try:
        user_message = request.json['message']
        
        # 准备XAI API请求
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {XAI_API_KEY}"
        }
        
        data = {
            "messages": [
                {
                    "role": "system",
                    "content": "You are a helpful assistant."
                },
                {
                    "role": "user",
                    "content": user_message
                }
            ],
            "model": "grok-beta",
            "stream": False,
            "temperature": 0.7
        }
        
        # 发送请求到XAI API
        response = requests.post(
            "https://api.x.ai/v1/chat/completions",
            headers=headers,
            json=data
        )
        
        if response.status_code == 200:
            ai_response = response.json()['choices'][0]['message']['content']
            return jsonify({"response": ai_response})
        else:
            return jsonify({"error": "Failed to get response from XAI"}), 500
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
