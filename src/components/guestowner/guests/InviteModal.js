import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import styles from "../guests/InviteModal.module.css";

const InviteModal = ({ eventId, onInvite, onClose }) => {
    const [users, setUsers] = useState([]);
    const [selectedGuests, setSelectedGuests] = useState([]);
    const [loading, setLoading] = useState(false); // Prevent multiple requests
    const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.data) {
          setUsers(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const toggleGuestSelection = (user) => {
    if (selectedGuests.some((g) => g._id === user._id)) {
      setSelectedGuests(selectedGuests.filter((g) => g._id !== user._id));
    } else {
      setSelectedGuests([...selectedGuests, { ...user, status: "Invited" }]);
    }
  };
  useEffect(() => {
    let isMounted = true; // ✅ Prevents duplicate API calls
  
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (response.data && response.data.data && isMounted) {
          setUsers(response.data.data);
        }
      } catch (error) {
        console.error("❌ Error fetching users:", error);
      }
    };
  
    fetchUsers();
  
    return () => {
      isMounted = false; // ✅ Cleanup to prevent multiple calls
    };
  }, []);
  
  


  const handleSendInvites = async () => {
    if (!eventId || selectedGuests.length === 0) {
      Swal.fire("No guests selected!", "Please select at least one guest to invite.", "warning");
      return;
    }
  
    if (loading) return; // ✅ Prevent duplicate requests
    setLoading(true);
  
    const formattedGuests = selectedGuests.map((guest) => ({
      fullName: guest.fullName,
      phoneNumber: guest.phoneNumber, // ✅ Send phoneNumber
    }));
  
    try {
      console.log("🚀 Sending invite API request:", { eventId, guests: formattedGuests });
  
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/guests/invite`,
        { eventId, guests: formattedGuests },
        {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        }
      );
  
      if (response.data.success) {
        onInvite(response.data.guests);
        Swal.fire("Invites Sent!", "Your guests have been invited successfully.", "success");
      } else {
        Swal.fire("Error!", "Guests were not saved properly.", "error");
      }
    } catch (error) {
      console.error("❌ Error inviting guests:", error.response?.data || error.message);
      Swal.fire("Error!", "Something went wrong.", "error");
    } finally {
      setTimeout(() => setLoading(false), 2000); // ✅ Prevents spam clicking
    }
  };
  
  
 
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3 className={styles.title}>Select Users to Invite</h3>
        <ul className={styles.guestList}>
          {users.map((user) => (
            <li key={user._id} className={styles.guestItem}>
              <input
                type="checkbox"
                onChange={() => toggleGuestSelection(user)}
                checked={selectedGuests.some((g) => g._id === user._id)}
              />
              <span className={styles.guestName}>{user.fullName} ({user.phoneNumber})</span>
            </li>
          ))}
        </ul>
        <button className={styles.inviteButton} onClick={handleSendInvites}>
          Send Invite
        </button>
        <button onClick={onClose} className={styles.closeButton}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default InviteModal;
