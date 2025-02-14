import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { FaCheckCircle, FaCircle } from "react-icons/fa"; // For checking the selection
import axios from "axios";
import { useParams } from "react-router-dom";

const InviteModal = ({ show, setShow, activeTab }) => {
  const [selectedInvites, setSelectedInvites] = useState([]);
  const [users, setUsers] = useState([]); // Ensure this is initialized as an empty array
  const [searchQuery, setSearchQuery] = useState("");
  const { eventId } = useParams(); // Destructure eventId correctly from useParams

  // Fetch users when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/auth/getUsers');
        console.log('Response:', response.data);  // Log the response to check the structure

        // Access the 'user' property which contains the array of users
        setUsers(response.data.user);  // Set users using the 'user' key in the response
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Send notification to the selected users
  const sendNotification = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/send-invitation-notification', {
        userId: selectedInvites, // Array of selected users
        eventId: eventId, // Event ID to associate with the notification
      });
      console.log('Notification sent:', response.data); // Log the response to confirm success
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  // Filtered users based on search query
  const filteredUsers = users.length > 0 
    ? users.filter((user) =>
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];  // Ensure filteredUsers is an empty array if users is empty

  // Toggle invite status
  const toggleInvite = (id) => {
    if (selectedInvites.includes(id)) {
      setSelectedInvites(selectedInvites.filter((item) => item !== id));
    } else {
      setSelectedInvites([...selectedInvites, id]);
    }
  };

  // Handle sending invites
  const handleSendInvite = async () => {
    try {
      // Prepare the data to send in the invite (you can also send the eventID here)
      const inviteData = {
        userIds: selectedInvites,  // Array of selected user IDs
        eventId   // Replace with the actual event ID you want to send
      };

      // Send the invite to the backend
      const response = await axios.post('http://localhost:3001/auth/sendInvite', inviteData);

      // Show success message or handle success logic
      console.log("Invite sent successfully:", response.data);
      
      // Send the notification to the invited users
      await sendNotification();  // Send notification after sending the invite

      setShow(false);  // Close modal after sending invite
      ; // Optionally switch to the guests tab
    } catch (error) {
      console.error("Error sending invite:", error);
    }
  };

  return (
    <div>
      {/* Invite Modal */}
      <Modal show={show} onHide={() => setShow(false)} centered size="md">
        <Modal.Header closeButton>
          <Modal.Title>Guests</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* Search input */}
          <div className="search-container">
            <input
              type="text"
              className="form-control"
              placeholder="Search Guests"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Handle search query
            />
          </div>
          
          {/* User list */}
          <div className="user-list">
            {filteredUsers.length === 0 ? (
              <p>No users found</p> // Handle empty user list
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user._id} // Use _id here instead of id
                  className="user-item d-flex justify-content-between align-items-center"
                  style={{ padding: "10px 0" }}
                >
                  <div className="user-info d-flex align-items-center">
                    {/* User info with full name */}
                    <div className="user-name" style={{ marginLeft: "10px" }}>
                      {user.fullName} {/* Show full name */}
                    </div>
                  </div>
                  <div>
                    <Button
                      variant="link"
                      onClick={() => toggleInvite(user._id)} // Use _id to toggle invite
                      style={{
                        color: selectedInvites.includes(user._id)
                          ? "green"
                          : "gray",
                      }}
                    >
                      {selectedInvites.includes(user._id) ? (
                        <FaCheckCircle />
                      ) : (
                        <FaCircle />
                      )}
                    </Button>
                  </div>
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
    </div>
  );
};

export default InviteModal;
