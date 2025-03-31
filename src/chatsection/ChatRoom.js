// ChatRoom.js
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import styles from "./ChatRoom.module.css";
import { FiArrowLeft, FiSearch } from "react-icons/fi";

// Define your backend URL (replace with your actual backend URL)
const SOCKET_SERVER_URL = "https://45.77.110.58:6543"  // Or your deployed backend URL
const BASE_API_URL = process.env.REACT_APP_BASE_URL; // Make sure this is set

const ChatRoom = () => {
    const { groupId } = useParams(); // groupId should be like 'group_event123'
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
    const currentUserId = useRef(null); // Use ref to avoid dependency issues in callbacks
    const navigate = useNavigate();
    const [mediaFile, setMediaFile] = useState(null);

    // Decode User ID once
    useEffect(() => {
        if (token) {
            try {
                currentUserId.current = JSON.parse(atob(token.split(".")[1])).userId;
            } catch (e) {
                console.error("Failed to parse token:", e);
                // Handle invalid token, e.g., navigate to login
            }
        } else {
            // Handle missing token
        }
    }, [token]);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    // Fetch Event Details
    useEffect(() => {
        const fetchEventDetails = async () => {
            if (!eventId || !token) return;
            try {
                const response = await axios.get(
                    `${BASE_API_URL}/events/${eventId}/details`, {
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
    }, [eventId, token]);

    // Fetch Messages
    const fetchMessages = useCallback(async (pageNum) => {
        if (!groupId || !token) return;
        setLoading(true); // Set loading true when fetching
        try {
            const response = await axios.get(
                `${BASE_API_URL}/chats/${groupId}/messages?page=${pageNum}&limit=20`, {
                headers: { Authorization: `Bearer ${token}` },
            }
            );

            if (response.data.success) {
                const fetchedMessages = response.data.data;
                if (fetchedMessages.length === 0) {
                    setHasMore(false);
                } else {
                    // Ensure messages are unique and sorted if necessary
                    // Prepend older messages
                     setMessages((prevMessages) => {
                       const uniqueMessages = [...fetchedMessages, ...prevMessages]
                           .filter((msg, index, self) =>
                               index === self.findIndex((m) => m._id === msg._id)
                           )
                           .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)); // Sort by timestamp ASC
                       return uniqueMessages;
                    });

                    if (pageNum === 1) {
                        // Delay scroll slightly to allow rendering
                        setTimeout(scrollToBottom, 100);
                    } else {
                         // Preserve scroll position when loading older messages
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
            setHasMore(false); // Stop fetching on error
        } finally {
            setLoading(false); // Set loading false after fetch attempt
        }
    }, [groupId, token, scrollToBottom]);


    // Initial message fetch
    useEffect(() => {
        fetchMessages(1); // Fetch page 1 initially
    }, [fetchMessages]); // Depends only on fetchMessages callback


    // --- Socket Connection ---
    useEffect(() => {
        if (!token || !groupId) return; // Don't connect without token or groupId

        // Ensure correct URL and pass token in query
        socketRef.current = io(SOCKET_SERVER_URL, {
            query: { token }, // Send token for backend authentication
            transports: ["websocket", "polling"],
            withCredentials: true, // Keep if needed, ensure backend CORS allows it
        });

        const socket = socketRef.current; // Local variable for easier access

        socket.on("connect", () => {
            console.log("✅ Socket connected:", socket.id);
            // Join the group room upon connection
            socket.emit("joinGroup", groupId);
        });

        socket.on("disconnect", (reason) => {
            console.log("❌ Socket disconnected:", reason);
        });

        socket.on("connect_error", (err) => {
            console.error("❌ Socket connection error:", err.message, err.data);
             // Maybe show an error to the user
        });

        socket.on("socketError", (error) => {
            console.error("❌ Socket Server Error:", error.message);
            // Show error to user, e.g., couldn't join group
        });


        // --- Listen for new messages broadcast by the server ---
        const handleNewMessage = (message) => {
            console.log("📩 Received new message via socket:", message);
            // Add message if it's not already in the state
            setMessages((prevMessages) => {
               // Check if message already exists to prevent duplicates
               if (!prevMessages.some(msg => msg._id === message._id)) {
                 return [...prevMessages, message]
                     .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)); // Sort
               }
               return prevMessages;
            });
            scrollToBottom(); // Scroll down when a new message arrives
        };
        socket.on("newMessage", handleNewMessage);

        // Listen for other users joining/leaving (optional UI updates)
        socket.on("userJoined", (data) => {
             console.log("👤 User joined:", data.userId);
             // You could add a system message like "[User X] joined the chat."
        });

        socket.on("userLeft", (data) => {
             console.log("👤 User left:", data.userId);
             // You could add a system message like "[User X] left the chat."
        });


        // Cleanup on component unmount or when groupId/token changes
        return () => {
            console.log("Cleaning up socket connection...");
            socket.emit("leaveGroup", groupId); // Inform server the user is leaving the room
            socket.off("connect");
            socket.off("disconnect");
            socket.off("connect_error");
            socket.off("socketError");
            socket.off("newMessage", handleNewMessage);
            socket.off("userJoined");
            socket.off("userLeft");
            socket.disconnect();
            socketRef.current = null;
        };

    }, [groupId, token, scrollToBottom]); // Reconnect if groupId or token changes


    const handleScroll = () => {
        // Load more messages when scrolling to the top
        if (chatContainerRef.current?.scrollTop === 0 && hasMore && !loading) {
            console.log("Requesting older messages...");
             const nextPage = Math.ceil(messages.length / 20) + 1; // Calculate next page based on current count
            fetchMessages(nextPage);
        }
    };

    const handleMediaChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMediaFile(file);
            // Optional: Reset text message if media is selected?
            // setNewMessage("");
        }
    };

    // --- Send Message via API (API will broadcast via Socket) ---
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
        // Add senderId - API should verify this matches the authenticated user
        formData.append("senderId", currentUserId.current);
        formData.append("chatId", groupId); // Send groupId as chatId

        // Optimistic UI update data (create temporary ID)
        const tempId = `temp_${Date.now()}`;
         const optimisticMessage = {
            _id: tempId,
            chatId: groupId,
            senderId: { _id: currentUserId.current, fullName: 'You' /* Fetch actual name if needed */ },
            senderProfileImage: '' /* Add sender image if available */ ,
            content: newMessage,
            messageType: mediaFile ? mediaFile.type.split("/")[0] : "text",
            mediaUrl: mediaFile ? URL.createObjectURL(mediaFile) : null, // Temporary URL for preview
            timestamp: new Date().toISOString(),
            isOptimistic: true // Flag for potential styling/handling
        };

        // Add optimistic message immediately
        setMessages((prev) => [...prev, optimisticMessage]);
        setNewMessage("");
        setMediaFile(null);
        scrollToBottom();


        try {
            // Send to API
            const response = await axios.post(
                `${BASE_API_URL}/chats/${groupId}/messages`,
                formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    // Content-Type is set automatically for FormData by axios
                },
            }
            );

            if (response.data.success) {
                console.log("Message sent successfully via API, server should broadcast.");
                 const confirmedMessage = response.data.data;

                 // Replace optimistic message with confirmed one from server
                 setMessages((prev) => prev.map(msg =>
                     msg._id === tempId ? { ...confirmedMessage, isOptimistic: false } : msg
                 ));
                // The 'newMessage' socket event listener will handle messages from OTHERS.
                // The API (next step) should broadcast the confirmedMessage.
            } else {
                 console.error("❌ Error sending message (API):", response.data.message);
                 // Remove optimistic message on failure
                 setMessages((prev) => prev.filter(msg => msg._id !== tempId));
                 // Show error to user
            }
        } catch (error) {
            console.error("❌ Error sending message (Network/Server):", error);
            // Remove optimistic message on failure
             setMessages((prev) => prev.filter(msg => msg._id !== tempId));
             // Show error to user
        }
    };


    // --- Render Logic ---
    return (
        <div className={styles.chatRoomContainer}>
            {/* Event Info Header */}
            {eventDetails && (
                <div className={styles.eventInfo}>
                    {/* ... header content ... */}
                     <FiArrowLeft
                        className={styles.backIcon}
                        onClick={() => navigate("/chats")} // Or appropriate back destination
                    />
                    <img
                        src={
                            eventDetails.eventImage
                                ? `${BASE_API_URL}/${eventDetails.eventImage.replace(/\\/g, '/')}` // Handle potential backslashes
                                : `${process.env.PUBLIC_URL}/img/defaultUser.png`
                        }
                        alt={eventDetails.eventName}
                        className={styles.eventImage}
                        onError={(e) => e.target.src = `${process.env.PUBLIC_URL}/img/defaultUser.png`} // Fallback
                    />
                     <div
                        className={styles.eventText}
                        // onClick={() => navigate(`/group/${groupId}/details`)} // Link to details page
                    >
                        <h2 style={{ fontSize: "15px", margin: "5px" }}>
                             {eventDetails.eventName}
                        </h2>
                        <p style={{ marginTop: "10px" }}>
                             {/* Adjust member count logic if needed */}
                            {eventDetails.totalMembers ? `Members: ${eventDetails.totalMembers}` : 'Loading...'}
                        </p>
                     </div>
                     {/* <FiSearch className={styles.searchIcon} /> */}
                 </div>
            )}

            {/* Messages Area */}
             <div
                ref={chatContainerRef}
                onScroll={handleScroll}
                className={styles.messagesContainer}
            >
                {/* Loading indicator at the top for infinite scroll */}
                {loading && page > 1 && <p className={styles.loadingIndicator}>Loading older messages...</p>}

                 {messages.length === 0 && !loading && (
                    <p className={styles.noMessages}>No messages yet. Start the conversation!</p>
                )}

                 {messages.map((msg) => {
                    // Check if senderId exists and has _id
                    const senderId = msg.senderId?._id;
                    const isCurrentUser = senderId === currentUserId.current;

                    // Fallback for sender name
                    const senderName = isCurrentUser ? "You" : (msg.senderId?.fullName || "Unknown User");
                    // Fallback for profile image
                     const profileImage = msg.senderProfileImage
                        ? `${BASE_API_URL}/${msg.senderProfileImage.replace(/\\/g, '/')}`
                        : `${process.env.PUBLIC_URL}/img/defaultUser.png`; // Use consistent default


                     return (
                        <div
                            key={msg._id} // Use message ID as key
                            className={`${styles.messageItem} ${isCurrentUser ? styles.sentMessage : styles.receivedMessage}`}
                         >
                             <div className={styles.messageHeader}>
                                 {!isCurrentUser && ( // Show image only for received messages in this layout
                                    <img
                                        src={profileImage}
                                        alt={senderName}
                                        className={styles.profileImage}
                                        onError={(e) => e.target.src = `${process.env.PUBLIC_URL}/img/defaultUser.png`} // Fallback
                                    />
                                 )}
                                <span className={styles.senderName}>{senderName}</span>
                             </div>

                             <div className={`${styles.messageBubble} ${msg.isOptimistic ? styles.optimistic : ''}`}>
                                 {/* Render Message Content based on type */}
                                {msg.messageType === "text" && (
                                    <p className={styles.messageText}>{msg.content}</p>
                                )}
                                {msg.messageType === "image" && msg.mediaUrl && (
                                    <img
                                        // Use correct base URL for media
                                        src={msg.isOptimistic ? msg.mediaUrl : `${BASE_API_URL}${msg.mediaUrl.replace(/\\/g, '/')}`}
                                        alt="Chat attachment"
                                        className={styles.chatMediaImage}
                                        // Add loading indicator?
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

                                 {/* Timestamp */}
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

                {/* Element to scroll to */}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className={styles.inputContainer}>
                {/* Media Upload Button */}
                 <label htmlFor="mediaUpload" className={styles.mediaButton}>📎</label>
                <input
                    id="mediaUpload"
                    type="file"
                    accept="image/*,video/*,audio/*" // Accept specific types
                    onChange={handleMediaChange}
                    className={styles.fileInput} // Style to hide default input
                />

                {/* Media Preview (if mediaFile is selected) */}
                {mediaFile && (
                     <div className={styles.mediaPreview}>
                        {/* ... preview logic same as before ... */}
                         <button
                            className={styles.removeMedia}
                            onClick={() => setMediaFile(null)}
                        >
                            ❌
                        </button>
                    </div>
                )}

                 {/* Text Input */}
                <input
                    type="text"
                    placeholder={mediaFile ? "Add a caption..." : "Type a message..."}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    // Send on Enter key press
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey ? (e.preventDefault(), handleSendMessage()) : null}
                    className={styles.chatInput}
                    disabled={loading && messages.length === 0} // Disable input while initially loading
                />

                {/* Send Button */}
                 <button
                    onClick={handleSendMessage}
                    className={styles.sendButton}
                    disabled={!newMessage.trim() && !mediaFile} // Disable if nothing to send
                 >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatRoom;
