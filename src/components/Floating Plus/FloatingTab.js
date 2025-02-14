import React, { useState } from "react";
import { FaPlus, FaCalendarAlt, FaUserPlus } from "react-icons/fa";
import AddEvents from "../Events/addEvents";
import Memberform from "../Members/addMembers";

const FloatingActionButton = ({ onAddEvent, onAddMember }) => {
  const [isOpen, setIsOpen] = useState(false);
const [showeventModal, setShoweventModal] = useState(false);
const [showmemberModal, setShowmemberModal] = useState(false);
  return (
   <>
   <div style={styles.container}>
      {/* Options - Show when button is clicked */}
      {isOpen && (
        <div style={styles.optionsContainer}>
          <button style={styles.optionButton} onClick={() => setShoweventModal(true)}>
            <FaCalendarAlt style={styles.icon} /> Add Event
          </button>
          <button style={styles.optionButton} onClick={() => setShowmemberModal(true)}>
            <FaUserPlus style={styles.icon} /> Add Member
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <button style={styles.fab} onClick={() => setIsOpen(!isOpen)}>
        <FaPlus style={styles.fabIcon} />
      </button>
    </div>
    <div>
    <Memberform show={showmemberModal} setShow={setShowmemberModal}  />
      <AddEvents show={showeventModal} setShow={setShoweventModal}  />
</div>
</>
  );
};

// Styles
const styles = {
  container: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: 1000,
  },
  fab: {
    backgroundColor: "#FF3366", // Tiwil Project Theme Color
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "60px",
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    cursor: "pointer",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    transition: "0.3s ease",
  },
  fabIcon: {
    fontSize: "26px",
  },
  optionsContainer: {
    position: "absolute",
    bottom: "70px",
    right: "5px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  optionButton: {
    backgroundColor: "#FF3366",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
    fontSize: "16px",
    transition: "0.3s ease",
  },
  icon: {
    fontSize: "18px",
  },
};

export default FloatingActionButton;
