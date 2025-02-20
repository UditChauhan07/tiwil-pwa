import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button } from 'react-bootstrap'; // Bootstrap for styling
import image1 from '../../img/image.png'; // Invitation image
import { useNavigate } from 'react-router-dom';
import '../Home.css';

function Invitationlst() {
  const [invitations, setInvitations] = useState([]); // Store invitations
  const [filteredEvents, setFilteredEvents] = useState([]); // Filtered invitations
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/getInvite`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          setInvitations(response.data);
          setFilteredEvents(response.data); // Set filtered data initially
        }
      } catch (error) {
        console.error("Error fetching invitations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvitations();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = invitations.filter(
      (invitation) =>
        invitation.eventId.name.toLowerCase().includes(query) ||
        invitation.eventId.eventType.toLowerCase().includes(query)
    );
    setFilteredEvents(filtered);
  };

  const handleInvitation = (invitationId) => {
    if (!invitationId) {
      console.error("Error: Invitation ID is missing");
      return;
    }
    navigate(`/invitation-detail/${invitationId}`);
  };

  if (loading) {
    return <div>Loading invitations...</div>;
  }
  
  const formatDateWithCurrentYear = (dateString) => {
    if (!dateString) return "Invalid Date";
    const eventDate = new Date(dateString);
    const currentYear = new Date().getFullYear();
    
    // Set event year to current year
    eventDate.setFullYear(currentYear);

    return eventDate.toLocaleDateString("en-GB"); // "DD/MM/YYYY"
  };

  return (
    <div>
      {/* Search Bar */}
     

      {/* Display Invitations */}
      {filteredEvents.length > 0 ? (
        filteredEvents.map((invitation) => (
          <div key={invitation._id} style={{ gap: "15px", display: "flex", justifyContent: "center" ,padding:'0px'}}>
            <Card style={{ width: "100%", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", border: "2px solid #e0e0e0", borderRadius: "10px"     ,marginBottom: "10px" }}>
              <Card variant="top"  style={{ backgroundImage: `url(${image1})`, position: "relative", backgroundRepeat: "no-repeat", backgroundSize: "cover", height: "150px", objectFit: "contain", marginTop: '5px' }} >
              <div> <small className=""></small></div>
              </Card>
              <Card.Body>
                {/* Display event details */}
                <Card.Title>{invitation.eventId.name}</Card.Title>
                <Card.Text>
                  <small className="text-muted">Date: {formatDateWithCurrentYear(invitation.eventId.date)}</small>
                </Card.Text>
                <Card.Text>
                 
                </Card.Text>

                {/* Plan and Celebrate button */}
                <Button variant="danger" style={{ backgroundColor: "#FF3366" }} onClick={() => handleInvitation(invitation.eventId.eventId)}>
                  Plan and celebrate
                </Button>
              </Card.Body>
            </Card>
        
            
          </div>
        ))
      ) : (
        <div>No invitations found.</div>
      )}
    </div>
  );
}

export default Invitationlst;
