import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import './notification.css'
import { formatDistanceToNow } from "date-fns";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import {useNavigate} from 'react-router-dom'

const PoolRequests = () => {
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const navigate=useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`${process.env.REACT_APP_BASE_URL}/notification`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Fetched notifications:", data.notifications);

        // Store all notifications
        setNotifications(data.notifications || []);

        // Count unread notifications
        const unreadCount = data.notifications.filter(notif => !notif.read).length;
        setNotificationCount(unreadCount);

      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    // Fetch notifications on initial load
    fetchNotifications();
    markNotificationsAsRead();

    // Poll every 10 seconds
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

  // Function to handle Accept
  const handleAccept = async (requestId, requesterId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${process.env.REACT_APP_BASE_URL}/request/${requestId}`,
        { status: "accepted", requesterId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire("Accepted!", "The request has been accepted.", "success");
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req._id === requestId ? { ...req, status: "accepted" } : req
        )
      );
    } catch (error) {
      console.error("Error accepting request:", error);
      Swal.fire("Error", "Failed to accept the request.", "error");
    }
  };

  // Function to handle Decline
  const handleDecline = async (requestId, requesterId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${process.env.REACT_APP_BASE_URL}/request/${requestId}`,
        { status: "declined", requesterId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire("Declined!", "The request has been declined.", "warning");
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req._id === requestId ? { ...req, status: "declined" } : req
        )
      );
    } catch (error) {
      console.error("Error declining request:", error);
      Swal.fire("Error", "Failed to decline the request.", "error");
    }
  };
  const getRelativeTime = (timestamp) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };
  // ✅ Handle Accept/Reject for Notifications
  const handleAction = async (notification, action) => {
    if (!notification.type) {
      console.warn("Notification type is missing!");
      return;
    }
  
    let apiUrl = "";
    let requestBody = {}; // Dynamic request body
  
    switch (notification.type) {
      case "Pool Invitation":
        apiUrl = `${process.env.REACT_APP_BASE_URL}/userId/${notification.wishId}`;
        requestBody = { status: action }; // Body me accept/reject bhej rahe hain
        break;
  
      case "Pool Join Request":
        apiUrl = `${process.env.REACT_APP_BASE_URL}/request/${notification._id}`;
        requestBody = { status: action };
        break;
  
      case "Event Invitation":
        apiUrl = `${process.env.REACT_APP_BASE_URL}/updatestatus/${notification.eventId}`;
        requestBody = { status: action };
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
  
      Swal.fire("Success!", `Notification ${action}ed successfully.`, "success");
  
      // Remove the notification from the list
      setNotifications((prev) =>
        prev.filter((notif) => notif._id !== notification._id)
      );
    } catch (error) {
      console.error(`Error on ${action}:`, error);
      Swal.fire("Error", `Failed to ${action} notification.`, "error");
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
  
      // Update UI: Mark all notifications as read locally
      setNotifications((prev) => prev.map((notif) => ({ ...notif, status: "read" })));
      setNotificationCount(0); // Reset the count since all are read
  
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };
  
  return (
    <>
   
      <div className="mainnotify">
<div className="d-flex heading-notification">
    <FontAwesomeIcon icon={faArrowLeft}  onClick={() => navigate(-1)}/>
  <h4>Notification</h4>
</div>
      <div className="notification-container">
      {notifications.map((notification) => {
  const isActionable = ["Pool Invitation", "Pool Join Request", "Event Invitation"].includes(notification.type);
  const userImage = notification?.userImage
  ? `${process.env.REACT_APP_IMAGE_BASE_URL}/${notification.userImage}`
  : `${process.env.PUBLIC_URL}/img/userimage3.jpg`;
  return (
    <div key={notification._id} className="notification-item">
      <div className="notification-text d-flex align-items-center justify-content-between">
      <img 
          src={userImage} 
          alt="User Profile" 
          height="45px" 
          width="45px" 
         
        
        
        style={{ borderRadius: "20px" }} />
        <p className="message">{notification.message}</p>
        <p className="timestamp">{getRelativeTime(notification.timestamp)}</p>
      </div>
 
      {isActionable && (
        <div className="notification-actions">
          <button className="reject-button" onClick={() => handleAction(notification, "Declined")}>
            Reject
          </button>
          <button className="accept-button" onClick={() => handleAction(notification, "Accepted")}>
            Accept
          </button>
        </div>
      )}
    </div>
    
  );
})}

      </div>
      <div>
   
        {requests.length === 0 ? (
         null
        ) : (
          <ul>
            {requests.map((req) => (
              <li
                key={req._id}
                style={{ borderBottom: "1px solid #ccc", padding: "10px" }}
              >
                <p>
                  <strong>Requester Name:</strong>{" "}
                  {req.requesterId?.fullName || "Unknown"}
                </p>
                <p>
                  <strong>Requester ID:</strong> {req.requesterId?._id}
                </p>
                <p>
                  <strong>Pool ID:</strong> {req.poolId?._id}
                </p>
                <p>
                  <strong>Total Amount:</strong> ${req.poolId?.totalAmount}
                </p>
                <p>
                  <strong>Collected Amount:</strong> $
                  {req.poolId?.collectedAmount}
                </p>
                <p>
                  <strong>Status:</strong> {req.status}
                </p>

                {req.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleAccept(req._id, req.requesterId._id)}
                      style={{
                        marginRight: "10px",
                        backgroundColor: "green",
                        color: "white",
                      }}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleDecline(req._id, req.requesterId._id)}
                      style={{ backgroundColor: "red", color: "white" }}
                    >
                      Decline
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      </div>
    </>
  );
};

export default PoolRequests;
