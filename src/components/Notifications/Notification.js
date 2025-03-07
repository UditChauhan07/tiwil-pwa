import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const PoolRequests = () => {
  const [requests, setRequests] = useState([]);
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/requests`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRequests(data.data || []);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };
  
    fetchRequests();
  }, []); // Make sure the useEffect has a proper dependency array
  
  // Function to handle Accept
  // Function to handle Accept
const handleAccept = async (requestId, requesterId) => {
  try {
    const token = localStorage.getItem("token");

    await axios.put(
      `${process.env.REACT_APP_BASE_URL}/request/${requestId}/respond`,
      { status: "accepted", requesterId }, // Sending requesterId._id in the request body
      {
        headers: { Authorization: `Bearer ${token}` },
      }
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
      `${process.env.REACT_APP_BASE_URL}/request/${requestId}/respond`,
      { status: "declined", requesterId }, // Sending requesterId._id in the request body
      {
        headers: { Authorization: `Bearer ${token}` },
      }
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


  return (
    <div>
      <h2>Pool Join Requests</h2>
      {requests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <ul>
        {requests.map((req) => (
  <li key={req._id} style={{ borderBottom: "1px solid #ccc", padding: "10px" }}>
    <p><strong>Requester Name:</strong> {req.requesterId?.fullName || "Unknown"}</p>
    <p><strong>Requester ID:</strong> {req.requesterId?._id}</p>
    <p><strong>Pool ID:</strong> {req.poolId?._id}</p>
    <p><strong>Total Amount:</strong> ${req.poolId?.totalAmount}</p>
    <p><strong>Collected Amount:</strong> ${req.poolId?.collectedAmount}</p>
    <p><strong>Status:</strong> {req.status}</p>

    {req.status === "pending" &&  (
      <>
        <button
          onClick={() => handleAccept(req._id, req.requesterId._id)}
          style={{ marginRight: "10px", backgroundColor: "green", color: "white" }}
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
  );
};

export default PoolRequests;
