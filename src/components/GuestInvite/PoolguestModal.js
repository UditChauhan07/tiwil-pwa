import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { FaCheckCircle, FaCircle } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";

const InviteModal = ({ show, setShow, wishId,poolId }) => {
  const [selectedInvites, setSelectedInvites] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("token");

  console.log("📌 Modal Opened with Wish ID:", wishId);

  // Fetch users when modal opens
  useEffect(() => {
    if (!show) return; // Prevent fetching if modal is closed

    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/accepted-guests/${wishId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("🟢 Users fetched:", response.data.data);
        setUsers(response.data.data || []);
      } catch (error) {
        console.error("❌ Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, [token, show, wishId]);

  // Toggle invite selection
  const toggleInvite = (userId) => {
    if (!userId) {
      console.error("❌ Invalid user ID:", userId);
      return;
    }

    setSelectedInvites((prev) => {
      const updatedInvites = prev.includes(userId)
        ? prev.filter((item) => item !== userId) // Remove if already selected
        : [...prev, userId]; // Add if not selected

      console.log("✅ Updated selectedInvites:", updatedInvites);
      return updatedInvites;
    });
  };

  // Handle sending invites
  const handleSendInvite = async () => {
    console.log("📌 Current selectedInvites before sending:", selectedInvites);

    if (selectedInvites.length === 0) {
      Swal.fire({
        title: "Error",
        text: "Please select at least one valid guest.",
        icon: "error",
      });
      return;
    }

    console.log("📤 Sending Invite with:", {
      poolId,
      wishId,
      invitedUserIds: selectedInvites.filter(Boolean), // Remove null values
    });
console.log(poolId)
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/pool/invite`,
        {
          poolId,
          wishId,
          invitedUserIds: selectedInvites.filter(Boolean), // Remove null values
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire({
        title: "Invites sent successfully",
        text: response.data.message,
        icon: "success",
      });

      console.log("✅ Invite sent successfully:", response.data);
      setShow(false); // Close modal
      setSelectedInvites([]); // Reset selection
    } catch (error) {
      console.error("❌ Error sending invite:", error.response?.data || error.message);
      Swal.fire({
        title: "Error",
        text: "Failed to send invites. Please try again.",
        icon: "error",
      });
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter((user) =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                key={user.userId}
                className="user-item d-flex justify-content-between align-items-center py-2 border-bottom"
              >
                <div className="user-info d-flex align-items-center">
                  <span className="user-name ms-2">{user.fullName}</span>
                </div>
                <Button
                  variant="link"
                  onClick={() => toggleInvite(user.userId)}
                  style={{
                    color: selectedInvites.includes(user.userId) ? "green" : "gray",
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  {selectedInvites.includes(user.userId) ? <FaCheckCircle /> : <FaCircle />}
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
        <Button
          variant="primary"
          style={{ backgroundColor: "#ff3366" }}
          onClick={handleSendInvite}
        >
          Send Invite
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InviteModal;
