import { useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // ⚠️ 请把这里的网址换成您 Render 后端的真实网址！
  const BACKEND_URL = 'https://nianian-backend.onrender.com';

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      
      const data = await response.json();
      const aiMsg = { role: 'assistant', content: data.reply };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: '网络错误，无法连接到后端。' }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Bunny's Home</h2>
      
      <div style={{ border: '1px solid #ccc', borderRadius: '8px', height: '500px', overflowY: 'auto', padding: '10px', marginBottom: '10px', background: '#f9f9f9' }}>
        {messages.length === 0 && <p style={{ textAlign: 'center', color: '#999' }}>发个消息测试一下数据库和后端的连通吧！</p>}
        
        {messages.map((msg, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', margin: '10px 0' }}>
            <div style={{ 
              maxWidth: '70%', 
              padding: '10px 15px', 
              borderRadius: '15px', 
              background: msg.role === 'user' ? '#d1e7ff' : '#fff',
              border: msg.role === 'user' ? 'none' : '1px solid #eee'
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && <p style={{ color: '#999' }}>AI 正在思考中...</p>}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="输入你想说的话..."
          style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
        />
        <button onClick={sendMessage} disabled={loading} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#007bff', color: '#fff', cursor: 'pointer' }}>
          发送
        </button>
      </div>
    </div>
  );
}

export default App;
