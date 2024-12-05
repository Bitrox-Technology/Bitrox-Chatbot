import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './chatbot.css'; 
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    // Display a welcome message when the chatbot loads
    useEffect(() => {
        const welcomeMessage = {
            sender: 'bot',
            text: 'Welcome to Gemini AI Chatbot! How can I assist you today?',
        };
        setMessages([welcomeMessage]);
    }, []);

    const handleSend = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { sender: 'user', text: input }];
        setMessages(newMessages);

        try {
            const response = await axios.post('https://bitrox-chatbot-17rya122v-ashishs-projects-cab18589.vercel.app/api/chat', { prompt: input });

            // Split the response into heading and additional content
            const [heading, ...content] = response.data.data.split('\n\n') || 'I could not understand that.';

            // Display the heading first
            setMessages((prev) => [...prev, { sender: 'bot', text: heading }]);

            // Dynamically display the remaining content with a delay
            content.forEach((paragraph, index) => {
                setTimeout(() => {
                    setMessages((prev) => [
                        ...prev,
                        { sender: 'bot', text: paragraph },
                    ]);
                }, (index + 1) * 1000); // Adjust delay time if needed
            });
        } catch (error) {
            console.error('Error fetching AI response:', error.message);
            setMessages([...newMessages, { sender: 'bot', text: 'Something went wrong, try again!' }]);
        }
        setInput('');
    };
    
    const handleCopy = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('Code copied to clipboard!');
        });
    };

    const components = {
        code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
                <div className="code-block">
                    <button
                        className="copy-button"
                        onClick={() => handleCopy(String(children).trim())}
                    >
                        Copy
                    </button>
                    <SyntaxHighlighter
                        style={solarizedlight}
                        language={match[1]}
                        PreTag="div"
                        showLineNumbers
                    >
                        {String(children).trim()}
                    </SyntaxHighlighter>
                </div>
            ) : (
                <code className={className} {...props}>
                    {children}
                </code>
            );
        },
    };
    return (
        <div className="chatbot-container">
            <div className="chat-header">Gemini AI Chatbot</div>
            <div className="chat-window">
                {messages.map((msg, index) => (
                  <div key={index} className={`chat-message ${msg.sender}`}>
                  {msg.sender === 'bot' ? (
                      <ReactMarkdown components={components}>{String(msg.text)}</ReactMarkdown> // Ensure text is always a string
                  ) : (
                      String(msg.text) // Ensure text is a string for user messages too
                  )}
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
