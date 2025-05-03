import React from "react";
import Swal from 'sweetalert2';
import { useParams } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { useState } from "react";
import { Spinner } from "react-bootstrap";
const InviteButton = ({ style, children ,onInviteSuccess }) => {
  const { eventId } = useParams();
  const [loading,setLoading]=useState(false)
  const token = localStorage.getItem('token');

  const handleInvite = async () => {
    if ("contacts" in navigator && "select" in navigator.contacts) {
      setLoading(true);
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
          setLoading(false);
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
        imageUrl:   `${process.env.PUBLIC_URL}/img/Guest.svg`, // Optional: Set a custom icon or use the default one
        imageWidth: 100,
        imageHeight: 100,
        
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


  if(loading) {
    return (
      <div style={{ display: "flex",position:'fixed', justifyContent: "center",alignItems:'center', marginTop: "250px" }}>
        {/* <Spinner animation="border" role="status" style={{ width: "7rem", height: "7rem" }} /> */}
        <div class="spinner-border text-danger custom-spinner" role="status" style={{width: '5rem', height: '5rem',color:'#ff3366'}}>
  <span class="visually-hidden">Loading...</span>
</div>
      </div>
    );
  }


  return (
    <button onClick={handleInvite} style={{ ...styles.button, ...style }}>
      {children}
    </button>
  );
};

// Basic styles for button
const styles = {
  button: {
    width: '75%',
    padding: "10px 20px",
    gap:'10px',
    backgroundColor: "#EE4266",
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
