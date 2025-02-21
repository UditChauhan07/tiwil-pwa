import React from "react";

const InviteButton = () => {
  const handleInvite = async () => {
    if ("contacts" in navigator && "select" in navigator.contacts) {
      try {
        // Ask user to select contacts
        const contacts = await navigator.contacts.select(["name", "email", "tel"], { multiple: true });

        if (contacts.length > 0) {
          console.log("Selected Contacts:", contacts);

          // Send contacts to backend for processing
          const response = await fetch(`${process.env.REACT_APP_BASE_URL}/contactss`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contacts }),
          });

          const data = await response.json();
          alert(data.message);
        }
      } catch (error) {
        console.error("Error accessing contacts:", error);
      }
    } else {
      alert("Contacts API is not supported on this device.");
    }
  };

  return (
    <button onClick={handleInvite} style={styles.button}>
      Invite Contacts
    </button>
  );
};

// Basic styles for button
const styles = {
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default InviteButton;
