import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./notification.css";
import { formatDistanceToNow } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const PoolRequests = () => {
  const [notifications, setNotifications] = useState([]);
  const [requests, setRequests] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [activeTab, setActiveTab] = useState("general"); // Default to General tab
  const [loading,setLoading]=useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/notification`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("Fetched notifications:", data.notifications);
        setNotifications(data.notifications || []);
        
        // Count unread notifications
        const unreadCount = data.notifications.filter((notif) => !notif.read).length;
        setNotificationCount(unreadCount);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
    markNotificationsAsRead();

    const intervalId = setInterval(fetchNotifications, 10000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/requests`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRequests(data.data || []);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, []);
  // const getRelativeTime = (timestamp) => {
  //   const raw = formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    const getRelativeTime = (timestamp) => {
      const raw = formatDistanceToNow(new Date(timestamp), { addSuffix: true });
      
    return raw
    .replace(/^about /, "")
      .replace(/minutes?/, 'mins')
      .replace(/hours?/, 'hrs')
      .replace(/seconds?/, 'secs')
      .replace(/days?/, 'days')  // optional, keeps as is
      .replace(/months?/, 'mos')
      .replace(/years?/, 'yrs');
  };
  // ✅ Handle Accept/Reject for Notifications
  const handleAction = async (notification, action) => {
    setLoading(true)
    if (!notification.type) {
      console.warn("Notification type is missing!");
      return;
    }
  
    let apiUrl = "";
    let requestBody = {};
    let navigatePath = null;
  
    switch (notification.type) {
      case "Pool Invitation":
        apiUrl = `${process.env.REACT_APP_BASE_URL}/userId/${notification.wishId}`;
        requestBody = { status: action };
        if (action === "Accepted") {
          navigatePath = `/createpool/${notification.wishId}`;
        }
        break;
  
      case "Pool Join Request":
        apiUrl = `${process.env.REACT_APP_BASE_URL}/request/${notification.poolId}/${notification.senderUserId}`;
        requestBody = { status: action };
        break;
  
      case "Event Invitation":
        apiUrl = `${process.env.REACT_APP_BASE_URL}/updatestatus/${notification.eventId}`;
        requestBody = { status: action };
        if (action === "Accepted") {
          navigatePath = `/invitation-detail/${notification.eventId}`;
        }
        break;
  
      default:
        console.warn("No action required for this notification type.");
        return;
    }
  
    try {
      const token = localStorage.getItem("token");
  
      await axios.put(apiUrl, requestBody, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Swal.fire("Success!", `Notification ${action}ed successfully.`, "success");
  
      // Remove the notification from the list
      setNotifications((prev) => prev.filter((notif) => notif._id !== notification._id));
  
      // ✅ Navigate if applicable
      if (navigatePath) {
        navigate(navigatePath);
      }
    } catch (error) {
      console.error(`Error on ${action}:`, error);
      Swal.fire("Error", `Failed to ${action} notification.`, "error");
    }
    finally{
      setLoading(false)
    }
  };
  

  const markNotificationsAsRead = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${process.env.REACT_APP_BASE_URL}/markasread`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications((prev) => prev.map((notif) => ({ ...notif, status: "read" })));
      setNotificationCount(0);
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };
  const getRequestsCount = () => {
    return notifications.filter((notif) =>
      ["Pool Invitation", "Pool Join Request", "Event Invitation"].includes(notif.type)
    ).length;
  };
  
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
         
          justifyContent: "center",
          alignItems: "center",
          marginTop: "100px",
          position:'fixed',
          top:'0',
          right:'0',
          left:'0',
          bottom:'0'
        }}
      >
        {/* <Spinner
          animation="border"
          role="status"
          style={{ width: "10rem", height: "10rem" }}
        /> */}
        <div class="spinner-border text-danger custom-spinner" role="status" style={{width: '5rem', height: '5rem',color:'#ff3366'}}>
  <span class="visually-hidden">Loading...</span>
</div>
      </div>
    );
  }
  return (
    <>
      <div className="mainnotify">
        <div className="d-flex heading-notification">
          <FontAwesomeIcon icon={faArrowLeft} onClick={() => navigate("/home")}  style={{fontSize:"23px"}}/>
          <h4 className='headingnotify'>Notification</h4>
        </div>

        {/* ✅ Tabs for Switching */}
      <div className="tabs">
  <button className={activeTab === "general" ? "active" : ""} onClick={() => setActiveTab("general")}>
    General
  </button>
  <button  className={activeTab === "requests" ? "active" : ""} onClick={() => setActiveTab("requests")} >
  <span>Requests  ({getRequestsCount()})</span>
  </button>
</div>

        {/* ✅ General Notifications (No Actions) */}
        {activeTab === "general" && (
          <div className="notification-container">
            {notifications
              .filter((notif) => !["Pool Invitation", "Pool Join Request", "Event Invitation"].includes(notif.type))
              .map((notification) => {
                const userImage = notification?.senderProfileImage
                  ? `${process.env.REACT_APP_BASE_URL}/${notification.senderProfileImage}`
                  : `${process.env.PUBLIC_URL}/img/Default_pfp.svg`;

                return (
                  
                  <div key={notification._id} className="notification-item">
                    <div className="notification-text d-flex align-items-center justify-content-between">
                      <div><img src={userImage} alt="User Profile" height="35px" width="35px" style={{ borderRadius: "20px" }} loading="lazy"    /></div>
                      <p className="message">{notification.message}</p>
                      <p className="timestamp">{getRelativeTime(notification.timestamp)}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {/* ✅ Requests (With Accept/Reject) */}
        {activeTab === "requests" && (
          <div className="notification-container">
            {notifications
              .filter((notif) => ["Pool Invitation", "Pool Join Request", "Event Invitation"].includes(notif.type))
              .map((notification) => {
                const userImage = notification?.senderProfileImage
                  ? `${process.env.REACT_APP_BASE_URL}/${notification.senderProfileImage}`
                  : `${process.env.PUBLIC_URL}/img/Default_pfp.svg`;

                return (
                  <div key={notification._id} className="notification-item">
                    <div className="notification-text d-flex align-items-center justify-content-between">
                    
                    <div>  
                    <img src={userImage}  height="35px" width="35px"  loading="lazy"    style={{border:"1px solid #e6e6e6", borderRadius: "50%" }} />
                      </div><p className="message">{notification.message}</p>
                      <p className="timestamp">{getRelativeTime(notification.timestamp).replace(/^about\s/, '')}</p>

                    </div>

                    <div className="notification-actions">
                      <button className="reject-button" onClick={() => handleAction(notification, "Declined")}>
                        Reject
                      </button>
                      <button className="accept-button" onClick={() => handleAction(notification, "Accepted")}>
                        Accept
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </>
  );
};

export default PoolRequests;
