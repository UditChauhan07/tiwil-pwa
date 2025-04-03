import React from "react";
import Swal from 'sweetalert2';
import { useParams } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const InviteButton = ({ style, children ,onInviteSuccess }) => {
  const { eventId } = useParams();
  const token = localStorage.getItem('token');

  const handleInvite = async () => {
    if ("contacts" in navigator && "select" in navigator.contacts) {
      try {
        // Ask user to select contacts
        const contacts = await navigator.contacts.select(["name", "email", "tel"], { multiple: true });

        if (contacts.length > 0) {
          console.log("Selected Contacts:", contacts);

          // Send contacts to backend for processing
          const response = await fetch(`${process.env.REACT_APP_BASE_URL}/contactss/${eventId}`, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`, // Add your token here
            },
            body: JSON.stringify({ contacts }),
          });

          const data = await response.json();
          localStorage.setItem("invited",data.data)
          Swal.fire({
            title:'Your guest has invited!'
            ,
     
        confirmButtonText: 'Ok got it!',
        confirmButtonColor: '#FF3366',
        customClass: {
          popup: 'swal-popup',
          title: 'swal-title',
          confirmButton: 'swal-confirm-btn',
          text: 'swal-text',
        },
        imageUrl:   `${process.env.PUBLIC_URL}/img/letsgo.png`, // Optional: Set a custom icon or use the default one
        imageWidth: 80,
        imageHeight: 80,
        
        padding: '2rem',
        background: '#fff',
      
          })
          if (onInviteSuccess) {
            onInviteSuccess();
          }
        }
        
      } catch (error) {
        console.error("Error accessing contacts:", error);
      }
    } else {
      alert("Contacts API is not supported on this device.");
    }
  };

  return (
    <button onClick={handleInvite} style={{ ...styles.button, ...style }}>
      {children} <FaArrowRight />
    </button>
  );
};

// Basic styles for button
const styles = {
  button: {
    width: '75%',
    padding: "10px 20px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "15px",
    cursor: "pointer",
    display: "flex",  // Add flex display for text alignment
    justifyContent: "center", // Center text horizontally
    alignItems: "center", // Center text vertically
  },
};

export default InviteButton;
