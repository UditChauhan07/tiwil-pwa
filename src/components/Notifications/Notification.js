import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import './notification.css'
import { formatDistanceToNow } from "date-fns";

const PoolRequests = () => {
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    // Function to fetch notifications from the API
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/notification`, // Your API endpoint
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // Update notifications and count
        setNotifications(data.notifications || []);
        setNotificationCount(data.notifications.length); // Update notification count
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    // Fetch notifications on initial load
    fetchNotifications();

    // Set polling to fetch notifications every 10 seconds
    const intervalId = setInterval(fetchNotifications, 10000); // Poll every 10 seconds

    // Clean up the interval when component unmounts
    return () => {
      clearInterval(intervalId);
    };
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
  

  const handleback=()=>{
    window.history.back();
  }
  return (
    <>
   
      
<div className="d-flex heading-notification">
<img src={`${process.env.PUBLIC_URL}/img/arrow-left.svg`} alt="notification" height={"20px"} width={"20px"} onClick={handleback} />
  <h4>Notification</h4>
</div>
      <div className="notification-container">
      {notifications.map((notification) => {
  const isActionable = ["Pool Invitation", "Pool Join Request", "Event Invitation"].includes(notification.type);

  return (
    <div key={notification._id} className="notification-item">
      <div className="notification-text d-flex align-items-center justify-content-between">
        <img src={`${process.env.PUBLIC_URL}/img/userimage3.jpg`} alt="notification" height={"45px"} width={"45px"} style={{ borderRadius: "20px" }} />
        <p className="message">{notification.message}</p>
        <p className="timestamp">{getRelativeTime(notification.timestamp)}</p>
      </div>

      {isActionable && (
        <div className="notification-actions">
          <button className="reject-button" onClick={() => handleAction(notification, "declined")}>
            Reject
          </button>
          <button className="accept-button" onClick={() => handleAction(notification, "accepted")}>
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
    </>
  );
};

export default PoolRequests;
