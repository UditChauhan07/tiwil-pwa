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
          // const acceptedInvitations = response.data.data.filter((invitation) =>
          //   invitation.invitations.some(
          //     (invitationDetail) => invitationDetail.status === "Accepted"
          //   )
          // );

          setInvitations( response.data.data);
          setFilteredInvitations( response.data.data);
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
  const calculateAgeAndBirthdayText = (eventDate) => {
    if (!eventDate) return "N/A";

    const today = new Date();
    const targetDate = new Date(eventDate); // The person's birthday date
    const currentYear = today.getFullYear();

    // Ensure targetDate is set to the current year
    targetDate.setFullYear(currentYear);

    // Calculate age based on the birthdate year
    const birthDate = new Date(eventDate);
    const age = today.getFullYear() - birthDate.getFullYear();

    // Calculate the difference in days between today and the birthday
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // If the birthday is today
    if (diffDays === 0) {
      return `Today!`;
    }

    // If the birthday has passed this year, set the target date to next year
    if (diffDays < 0) {
      targetDate.setFullYear(currentYear + 1);
    }

    // Calculate days left for the next birthday (if already passed this year)
    const nextDiffTime = targetDate - today;
    const nextDiffDays = Math.ceil(nextDiffTime / (1000 * 60 * 60 * 24));

    // If the birthday is in the future
    return `${nextDiffDays} Days Left `;
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
        filteredInvitations.map((invitation,index) => (
          <div key={     index} className="d-flex justify-content-center mb-3">
         
        <Card
                        style={{
                          width: "100%",
                          minWidth: "310px",
                          border: "0.5px solid rgb(229 229 229)",
                          borderRadius: "10px",
                        
                          marginBottom: index === filteredInvitations.length - 1 ? "80px" : "10px",
                        }}
                      >
                        <div style={{ height: "150px" }}>
                          <Card
                            variant="top"
                            style={{
                              position: "relative",
                              width: "100%",
                              height: "162px",
                            }}
                          >
                            <img
                              src={
                                invitation.event.image &&
                                invitation.event.image !== "null" &&
                                invitation.event.image !== `${process.env.REACT_APP_BASE_URL}/null`
                                  ? `${process.env.REACT_APP_BASE_URL}/${invitation.event.image}`
                                  : `${process.env.PUBLIC_URL}/img/eventdefault.png`
                              }
                              alt="Event"
                              className="imgEvent"
                            />
                            <div
                              style={{
                                borderRadius: "0px 10px 0px 0px", // Rounded corners on the right side
                                position: "absolute", // Absolute positioning within the Card container
                                top: "0px", // Adjust as needed
                                right: "1px", // Adjust as needed
                                color: "white", // Text color
                                fontSize: "15px", // Text size
                                fontWeight: "bold", // Optional for bold text
                                backgroundColor: "#ff3366", // Optional background for contrast
                                padding: "5px", // Padding for text
                              }}
                            >
                              {calculateAgeAndBirthdayText(
                                invitation.event.date || invitation.event.eventDate
                              )}
                            </div>
        
                            {/* <small className="" style={{ color: "white", paddingRight: "24px", paddingTop: '5px', textAlign: 'end', color: "#ff3366", fontWeight: '600' }}>
                        
                            </small> */}
                          </Card>
                        </div>                      {/* <small className="" style={{ color: "white", paddingRight: "24px", paddingTop: '5px', textAlign: 'end', color: "#ff3366", fontWeight: '600' }}>
                          
                              </small> */}
                               <Card.Body>
                {/* Event Name */}
                <Card.Title>{invitation.event.name}</Card.Title>
                {/* Event Date */}
                 <Card.Text
                                    className="d-flex justify-content-between"
                                    style={{ gap: "10px" }}
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <img
                                        className="m-0.5"
                                        src={`${process.env.PUBLIC_URL}/img/calender.svg`}
                                        height={"17px"}
                                        alt="calendar"
                                      />
                                      <h6
                                        style={{
                                          marginRight: "10px",
                                          marginBottom: "5px",
                                          fontWeight: "600",
                                          marginLeft: "5px",
                                        }}
                                      >
                                       {invitation.event.formattedDate || "Date not available"}
                                      </h6>
                                    </div>
                                    <div>
                                      {invitation.event.relation &&
                                        invitation.event.relation.toLowerCase() !== "parent anniversary" &&
                                        invitation.event.relation.toLowerCase() !==
                                        "marriage anniversary" ? (
                                        <h4
                                          style={{
                                            background: "white",
                                            color: "#ff3366",
                                            border: "1px solid #ff3366",
                                            paddingLeft: "10px",
                                            padding: "3px 27px 0px 26px",
                                            borderRadius: "10px",
                                          }}
                                        >
                                          {invitation.event.relation}
                                        </h4>
                                      ) : null}
                                    </div>
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
