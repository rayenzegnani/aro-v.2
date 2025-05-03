import { useState, useEffect, useRef } from "react";
import "./chatbot.css";

const GeminiChat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    // Remove scroll behavior by commenting or deleting this block
    // messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:5000/api/v1/chatbot/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMessage }),
      });

      const data = await response.json();

      if (data.success) {
        const botResponse = data.data.choices[0].message.content;
        setMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
      } else {
        throw new Error(data.message || 'Failed to get response');
      }
    } catch (error) {
      console.error("API Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ Sorry, I couldn't get a response. Please try again later.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const sendQuickMessage = (message) => {
    setInput(message);
    setTimeout(() => {
      document.querySelector(".input-area button").click();
    }, 100);
  };

  return (
    <div className="chat-container">
      <div className="header">
        <div className="header-content">
          <div className="avatar">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 
              10-4.48 10-10S17.52 2 12 2zm0 3c1.66 
              0 3 1.34 3 3s-1.34 3-3 
              3-3-1.34-3-3 1.34-3 3-3z" />
            </svg>
          </div>
          <div className="header-text">
            <h2>Financial Assistant</h2>
            <div className={`status ${isTyping ? "typing" : ""}`}>
              {isTyping ? "Typing..." : "Online"}
            </div>
          </div>
        </div>
      </div>

      <div className="messages">
        {messages.length === 0 && (
          <div className="welcome-message">
            <h3>Welcome to Financial Assistant</h3>
            <p>Ask me anything about personal finance, investments, or budgeting!</p>
            <div className="suggestions">
              <button onClick={() => sendQuickMessage("How can I save money?")}>
                How can I save money?
              </button>
              <button onClick={() => sendQuickMessage("Best investment options?")}>
                Best investment options?
              </button>
              <button onClick={() => sendQuickMessage("Create a budget plan")}>
                Create a budget plan
              </button>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender}`}>
            {msg.sender === "bot" && (
              <div className="avatar bot-avatar">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 
                  12s4.48 10 10 10 10-4.48 10-10S17.52 
                  2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 
                  8-8 8 3.59 8 8-3.59 8-8 8z" />
                  <path d="M8 10h8v2H8zm0 4h5v2H8z" />
                </svg>
              </div>
            )}
            <div className="content">
              {msg.text.includes("⚠️") ? (
                <div className="error-message">{msg.text}</div>
              ) : (
                msg.text.split("\n").map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="message bot">
            <div className="avatar bot-avatar">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 
                12s4.48 10 10 10 10-4.48 10-10S17.52 
                2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 
                8-8 8 3.59 8 8-3.59 8-8 8z" />
                <path d="M8 10h8v2H8zm0 4h5v2H8z" />
              </svg>
            </div>
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me about financial advice..."
          disabled={isTyping}
        />
        <button type="submit" disabled={!input.trim() || isTyping}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 
            2-15 2z" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default GeminiChat;
