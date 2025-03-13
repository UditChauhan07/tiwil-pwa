import React from "react";
import { FaHome, FaComments, FaUsers, FaPlus } from "react-icons/fa";
import { useState,useEffect } from "react";
import FloatingActionButton from "./FloatingTab";
import { useNavigate } from "react-router-dom";

const FooterNavBar = () => {
    const [isOpen, setIsOpen] = useState(false);
const navigate=useNavigate();
  // Toggle dropdown on button click
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);
  const handleGroup=()=>{
    navigate('/chats')
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "70px",
        backgroundColor: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
      }}
    >
      {/* Home Icon */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <FaHome to='/Home' style={{ fontSize: "24px", color: "#FF3366" }} />
        <span style={{ fontSize: "12px", color: "#333" }}>Home</span>
      </div>

      {/* Group Message Icon */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <FaComments style={{ fontSize: "24px", color: "#FF3366" }} />
        <span style={{ fontSize: "12px", color: "#333" }} onClick={handleGroup}>Messages</span>
      </div>

      {/* Floating Add Icon */}
      

      {/* People Group Icon */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <FaUsers style={{ fontSize: "24px", color: "#FF3366" }} />
        <span style={{ fontSize: "12px", color: "#333" }} onClick={handleGroup}>Groups</span>
      </div>
      {/* <div
        style={{
          position: "",
          bottom: "35px",
          backgroundColor: "#FF3366",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
</div> */}
    
      {/* <div className="dropdown-button" onClick={toggleDropdown}>
        <FaPlus style={{ fontSize: "28px", color: "white" }} />
      </div>  */}

      {/* Dropdown Menu */}
      {/* <div className={`dropdown-menu ${isOpen ? "show" : ""}`}>
        <p className="dropdown-option">Add Event</p>
        <p className="dropdown-option">Add Member</p>
      </div> */}
      <div>
      <FloatingActionButton/>
    </div>
      </div>
    
  );
};

export default FooterNavBar;
