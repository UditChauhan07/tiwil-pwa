import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../Home.css";

function Invitationlst() {
  const [invitations, setInvitations] = useState([]);
  const [filteredInvitations, setFilteredInvitations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/invitations`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data) {
          setInvitations(response.data.data);
          setFilteredInvitations(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching invitations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvitations();
  }, [token]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = invitations.filter(
      (invitation) =>
        invitation.eventDetails.name.toLowerCase().includes(query) ||
        invitation.eventDetails.eventType.toLowerCase().includes(query)
    );
    setFilteredInvitations(filtered);
  };

  const handleInvitation = (eventId, invitationId) => {
    if (!eventId || !invitationId) {
      console.error("Error: Event ID or Invitation ID is missing");
      return;
    }
    navigate(`/invitation-detail/${eventId}`, {
      state: { invitationId },
    });
  };

  if (loading) {
    return <div>Loading invitations...</div>;
  }

  const formatDateWithCurrentYear = (dateString) => {
    if (!dateString) return "Invalid Date";
    const eventDate = new Date(dateString);
    const currentYear = new Date().getFullYear();
    eventDate.setFullYear(currentYear);
    return eventDate.toLocaleDateString("en-GB");
  };

  return (
    <div className="container mt-4">
      {/* Search Bar */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search events..."
        value={searchQuery}
        onChange={handleSearch}
      />

      {/* Display Invitations */}
      {filteredInvitations.length > 0 ? (
        filteredInvitations.map((invitation) => (
          <div key={invitation._id} className="d-flex justify-content-center mb-3">
            <Card
              style={{
                width: "100%",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                border: "2px solid #e0e0e0",
                borderRadius: "10px",
              }}
            >
              {/* Event Image */}
              <Card
                variant="top"
                style={{
                  backgroundImage: `url(${process.env.REACT_APP_BASE_URL}/${invitation.eventDetails.image})`,
                  position: "relative",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  height: "150px",
                  objectFit: "cover",
                  marginTop: "5px",
                }}
              />

              <Card.Body>
                {/* Event Name */}
                <Card.Title>{invitation.eventDetails.name}</Card.Title>
                {/* Event Date */}
                <Card.Text>
                  <small className="text-muted">
                    Date: {formatDateWithCurrentYear(invitation.eventDetails.date)}
                  </small>
                </Card.Text>

                {/* Plan and Celebrate Button */}
                {invitation.invitations.map((inv) => (
                  <Button
                    key={inv._id}
                    variant="danger"
                    style={{ backgroundColor: "#FF3366" }}
                    onClick={() =>
                      handleInvitation(invitation.eventDetails.eventId, inv._id)
                    }
                  >
                    Plan and Celebrate
                  </Button>
                ))}
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
