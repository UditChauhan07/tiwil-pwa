import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { FaCheckCircle, FaCircle } from "react-icons/fa"; // For checking the selection
import axios from "axios";
import { useParams } from "react-router-dom";

const InviteModal = ({ show, setShow }) => {
  const [selectedInvites, setSelectedInvites] = useState([]);  // Track selected users
  const [users, setUser] = useState([]); // List of guests
  const [searchQuery, setSearchQuery] = useState("");  // Search input for filtering users

  // Get the eventId from localStorage or URL params
  const eventId = localStorage.getItem("eventId1");  // or use useParams() if eventId is in URL
  const token = localStorage.getItem("token");

  // Fetch guests when component mounts
  useEffect(() => {

    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers(response.data.data || []);
      } catch (error) {
        console.error("❌ Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, [token, show]);
  console.log(token,'uuuuuuuuuuuuuuuuuuuuuu')
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

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/sendInvite`, {
        userIds: selectedInvites,
        eventId,
      });

      console.log("✅ Invite sent successfully:", response.data);

      await sendNotification(); // Send notification after invite

      setShow(false); // Close modal
      setSelectedInvites([]); // Reset selection
    } catch (error) {
      console.error("❌ Error sending invite:", error);
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
                      style={{ color: selectedInvites.includes(user._id) ? "green" : "gray" }}
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
