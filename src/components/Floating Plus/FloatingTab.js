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
      <button  onClick={() => setIsOpen(!isOpen)} className="d-flex justift-content-center " style={{border:"none", alignItems:'center',background:'none'}}>
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="60" height="60" rx="30" fill="#EE4266"/>
<rect x="8" y="8" width="44.1176" height="44.1176" rx="22.0588" fill="white" />
</svg>
<div ><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{position:'relative',right:'38px'}}>
<path d="M8.17308 19.8333V11.3333H0V8.5H8.17308V0H10.8974V8.5H19.0705V11.3333H10.8974V19.8333H8.17308Z" fill="#EE4266"  />
</svg>
</div>




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
    bottom: "10px",
    right: "-5px",
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
    position:'absolute'
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
  fabplus:{

    marginLeft: "-38px",
  }
};

export default FloatingActionButton;
