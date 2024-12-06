import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './chatbot.css';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FaPaperPlane } from 'react-icons/fa';
import Url from '../constants/urls.js';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    // Display a welcome message when the chatbot loads
    useEffect(() => {
        const welcomeMessage = {
            sender: 'bot',
            text: 'Welcome to Bitrox AI Chatbot! How can I assist you today?',
        };
        setMessages([welcomeMessage]);
    }, []);

    const handleSend = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { sender: 'user', text: input }];
        setMessages(newMessages);
        setIsTyping(true);

        try {
            const response = await axios.post(`${Url}/api/chat`, { prompt: input });

            const responseText = response.data.data || 'I could not understand that.'; 
            showTypingEffect(responseText);
        } catch (error) {
            console.error('Error fetching AI response:', error.message);
            setMessages((prev) => [
                ...prev,
                { sender: 'bot', text: 'Something went wrong, try again!' },
            ]);
            setIsTyping(false);
        }

        setInput('');
    };

    const showTypingEffect = (text) => {
        const words = text.split(' '); // Split text into words
        let currentText = '';
        let currentIndex = 0;

        const addWord = () => {
            if (currentIndex < words.length) {
                currentText += (currentIndex > 0 ? ' ' : '') + words[currentIndex];
                setMessages((prev) => {
                    const lastMessage = prev[prev.length - 1];
                    if (lastMessage?.sender === 'bot' && lastMessage?.isTyping) {
                        // Update the last message
                        return [
                            ...prev.slice(0, -1),
                            { sender: 'bot', text: currentText, isTyping: true },
                        ];
                    } else {
                        // Add a new typing message
                        return [
                            ...prev,
                            { sender: 'bot', text: currentText, isTyping: true },
                        ];
                    }
                });
                currentIndex++;
                setTimeout(addWord, 200); // Adjust typing speed here
            } else {
                setIsTyping(false); // Stop typing effect when complete
                setMessages((prev) => {
                    const lastMessage = prev[prev.length - 1];
                    return [
                        ...prev.slice(0, -1),
                        { sender: 'bot', text: currentText, isTyping: false },
                    ];
                });
            }
        };

        addWord();
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

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className="chatbot-container">
            <div className="chat-header">Bitrox AI Chatbot</div>
            <div className="chat-window">
                {messages.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.sender}`}>
                        {msg.sender === 'bot' ? (
                            <ReactMarkdown components={components}>{String(msg.text)}</ReactMarkdown>
                        ) : (
                            <div>{String(msg.text)}</div>
                        )}
                    </div>
                ))}
                {isTyping && (
                    <div className="chat-message bot">
                        <div className="avatar"></div>
                        <div className="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                )}
            </div>
            <div className="chat-input-container">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown} 
                    placeholder="Type your message..."
                />
                <button onClick={handleSend}>
                <FaPaperPlane size={20} color="white" />
                </button>
            </div>
        </div>
    );
};

export default Chatbot;
