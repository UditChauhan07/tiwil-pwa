import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { FaCheckCircle, FaCircle } from "react-icons/fa";
import axios from "axios";
import { useParams } from "react-router-dom";
import Swal from 'sweetalert2'

const InviteModal = ({ show, setShow, wishId,activeTab }) => {
  const [selectedInvites, setSelectedInvites] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("token");
console.log(wishId,'wishId')
  // Fetch users when modal opens
  useEffect(() => {
    if (!show) return; // Prevent fetching if modal is closed

    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/accepted-guests/${wishId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers(response.data.data || []);
      } catch (error) {
        console.error("❌ Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, [token, show]);

  // Send notification to selected users
  const sendNotification = async () => {
    if (selectedInvites.length === 0) return;

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/send-invitation-notification`,
        {
          userId: selectedInvites, // the selected invitees
          eventId, // the event ID
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Authorization header with Bearer token
          },
        }
      );

      console.log("✅ Notification sent:", response.data);
    } catch (error) {
      console.error("❌ Error sending notification:", error);
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter((user) =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle invite selection
  const toggleInvite = (id) => {
    setSelectedInvites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Handle sending invites
  const handleSendInvite = async () => {
    if (selectedInvites.length === 0) {
      alert("Please select at least one guest.");
      return;
    }

    // Prepare the data by fetching additional user details like fullName and phoneNumber
    const guestDetails = users
      .filter((user) => selectedInvites.includes(user._id))
      .map((user) => ({
        userId:'user._id',
    // Add phoneNumber here
      }));

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/guests/invite`,
        {
         guestDetails,  // Send the full guest data (not just userId)

          wishId,  // Include the eventId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Include token in the header
          },
        }
      );
      setShow(false);
Swal.fire({
  title: "Invites sent successfully",
  text: "Your guests have been invited to the event.",
  icon: "success",

})
      console.log("✅ Invite sent successfully:", response.data);

      await sendNotification(); // Send notification after invite

     // Close modal
      setSelectedInvites([]); // Reset selection
    } catch (error) {
      console.error("❌ Error sending invite:", error);
    }
  };
  const handleStartChat = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/chats/group`,
        { eventId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.data.success) {
        // Navigate to the existing or newly created chat
        navigate(`/chats/${response.data.chat.groupId}`);

      }
    } catch (error) {
      console.error("❌ Error starting chat:", error.response?.data || error.message);
    }
  };


  return (
    <Modal show={show} onHide={() => setShow(false)} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title>Invite Guests</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Search Input */}
        <div className="search-container mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search Guests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* User List */}
        <div className="user-list">
          {filteredUsers.length === 0 ? (
            <p className="text-center text-muted">No users found</p>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                className="user-item d-flex justify-content-between align-items-center py-2 border-bottom"
              >
                <div className="user-info d-flex align-items-center">
                  <span className="user-name ms-2">{user.fullName}</span>
                </div>
                <Button
                  variant="link"
                  onClick={() => toggleInvite(user._id)}
                  style={{ color: selectedInvites.includes(user._id) ? "green" : "gray", display: "flex", justifyContent: "end" }}
                >
                  {selectedInvites.includes(user._id) ? <FaCheckCircle /> : <FaCircle />}
                </Button>
              </div>
            ))
          )}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShow(false)}>
          Close
        </Button>
        <Button variant="primary" style={{ backgroundColor: "#ff3366" }} onClick={handleSendInvite}>
          Send Invite
        </Button>
      
      </Modal.Footer>
    </Modal>
  );
};

export default InviteModal;
