import React from 'react';
import Chatbot from './components/chatbot.js'; // Assuming you have a Chatbot component

const App = () => {
    return (
        <div>
            <header style={{ textAlign: 'center', margin: '20px 0' }}>
                <h1>Welcome to the Gemini AI Chatbot!</h1>
            </header>
            <main style={{ display: 'flex', justifyContent: 'center' }}>
                <Chatbot />
            </main>
        </div>
    );
};

export default App;
