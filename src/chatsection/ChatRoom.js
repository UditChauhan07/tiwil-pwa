// ChatRoom.js
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import styles from "./ChatRoom.module.css";
import { FiArrowLeft } from "react-icons/fi";


const SOCKET_SERVER_URL = "https://tiwil.truet.net";

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
    const [count,setCount]=useState(null)

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
            query: { token },
            transports: ["websocket", "polling"],
            withCredentials: true,
        });

        const socket = socketRef.current;

      
            
            const handleNewMessage = (message) => {
                console.log("📩 Received new message via socket:", message);
            
                setMessages((prevMessages) => {
                    // Prevent duplicate by checking real _id match OR optimistic match (same user + content + timestamp)
                    const isDuplicate = prevMessages.some(msg =>
                        msg._id === message._id ||
                        (msg.isOptimistic &&
                         msg.senderId._id === message.senderId._id &&
                         msg.content === message.content &&
                         Math.abs(new Date(msg.timestamp) - new Date(message.timestamp)) < 2000)
                    );
            
                    if (!isDuplicate) {
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
        socket.on("groupOnlineCount", ({ groupId, onlineCount }) => {
            console.log(`Group ${groupId} has ${onlineCount} users online`);
            setCount(onlineCount);
          });
        // socket.on("groupOnlineCount", ({ groupId, onlineCount }) => {
        //     console.log(`Group ${groupId} has ${onlineCount} users online`);
        //     setCount(onlineCount); // Update the online count state
            
        //   });
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
    
    // useEffect(() => {
    //     if (!socket) return;
      
      
      
    //     return () => {
    //       socket.off("groupOnlineCount");
    //     };
    //   }, [socketRef.current, groupId]);

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
                <div className={`${styles.eventInfo} fixed_Top`} style={{height:'60px'}}>

                    <FiArrowLeft className={styles.backIcon} onClick={() => navigate("/chats")} />
                    <img
                        src={
                            eventDetails.eventImage
                                ? `${BASE_API_URL}/${eventDetails.eventImage}`
                                : `${process.env.PUBLIC_URL}/img/defaultUser.png`
                        } loading="lazy"
                        alt={eventDetails.eventName}
                        className={styles.eventImage}
                        onError={(e) => e.target.src = `${process.env.PUBLIC_URL}/img/defaultUser.png`}
                    />
                    <div className={styles.eventText}  onClick={() => navigate(`/group/${groupId}/details`)}>
                        <h2 style={{ fontSize: "15px", margin: "5px" }}>{eventDetails.eventName}</h2>
                        <div className="d-flex gap-2"><p style={{ marginTop: "6px" }}>
                            {eventDetails.totalMembers ? ` ${eventDetails.totalMembers} members` : 'Loading...'}
                        </p>
                        <p style={{ marginTop: "6px" }}>
  {count !== null ? `${count} online` : null}
</p>
</div>

                    </div>
                </div>
            )}
            <div className={styles.chatScreen}>
            <div ref={chatContainerRef} onScroll={handleScroll} className={styles.messagesContainer} style={{ marginTop: "85px" }}>
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
                            <div className={`${styles.messageHeader} ${isCurrentUser ? styles.sentMessage : styles.receivedMessage}`}>
                           <div>
                                {/* {!isCurrentUser && (
                                  <div style={{border:'1px solid black'}}>  <img
                                        src={profileImage}
                                        alt={senderName}
                                        className={styles.profileImage}
                                        onError={(e) => e.target.src = `${process.env.PUBLIC_URL}/img/defaultUser.png`} style={{border:'1px solid black'}}
                                    /> */}
                                   
                                    <div className={styles.profileImageWrapper}>
  <img
    src={profileImage}
    alt={senderName}
    className={styles.profileImage} loading="lazy"
    onError={(e) => e.target.src = `${process.env.PUBLIC_URL}/img/defaultUser.png`}
  />
</div>

                                    
                                </div> 
                                <div className={styles.naming}>
                                <span className= {`${styles.senderName} ${isCurrentUser ? styles.sentMessage : styles.receivedMessage}`}>{senderName}</span>
                               
                            

                            <div className={`${styles.messageBubble} ${msg.isOptimistic ? styles.optimistic : ''}`}>
                                {msg.messageType === "text" && <p className={styles.messageText}>{msg.content}</p>}
                                {msg.messageType === "image" && msg.mediaUrl && (
                                    <img
                                        src={msg.isOptimistic ? msg.mediaUrl : `${BASE_API_URL}${msg.mediaUrl.replace(/\\/g, '/')}`}
                                        alt="Chat attachment"
                                        className={styles.chatMediaImage} loading="lazy"
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
                               
                            </div>
                            <span className={`${styles.messageTime} ${isCurrentUser ? styles.sentMessage : styles.receivedMessage}`} >
                                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    }) : 'Sending...'}
                                </span>
                        </div>
                        </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <div className={styles.chatInputArea}> 
            <div className={`${styles.inputContainer} fixed_bottom`}>

                <label htmlFor="mediaUpload" className={styles.mediaButton}><svg width="18" height="30" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.8791 6.37503L5.39309 11.861C4.56709 12.687 4.56709 14.027 5.39309 14.853V14.853C6.21909 15.679 7.55909 15.679 8.38509 14.853L15.6171 7.62103C17.1321 6.10603 17.1321 3.65003 15.6171 2.13503V2.13503C14.1021 0.620029 11.6461 0.620029 10.1311 2.13503L2.89909 9.36703C0.695094 11.571 0.695094 15.143 2.89909 17.347V17.347C5.10309 19.551 8.67509 19.551 10.8791 17.347L15.2681 12.958" stroke="#000E08" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
</label>
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
    
    {/* Media preview rendering */}
    {mediaFile.type.startsWith('image/') && (
      <img
        src={URL.createObjectURL(mediaFile)}
        alt="Preview"
        className={styles.previewImage} loading="lazy"
      />
    )}
    
    {mediaFile.type.startsWith('video/') && (
      <video controls className={styles.previewVideo}>
        <source src={URL.createObjectURL(mediaFile)} />
        Your browser does not support the video tag.
      </video>
    )}

    {mediaFile.type.startsWith('audio/') && (
      <audio controls className={styles.previewAudio}>
        <source src={URL.createObjectURL(mediaFile)} />
        Your browser does not support the audio tag.
      </audio>
    )}
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
                 <svg width="36" height="30" viewBox="0 0 36 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.237786 10.3769L9.35901 14.7696C9.50263 14.8181 9.64625 14.8181 9.78801 14.7696L24.4955 7.799L13.3229 16.3453C13.2278 16.4404 13.1793 16.5356 13.1327 16.6326L11.7953 24.1775C11.7468 24.3678 11.8438 24.5599 12.0341 24.655C12.1777 24.7502 12.4164 24.7502 12.5601 24.655L17.4788 21.1689L25.8838 29.0964C25.9789 29.1915 26.074 29.24 26.2177 29.24H26.3128C26.4564 29.1915 26.6 29.0964 26.6467 28.9061L35.6242 0.638553C35.6726 0.49493 35.6242 0.304675 35.529 0.161052C35.4339 0.0174292 35.2418 -0.0292032 35.0515 0.0174296L0.333878 9.47051C0.143623 9.51901 0 9.70926 0 9.89952C0 10.0916 0.048495 10.2819 0.23875 10.377L0.237786 10.3769Z" fill="#EE4266"/>
</svg>

                </button>
            </div>
            </div>

        </div>
        </div>
    );
};

export default ChatRoom;
