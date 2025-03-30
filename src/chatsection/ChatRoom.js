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
  const [eventDetails, setEventDetails] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const currentUserId = JSON.parse(atob(token.split(".")[1])).userId;
  const navigate = useNavigate();
  const [mediaFile, setMediaFile] = useState(null); // To store selected media

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/events/${eventId}/details`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data.success) {
          setEventDetails(response.data.data);
        }
      } catch (error) {
        console.error("❌ Error fetching event details:", error);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const fetchMessages = async (pageNum) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/chats/${groupId}/messages?page=${pageNum}&limit=20`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        if (response.data.data.length === 0) {
          setHasMore(false);
        } else {
          setMessages((prevMessages) => [
            ...response.data.data,
            ...prevMessages,
          ]);
          if (pageNum === 1) {
            setTimeout(scrollToBottom, 100);
          }
        }
      }
    } catch (error) {
      console.error("❌ Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages(page);
  }, [page]);

  useEffect(() => {
    socketRef.current = io("wss://tiwil.truet.net/socket.io/ ", {
      query: { token },
      transports: ["websocket","polling"],
      withCredentials: true
    });
  
    socketRef.current.emit("joinRoom", groupId);
  
    socketRef.current.on("newMessage", handleNewMessage);
  
    return () => {
      socketRef.current.emit("leaveRoom", groupId);
      socketRef.current.off("newMessage", handleNewMessage);
      socketRef.current.disconnect();
    };
  }, [groupId]);
  

  const handleScroll = () => {
    if (chatContainerRef.current.scrollTop === 0 && hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  // ✅ Handle Media Upload
  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
    }
  };

  const handleNewMessage = (message) => {
    // ✅ Skip adding the message if t
    // he sender is the current user
    if (message.senderId._id !== currentUserId) {
      setMessages((prev) => [...prev, message]);
    }
  };

  // ✅ Send Message16 march
  // const handleSendMessage = async () => {
  //   if (!newMessage.trim() && !mediaFile) return;

  //   const formData = new FormData();
  //   formData.append("content", newMessage);
  //   formData.append(
  //     "messageType",
  //     mediaFile ? mediaFile.type.split("/")[0] : "text"
  //   );
  //   if (mediaFile) {
  //     formData.append("media", mediaFile);
  //   }

  //   try {
  //     const response = await axios.post(
  //       `${process.env.REACT_APP_BASE_URL}/chats/${groupId}/messages`,
  //       formData,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );

  //     if (response.data.success) {
  //       // ✅ Remove direct state update here
  //       // Instead, the message will be automatically handled by the socket listener
  //       setNewMessage("");
  //       setMediaFile(null);
  //       scrollToBottom();
  //     }
  //   } catch (error) {
  //     console.error("❌ Error sending message:", error);
  //   }
  // };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !mediaFile) return;
  
    const formData = new FormData();
    formData.append("content", newMessage);
    console.log(newMessage,'its new message')
    formData.append(
      "messageType",
      mediaFile ? mediaFile.type.split("/")[0] : "text"
    );
    if (mediaFile) {
      formData.append("media", mediaFile);
    }
  
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/chats/${groupId}/messages`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      if (response.data.success) {
        const message = response.data.data;
  
        // ✅ Update messages state immediately for the sender
        setMessages((prev) => [...prev, message]);
  
        // Clear inputs after sending
        setNewMessage("");
        setMediaFile(null);
  
        // Auto-scroll to the latest message
        scrollToBottom();
  
        // Emit via socket to notify other clients
        socketRef.current.emit("sendMessage", message);
      }
    } catch (error) {
      console.error("❌ Error sending message:", error);
    }
  };
  
  

  return (
    <div className={styles.chatRoomContainer}>
      {eventDetails && (
        <div className={styles.eventInfo}>
          <FiArrowLeft
            className={styles.backIcon}
            onClick={() => navigate("/chats")}
          />
          <img
            src={
              eventDetails.eventImage
                ? `${process.env.REACT_APP_BASE_URL}/${eventDetails.eventImage}`
                :`${process.env.PUBLIC_URL}/img/defaultUser.png`
            }
        
            className={styles.eventImage}
          />
          <div
            className={styles.eventText}
            onClick={() => navigate(`/group/${groupId}/details`)}
          >
            <h2 style={{ fontSize: "15px", margin: "5px" }}>
              {eventDetails.eventName}
            </h2>
            <p style={{ marginTop: "10px" }}>
              Me and {eventDetails.totalMembers - 1} members
            </p>
          </div>
          <FiSearch className={styles.searchIcon} />
        </div>
      )}

      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className={styles.messagesContainer}
      >
        {loading && <p>Loading messages...</p>}
        {messages.length === 0 && !loading && (
          <p>No messages yet. Start the conversation!</p>
        )}
        {messages.map((msg) => {
          const isCurrentUser = msg.senderId._id === currentUserId;
          return (
            <div
              key={msg._id}
              className={
                isCurrentUser ? styles.sentMessage : styles.receivedMessage
              }
            >
              {/* ✅ Sender Info */}
              <div className={styles.messageHeader}>
                <img
                  src={
                    msg.senderProfileImage
                      ? `${process.env.REACT_APP_BASE_URL}/${msg.senderProfileImage}`
                      :`${process.env.PUBLIC_URL}/defaultUser.png`
                  }
              
                  className={styles.profileImage}
                />
                <span className={styles.senderName}>
                  {isCurrentUser ? "You" : msg.senderId?.fullName || "Unknown"}
                </span>
              </div>

              {/* ✅ Render Different Message Types */}
              <div className={styles.messageBubble}>
                {msg.messageType === "text" && (
                  <p className={styles.messageText}>{msg.content}</p>
                )}

                {msg.messageType === "image" && (
                  <img
                    src={`${process.env.REACT_APP_BASE_URL}${msg.mediaUrl}`}
               
                    className={styles.chatMediaImage}
                  />
                )}

                {msg.messageType === "video" && (
                  <video
                    src={`${process.env.REACT_APP_BASE_URL}${msg.mediaUrl}`}
                    controls
                    className={styles.chatMediaVideo}
                  />
                )}

                {msg.messageType === "audio" && (
                  <audio
                    src={`${process.env.REACT_APP_BASE_URL}${msg.mediaUrl}`}
                    controls
                    className={styles.chatMediaAudio}
                  />
                )}

                {/* ✅ Timestamp */}
                <span className={styles.messageTime}>
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputContainer}>
        {/* ✅ Media Upload Button */}
        <label htmlFor="mediaUpload" className={styles.mediaButton}>
          📎
        </label>
        <input
          id="mediaUpload"
          type="file"
          accept="image/*,video/*,audio/*"
          onChange={handleMediaChange}
          className={styles.fileInput}
        />

        {/* ✅ Media Preview */}
        {mediaFile && (
          <div className={styles.mediaPreview}>
            {mediaFile.type.startsWith("image") && (
              <img
                src={URL.createObjectURL(mediaFile)}
            
                className={styles.previewImage}
              />
            )}
            {mediaFile.type.startsWith("video") && (
              <video
                src={URL.createObjectURL(mediaFile)}
                className={styles.previewVideo}
                controls
              />
            )}
            {mediaFile.type.startsWith("audio") && (
              <audio src={URL.createObjectURL(mediaFile)} controls />
            )}
            <button
              className={styles.removeMedia}
              onClick={() => setMediaFile(null)}
            >
              ❌
            </button>
          </div>
        )}

        {/* ✅ Text Input */}
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          className={styles.chatInput}
        />

        {/* ✅ Send Button */}
        <button onClick={handleSendMessage} className={styles.sendButton}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
