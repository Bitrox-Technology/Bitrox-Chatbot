import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './chatbot.css'; // Updated CSS file name for consistency

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    // Display a welcome message when the chatbot loads
    useEffect(() => {
        const welcomeMessage = { sender: 'bot', text: 'Welcome to Gemini AI Chatbot! How can I assist you today?' };
        setMessages([welcomeMessage]);
    }, []);

    const handleSend = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { sender: 'user', text: input }];
        setMessages(newMessages);

        try {
            const response = await axios.post('https://bitrox-chatbot-backend-5ws8qwm2y-ashishs-projects-cab18589.vercel.app/api/chat', { prompt: input });
            setMessages([...newMessages, { sender: 'bot', text: response.data.response }]);
        } catch (error) {
            console.error('Error fetching AI response:', error.message);
            setMessages([...newMessages, { sender: 'bot', text: 'Something went wrong, try again!' }]);
        }
        setInput('');
    };

    return (
        <div className="chatbot-container">
            <div className="chat-header">Gemini AI Chatbot</div>
            <div className="chat-window">
                {messages.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.sender}`}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className="chat-input-container">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                />
                <button onClick={handleSend}>Send</button>
            </div>
        </div>
    );
};

export default Chatbot;
