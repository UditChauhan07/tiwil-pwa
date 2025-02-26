import { useState } from "react";
import { FiPaperclip } from "react-icons/fi"; // Attachment Icon
import { IoCameraOutline, IoMicOutline } from "react-icons/io5"; // Camera & Mic Icons

const ChatInput = ({ handleSendMessage, newMessage, setNewMessage }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  return (
    <div className="chat-input-container">
      {/* Attachment Icon */}
      <label htmlFor="file-upload">
        <FiPaperclip className="chat-icon" />
      </label>
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Message Input Field */}
      <div className="input-box">
        <input
          type="text"
          placeholder="Write your message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
      </div>

      {/* Camera Icon */}
      <IoCameraOutline className="chat-icon" />

      {/* Mic Icon */}
      <IoMicOutline className="chat-icon" />

      {/* Send Button */}
      <button className="send-button" onClick={handleSendMessage}>
        Send
      </button>
    </div>
  );
};

export default ChatInput;
