// Guest.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import InviteModal from "../guests/InviteModal";
import styles from "../guests/Guest.module.css";

const Guest = ({ eventId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guests, setGuests] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/guests/${eventId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data.success) {
          setGuests(response.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching guests:", error);
        setGuests([]);
      }
    };

    if (eventId) {
      fetchGuests();
    }
  }, [eventId]);

  const handleInvite = async (selectedGuests) => {
    if (!eventId || !Array.isArray(selectedGuests) || selectedGuests.length === 0) {
      console.error("Invalid eventId or empty guest list.");
      return;
    }

    try {
      console.log("Sending data:", { eventId, guests: selectedGuests });
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/guests/invite`,
        { eventId, guests: selectedGuests },
        {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        setGuests([...guests, ...selectedGuests]);
        setIsModalOpen(false);
      } else {
        console.error("API error:", response.data.message);
      }
    } catch (error) {
      console.error("Error inviting guests:", error.response?.data || error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Guest List</h3>
      {guests.length === 0 ? (
        <p className={styles.noGuestText}>No guests invited yet.</p>
      ) : (
        <ul className={styles.guestList}>
          {guests.map((guest, index) => (
            <li key={index} className={styles.guestItem}>
              <img src="/default-avatar.png" alt="guest" className={styles.avatar} />
              <span className={styles.guestName}>{guest.name}</span>
              <span className={styles.guestStatus}>{guest.status}</span>
            </li>
          ))}
        </ul>
      )}
      <button className={styles.inviteButton} onClick={() => setIsModalOpen(true)}>
        Invite Guests
      </button>
      {isModalOpen && <InviteModal eventId={eventId} onInvite={handleInvite} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default Guest;