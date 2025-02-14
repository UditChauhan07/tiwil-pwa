import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button } from 'react-bootstrap'; // Assuming you're using react-bootstrap
import image1 from '../../img/image.png'; // Path to the invitation image
import { useNavigate } from 'react-router-dom';
import '../Home.css';

function Invitationlst() {
  const [invitations, setInvitations] = useState([]);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem('user.id');
const navigate=useNavigate();  

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        // Fetch invitation data from the API
        const response = await axios.get(`http://localhost:3001/api/invitation/${userId}`);

        // Map through the response data to format the invitations
        const formattedInvitation = response.data.map((invitation) => {
          const today = new Date();
          const eventDate = new Date(invitation.eventId.eventDate); // Ensure you have eventDate from eventId

          // Extract day and month from the event
          const eventDay = eventDate.getDate();
          const eventMonth = eventDate.getMonth();

          // Set event date for the current year
          let nextEventDate = new Date(today.getFullYear(), eventMonth, eventDay);

          // If the event has already passed this year, calculate for the next year
          if (nextEventDate < today) {
            nextEventDate = new Date(today.getFullYear() + 1, eventMonth, eventDay);
          }

          // Format the event date to "12 March"
          const formattedDate = nextEventDate.toLocaleDateString("en-US", {
            day: "2-digit",
            month: "long",
          });

          // Calculate days left
          const timeDifference = nextEventDate.getTime() - today.getTime();
          const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Convert ms to days

          return {
            ...invitation,
            formattedDate: formattedDate, // e.g., "12 March"
            daysLeft: `${daysLeft} days left`,
            eventType: invitation.eventId.eventType, // Accessing eventType
            fullName: invitation.eventId.fullName, // Accessing fullName
          };
        });

        setInvitations(formattedInvitation);
      } catch (error) {
        console.error("Error fetching invitations:", error);
        setError("Failed to fetch invitations.");
      }
    };

    if (userId) {
      fetchInvitation();
    }
  }, [userId]);

  const handleinvitation = (eventId) => {
    navigate(`/invitationdetails/${eventId}`);
  };

  return (
    <>
      {error && <div className="error">{error}</div>}

      <div>
        {invitations.map((invitation, index) => (
          <div key={index} style={{ gap: "15px", display: "flex", justifyContent: "center" }}>
            <Card style={{ width: "100%", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", border: "2px solid #e0e0e0", borderRadius: "10px" }}>
              <Card.Img variant="top" src={image1} style={{ height: "150px", objectFit: "contain" ,marginTop:'5px'}} />
              <Card.Body>
                <Card.Title>{invitation.fullName}</Card.Title>
                <Card.Title>{invitation.eventType}</Card.Title>
                <Card.Text>
                  <small className="text-muted">Date: {invitation.formattedDate}</small>
                </Card.Text>
                <Card.Text>
                  <small className="text-muted">{invitation.daysLeft}</small>
                </Card.Text>

                <Button variant="danger" style={{ backgroundColor: "#FF3366" }} onClick={handleinvitation}>
                  Plan and celebrate
                </Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </>
  );
}

export default Invitationlst;
