import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const ChatApp = () => {
  const [messages, setMessages] = useState([
    { text: "Hello!", sender: "bot" },
    { text: "Hi! How are you?", sender: "user" },
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  // Auto-scroll to the bottom when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (input.trim() === "") return;
    setMessages([...messages, { text: input, sender: "user" }]);
    setInput("");

    // Simulate bot response
    setTimeout(() => {
      setMessages((prev) => [...prev, { text: "I'm a bot 🤖", sender: "bot" }]);
    }, 1000);
  };

  return (
    <div className="container mt-4">
      <div className="chat-container bg-white p-3 shadow rounded" style={{ maxWidth: "600px", margin: "auto" }}>
        <div className="chat-box p-3" style={{ maxHeight: "400px", overflowY: "auto" }}>
          {messages.map((msg, index) => (
            <div key={index} className={`message d-flex ${msg.sender === "user" ? "justify-content-end" : ""}`}>
              {msg.sender === "bot" && <img   src={`${process.env.PUBLIC_URL}/img/SplashScreen3.png`} height={"28px"} width={"28px"} alt="avatar" className="avatar me-2 rounded-circle" />}
              <div className={`message-text p-2 rounded ${msg.sender === "user" ? "bg-primary text-white" : "bg-light text-dark"}`}>
                {msg.text}
                <div className="timestamp text-muted small mt-1">{new Date().toLocaleTimeString()}</div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <div className="chat-input d-flex mt-2">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button className="btn btn-primary" onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
