import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Invitationlst({searchQuery}) {
  const [invitations, setInvitations] = useState([]);
  const [filteredInvitations, setFilteredInvitations] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [filterData, setFilterData] = useState({
    months: [],
    relations: [],
    eventTypes: [],
    favoritesOnly: false,
  });
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
const abc=localStorage.getItem('filters')
  // Function to load filters from localStorage
  const loadFiltersFromLocalStorage = () => {
    const savedFilters = localStorage.getItem("filters");
    if (savedFilters) {
      return JSON.parse(savedFilters);
    }
    return { months: [], relations: [], eventTypes: [], favoritesOnly: false }; // Default filters if no data is in localStorage
  };

  // Initial load of filters from localStorage
  useEffect(() => {
    const savedFilters = loadFiltersFromLocalStorage();
    setFilterData(savedFilters);
  }, []);

  useEffect(() => {
    const fetchInvitations = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/invitations`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data) {
          setInvitations(response.data.data);
          applyFilters(response.data.data); // Apply filters immediately after fetching data
        }
      } catch (error) {
        console.error("Error fetching invitations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvitations();
  }, [token,abc]);

  // Reapply filters whenever searchQuery or filterData changes
  useEffect(() => {
    applyFilters(invitations); // Reapply filters whenever searchQuery or filterData changes
  }, [searchQuery, filterData, invitations,abc]);

  const applyFilters = (invitationsList) => {
    let filtered = invitationsList;

    // Apply search query filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (invitation) =>
          invitation.event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          invitation.event.eventType.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply month filter
    if (filterData.months.length > 0) {
      filtered = filtered.filter((invitation) =>
        filterData.months.includes(new Date(invitation.event.date).toLocaleString("en-us", { month: "long" }))
      );
    }

    // Apply event type filter
    if (filterData.eventTypes.length > 0) {
      filtered = filtered.filter((invitation) =>
        filterData.eventTypes.includes(invitation.event.eventType)
      );
    }

    // Apply relation filter
    if (filterData.relations.length > 0) {
      filtered = filtered.filter((invitation) =>
        filterData.relations.includes(invitation.event.relation)
      );
    }

    // Apply favorites filter
    if (filterData.favoritesOnly) {
      filtered = filtered.filter((invitation) => invitation.event.favorites === true);
    }

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

  const handleApplyFilters = (filters) => {
    setFilterData(filters);
    localStorage.setItem("filters", JSON.stringify(filters)); // Save filters to localStorage
    applyFilters(invitations); // Apply filters immediately
  };

  const handleClearFilters = () => {
    const defaultFilters = {
      months: [],
      relations: [],
      eventTypes: [],
      favoritesOnly: false,
    };
    setFilterData(defaultFilters);
    localStorage.setItem("filters", JSON.stringify(defaultFilters)); // Reset filters in localStorage
    applyFilters(invitations); // Fetch all invitations again
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
        <Spinner animation="border" role="status" style={{ width: "5rem", height: "5rem" }} />
      </div>
    );
  }

  return (
    <div className="containers1 mt-4">
      {/* Search Bar */}
    

  

      {/* Display Invitations */}
      {filteredInvitations.length > 0 ? (
        filteredInvitations.map((invitation, index) => (
          <div key={index} className="d-flex justify-content-center mb-3">
            <Card style={{ width: "100%", minWidth: "310px", border: "0.5px solid rgb(229 229 229)", borderRadius: "10px" }}>
              <div style={{ height: "150px" }}>
                <Card variant="top" style={{ position: "relative", width: "100%", height: "162px" }}>
                  <img
                    src={invitation.event.newimage && invitation.event.newimage !== "null" ? `${process.env.REACT_APP_BASE_URL}/${invitation.event.newimage}` : `${process.env.PUBLIC_URL}/img/eventdefault.png`}
                    alt="Event"
                    style={{ width: '100%', height: '162px' }}
                    className="imgEvent"
                  />
                  <div
                    style={{
                      borderRadius: "0px 10px 0px 0px",
                      position: "absolute",
                      top: "0px",
                      right: "1px",
                      color: "white",
                      fontSize: "15px",
                      fontWeight: "bold",
                      backgroundColor: "#ff3366",
                      padding: "5px",
                    }}
                  >
                    {formatDateWithCurrentYear(invitation.event.date)}
                  </div>
                </Card>
              </div>
              <Card.Body>
                <Card.Title>{invitation.event.name}</Card.Title>
                <Card.Text className="d-flex justify-content-between" style={{ gap: "10px" }}>
                  <h6>{invitation.event.formattedDate || "Date not available"}</h6>
                </Card.Text>
                <Button variant="danger" onClick={() => handleInvitation(invitation.event.eventId, invitation._id)}>
                  Plan and Celebrate
                </Button>
              </Card.Body>
            </Card>
          </div>
        ))
      ) : (
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'50vh' ,fontSize:'x-large',fontWeight:'700',color:'rgba(238, 66, 102, 0.80)'}}>No invitations found</div>
      )}
    </div>
  );
}

export default Invitationlst;
