import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import styles from "./ChatRoom.module.css";
import { FiArrowLeft, FiSearch } from "react-icons/fi";

const ChatRoom = () => {
  const { groupId } = useParams();
  const eventId = groupId.replace("group_", "");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [eventDetails, setEventDetails] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [mediaFile, setMediaFile] = useState(null);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const currentUserId = JSON.parse(atob(token.split("."))[1]).userId;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/events/${eventId}/details`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) setEventDetails(response.data.data);
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/chats/${groupId}/messages?page=${page}&limit=20`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          if (!response.data.data.length) setHasMore(false);
          else setMessages((prev) => [...response.data.data, ...prev]);
          if (page === 1) setTimeout(scrollToBottom, 100);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [page]);

  useEffect(() => {
    socketRef.current = io(process.env.REACT_APP_WEB_SOCKET, {
      query: { token },
      transports: ["websocket"],
    });
    socketRef.current.emit("joinRoom", groupId);

    const handleNewMessage = (message) => {
      if (!messages.some((msg) => msg._id === message._id)) {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();
      }
    };

    socketRef.current.on("newMessage", handleNewMessage);

    return () => {
      socketRef.current.emit("leaveRoom", groupId);
      socketRef.current.off("newMessage", handleNewMessage);
      socketRef.current.disconnect();
    };
  }, [groupId, messages]);

  const handleScroll = () => {
    if (chatContainerRef.current.scrollTop === 0 && hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) setMediaFile(file);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !mediaFile) return;

    const formData = new FormData();
    formData.append("content", newMessage);
    formData.append("messageType", mediaFile ? mediaFile.type.split("/")[0] : "text");
    if (mediaFile) formData.append("media", mediaFile);

    try {
      await axios.post(
        `${process.env.REACT_APP_BASE_URL}/chats/${groupId}/messages`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );
      setNewMessage("");
      setMediaFile(null);
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className={styles.chatRoomContainer}>
      {eventDetails && (
        <div className={styles.eventInfo}>
          <FiArrowLeft className={styles.backIcon} onClick={() => navigate("/chats")} />
          <img src={eventDetails.eventImage ? `${process.env.REACT_APP_BASE_URL}/${eventDetails.eventImage}` : "/assets/ProfilDefaulticon.png"} alt="Event" className={styles.eventImage} />
          <div className={styles.eventText} onClick={() => navigate(`/group/${groupId}/details`)}>
            <h2>{eventDetails.eventName}</h2>
            <p>Me and {eventDetails.totalMembers - 1} members</p>
          </div>
          <FiSearch className={styles.searchIcon} />
        </div>
      )}

      <div ref={chatContainerRef} onScroll={handleScroll} className={styles.messagesContainer}>
        {loading && <p>Loading messages...</p>}
        {messages.map((msg) => (
          <div key={msg._id} className={msg.senderId._id === currentUserId ? styles.sentMessage : styles.receivedMessage}>
            <div className={styles.messageHeader}>
              <img src={msg.senderProfileImage ? `${process.env.REACT_APP_BASE_URL}${msg.senderProfileImage}` : "/assets/ProfilDefaulticon.png"} alt="Profile" className={styles.profileImage} />
              <span>{msg.senderId?.fullName || "Unknown"}</span>
            </div>
            <div className={styles.messageBubble}>{msg.content}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputContainer}>
        <input type="file" accept="image/*,video/*,audio/*" onChange={handleMediaChange} className={styles.fileInput} />
        <input type="text" placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} className={styles.chatInput} />
        <button onClick={handleSendMessage} className={styles.sendButton}>Send</button>
      </div>
    </div>
  );
};

export default ChatRoom;