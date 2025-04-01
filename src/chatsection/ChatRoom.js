// ChatRoom.js
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import styles from "./ChatRoom.module.css";
import { FiArrowLeft } from "react-icons/fi";

const SOCKET_SERVER_URL = "https://45.77.110.58:6543";
const BASE_API_URL = process.env.REACT_APP_BASE_URL;

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
    const currentUserId = useRef(null);
    const navigate = useNavigate();
    const [mediaFile, setMediaFile] = useState(null);

    useEffect(() => {
        if (token) {
            try {
                currentUserId.current = JSON.parse(atob(token.split(".")[1])).userId;
            } catch (e) {
                console.error("Failed to parse token:", e);
            }
        }
    }, [token]);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        const fetchEventDetails = async () => {
            if (!eventId || !token) return;
            try {
                const response = await axios.get(
                    `${BASE_API_URL}/events/${eventId}/details`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (response.data.success) {
                    setEventDetails(response.data.data);
                }
            } catch (error) {
                console.error("❌ Error fetching event details:", error);
            }
        };
        fetchEventDetails();
    }, [eventId, token]);

    const fetchMessages = useCallback(async (pageNum) => {
        if (!groupId || !token) return;
        setLoading(true);
        try {
            const response = await axios.get(
                `${BASE_API_URL}/chats/${groupId}/messages?page=${pageNum}&limit=20`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
                const fetchedMessages = response.data.data;
                if (fetchedMessages.length === 0) {
                    setHasMore(false);
                } else {
                    setMessages((prevMessages) => {
                        const uniqueMessages = [...fetchedMessages, ...prevMessages]
                            .filter((msg, index, self) =>
                                index === self.findIndex((m) => m._id === msg._id)
                            )
                            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                        return uniqueMessages;
                    });
                    if (pageNum === 1) {
                        setTimeout(scrollToBottom, 100);
                    } else {
                        const chatContainer = chatContainerRef.current;
                        const previousScrollHeight = chatContainer.scrollHeight;
                        requestAnimationFrame(() => {
                            chatContainer.scrollTop = chatContainer.scrollHeight - previousScrollHeight;
                        });
                    }
                }
            }
        } catch (error) {
            console.error(`❌ Error fetching messages (page ${pageNum}):`, error);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    }, [groupId, token, scrollToBottom]);

    useEffect(() => {
        fetchMessages(1);
    }, [fetchMessages]);

    useEffect(() => {
        if (!token || !groupId) return;

        socketRef.current = io(SOCKET_SERVER_URL, {
          
            transports: ["websocket", "polling"],
            withCredentials: true,
        });

        const socket = socketRef.current;

        const handleNewMessage = (message) => {
            console.log("📩 Received new message via socket:", message);
            setMessages((prevMessages) => {
                if (!prevMessages.some(msg => msg._id === message._id)) {
                    return [...prevMessages, message].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                }
                return prevMessages;
            });
            
            scrollToBottom();
        };

        socket.on("connect", () => {
            console.log("✅ Socket connected:", socket.id);
            socket.emit("joinGroup", groupId);
        });

        socket.on("disconnect", (reason) => {
            console.log("❌ Socket disconnected:", reason);
        });

        socket.on("connect_error", (err) => {
            console.error("❌ Socket connection error:", err.message, err.data);
        });

        socket.on("socketError", (error) => {
            console.error("❌ Socket Server Error:", error.message);
        });

        socket.on("newMessage", handleNewMessage);
        socket.on("userJoined", (data) => console.log("👤 User joined:", data.userId));
        socket.on("userLeft", (data) => console.log("👤 User left:", data.userId));
        socket.onAny((event, ...args) => console.log(`📡 Received event: ${event}`, args));

        return () => {
            console.log("Cleaning up socket connection...");
            socket.emit("leaveGroup", groupId);
            socket.off("connect");
            socket.off("disconnect");
            socket.off("connect_error");
            socket.off("socketError");
            socket.off("newMessage"); // ✅ FIXED LINE
            socket.off("userJoined");
            socket.off("userLeft");
            socketRef.current = null;
        };
    }, [groupId, token, scrollToBottom]);

    const handleScroll = () => {
        if (chatContainerRef.current?.scrollTop === 0 && hasMore && !loading) {
            const nextPage = Math.ceil(messages.length / 20) + 1;
            fetchMessages(nextPage);
        }
    };

    const handleMediaChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMediaFile(file);
        }
    };

    const handleSendMessage = async () => {
        if ((!newMessage.trim() && !mediaFile) || !token || !groupId || !currentUserId.current) {
            console.log("Cannot send empty message or missing data.");
            return;
        }

        const formData = new FormData();
        formData.append("content", newMessage);
        formData.append("messageType", mediaFile ? mediaFile.type.split("/")[0] : "text");
        if (mediaFile) {
            formData.append("media", mediaFile);
        }
        formData.append("senderId", currentUserId.current);
        formData.append("chatId", groupId);

        const tempId = `temp_${Date.now()}`;
        const optimisticMessage = {
            _id: tempId,
            chatId: groupId,
            senderId: { _id: currentUserId.current, fullName: 'You' },
            senderProfileImage: '',
            content: newMessage,
            messageType: mediaFile ? mediaFile.type.split("/")[0] : "text",
            mediaUrl: mediaFile ? URL.createObjectURL(mediaFile) : null,
            timestamp: new Date().toISOString(),
            isOptimistic: true
        };

        setMessages((prev) => [...prev, optimisticMessage]);
        setNewMessage("");
        setMediaFile(null);
        scrollToBottom();

        try {
            const response = await axios.post(
                `${BASE_API_URL}/chats/${groupId}/messages`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                const confirmedMessage = response.data.data;
              
                setMessages((prev) => prev.map(msg =>
                    msg._id === tempId ? { ...confirmedMessage, isOptimistic: false } : msg
                ));
            } else {
                setMessages((prev) => prev.filter(msg => msg._id !== tempId));
            }
        } catch (error) {
            console.error("❌ Error sending message:", error);
            setMessages((prev) => prev.filter(msg => msg._id !== tempId));
        }
    };

    return (
        <div className={styles.chatRoomContainer}>
            {eventDetails && (
                <div className={styles.eventInfo}>
                    <FiArrowLeft className={styles.backIcon} onClick={() => navigate("/chats")} />
                    <img
                        src={
                            eventDetails.eventImage
                                ? `${BASE_API_URL}/${eventDetails.eventImage.replace(/\\/g, '/')}`
                                : `${process.env.PUBLIC_URL}/img/defaultUser.png`
                        }
                        alt={eventDetails.eventName}
                        className={styles.eventImage}
                        onError={(e) => e.target.src = `${process.env.PUBLIC_URL}/img/defaultUser.png`}
                    />
                    <div className={styles.eventText}>
                        <h2 style={{ fontSize: "15px", margin: "5px" }}>{eventDetails.eventName}</h2>
                        <p style={{ marginTop: "10px" }}>
                            {eventDetails.totalMembers ? `Members: ${eventDetails.totalMembers}` : 'Loading...'}
                        </p>
                    </div>
                </div>
            )}

            <div ref={chatContainerRef} onScroll={handleScroll} className={styles.messagesContainer}>
                {loading && page > 1 && <p className={styles.loadingIndicator}>Loading older messages...</p>}
                {messages.length === 0 && !loading && (
                    <p className={styles.noMessages}>No messages yet. Start the conversation!</p>
                )}
                {messages.map((msg) => {
                    const senderId = msg.senderId?._id;
                    const isCurrentUser = senderId === currentUserId.current;
                    const senderName = isCurrentUser ? "You" : (msg.senderId?.fullName || "Unknown User");
                    const profileImage = msg.senderProfileImage
                        ? `${BASE_API_URL}/${msg.senderProfileImage.replace(/\\/g, '/')}`
                        : `${process.env.PUBLIC_URL}/img/defaultUser.png`;

                    return (
                        <div
                            key={msg._id}
                            className={`${styles.messageItem} ${isCurrentUser ? styles.sentMessage : styles.receivedMessage}`}
                        >
                            <div className={styles.messageHeader}>
                                {!isCurrentUser && (
                                    <img
                                        src={profileImage}
                                        alt={senderName}
                                        className={styles.profileImage}
                                        onError={(e) => e.target.src = `${process.env.PUBLIC_URL}/img/defaultUser.png`}
                                    />
                                )}
                                <span className={styles.senderName}>{senderName}</span>
                            </div>

                            <div className={`${styles.messageBubble} ${msg.isOptimistic ? styles.optimistic : ''}`}>
                                {msg.messageType === "text" && <p className={styles.messageText}>{msg.content}</p>}
                                {msg.messageType === "image" && msg.mediaUrl && (
                                    <img
                                        src={msg.isOptimistic ? msg.mediaUrl : `${BASE_API_URL}${msg.mediaUrl.replace(/\\/g, '/')}`}
                                        alt="Chat attachment"
                                        className={styles.chatMediaImage}
                                    />
                                )}
                                {msg.messageType === "video" && msg.mediaUrl && (
                                    <video
                                        src={msg.isOptimistic ? msg.mediaUrl : `${BASE_API_URL}${msg.mediaUrl.replace(/\\/g, '/')}`}
                                        controls
                                        className={styles.chatMediaVideo}
                                    />
                                )}
                                {msg.messageType === "audio" && msg.mediaUrl && (
                                    <audio
                                        src={msg.isOptimistic ? msg.mediaUrl : `${BASE_API_URL}${msg.mediaUrl.replace(/\\/g, '/')}`}
                                        controls
                                        className={styles.chatMediaAudio}
                                    />
                                )}
                                <span className={styles.messageTime}>
                                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    }) : 'Sending...'}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <div className={styles.inputContainer}>
                <label htmlFor="mediaUpload" className={styles.mediaButton}>📎</label>
                <input
                    id="mediaUpload"
                    type="file"
                    accept="image/*,video/*,audio/*"
                    onChange={handleMediaChange}
                    className={styles.fileInput}
                />

                {mediaFile && (
                    <div className={styles.mediaPreview}>
                        <button
                            className={styles.removeMedia}
                            onClick={() => setMediaFile(null)}
                        >
                            ❌
                        </button>
                    </div>
                )}

                <input
                    type="text"
                    placeholder={mediaFile ? "Add a caption..." : "Type a message..."}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey ? (e.preventDefault(), handleSendMessage()) : null}
                    className={styles.chatInput}
                    disabled={loading && messages.length === 0}
                />

                <button
                    onClick={handleSendMessage}
                    className={styles.sendButton}
                    disabled={!newMessage.trim() && !mediaFile}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatRoom;
