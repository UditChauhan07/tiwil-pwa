import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Form } from "react-bootstrap";
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
    <div className="containers1 mt-4">
      {/* Search Bar */}
      <Form.Control
        type="text"
        placeholder="Search invitations by event name or type"
        value={searchQuery}
        onChange={handleSearch}
        className="mb-3"
        style={{ width: "99%", margin: "0 auto" }}
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
                  backgroundImage: `url(${
                    invitation.eventDetails?.image &&
                    invitation.eventDetails.image !== "null" &&
                    invitation.eventDetails.image !== `${process.env.REACT_APP_BASE_URL}/null`
                      ? `${process.env.REACT_APP_BASE_URL}/${invitation.eventDetails.image}`
                      : `${process.env.PUBLIC_URL}/img/defaultUser.png`
                  })`,
                  position: "relative",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  height: "162px",
                  maxWidth: "100%",
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
