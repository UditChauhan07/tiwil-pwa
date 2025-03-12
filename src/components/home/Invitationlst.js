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
          // Filter invitations to include only the accepted ones
          const acceptedInvitations = response.data.data.filter((invitation) =>
            invitation.invitations.some(
              (invitationDetail) => invitationDetail.status === "Accepted"
            )
          );

          setInvitations(acceptedInvitations);
          setFilteredInvitations(acceptedInvitations);
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
        invitation.event.name.toLowerCase().includes(query) ||
        invitation.event.eventType.toLowerCase().includes(query)
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

  const formatDateWithCurrentYear = (dateString) => {
    if (!dateString) return "Invalid Date";
    const eventDate = new Date(dateString);
    const currentYear = new Date().getFullYear();
    eventDate.setFullYear(currentYear);
    return eventDate.toLocaleDateString("en-GB");
  };

  if (loading) {
    return <div>Loading invitations...</div>;
  }

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
                    invitation.event.image &&
                    invitation.event.image !== "null" &&
                    invitation.event.image !== `${process.env.REACT_APP_BASE_URL}/null`
                      ? `${process.env.REACT_APP_BASE_URL}/${invitation.event.image}`
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
                <Card.Title>{invitation.event.name}</Card.Title>
                {/* Event Date */}
                <Card.Text>
                  <small className="text-muted">
                    Date: {invitation.event.formatteDate}
                  </small>
                </Card.Text>

                {/* Plan and Celebrate Button */}
                {invitation.invitations.length > 0 && (
                  <Button className="planbtn"
                    variant="danger"
                 
                    onClick={() =>
                      handleInvitation(
                        invitation.event.eventId,
                        invitation.invitations[0]._id
                      )
                    }
                  >
                    Plan and Celebrate
                  </Button>
                )}
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
