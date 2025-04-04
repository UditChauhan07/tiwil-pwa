import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Invitationlst({ searchQuery }) {
  const [invitations, setInvitations] = useState([]);
  const [filteredInvitations, setFilteredInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log("loadinggg",loading);
  const [filterData, setFilterData] = useState({
    months: [],
    relations: [],
    eventTypes: [],
    favoritesOnly: false,
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Function to load filters from localStorage
  const loadFiltersFromLocalStorage = () => {
    const savedFilters = localStorage.getItem("filters");
    if (savedFilters) {
      return JSON.parse(savedFilters);
    }
    return { months: [], relations: [], eventTypes: [], favoritesOnly: false }; // Default filters if no data is in localStorage
  };
  const abc=localStorage.getItem("filters");
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
        console.log("Invitations data:", response.data.data); // Add this line
      }
    } catch (error) {
      console.error("Error fetching invitations:", error);
    } finally {
      setLoading(false);
    }
  };
  fetchInvitations();
}, [token, localStorage.getItem("filters")]);

  // Reapply filters whenever searchQuery or filterData changes
  useEffect(() => {
    applyFilters(invitations);
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
      console.log("After search filter:", filtered);
    }
  
    // Apply month filter
    if (filterData.months.length > 0) {
      filtered = filtered.filter((invitation) =>
        filterData.months.includes(new Date(invitation.event.date).toLocaleString("en-us", { month: "long" }))
      );
      console.log("After month filter:", filtered);
    }
  
    // Apply event type filter
    if (filterData.eventTypes.length > 0) {
      filtered = filtered.filter((invitation) =>
        filterData.eventTypes.includes(invitation.event.eventType)
      );
      console.log("After event type filter:", filtered);
    }
  
    // Apply relation filter
    if (filterData.relations.length > 0) {
      filtered = filtered.filter((invitation) =>
        filterData.relations.includes(invitation.event.relation)
      );
      console.log("After relation filter:", filtered);
    }
  
    // Apply favorites filter
    if (filterData.favoritesOnly) {
      filtered = filtered.filter((invitation) => invitation.event.favorites === true);
      console.log("After favorites filter:", filtered);
    }
  
    setFilteredInvitations(filtered);
    console.log("Final filtered invitations:", filtered);
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

  const handleApplyFilters = (filters) => {
    setFilterData(filters);
    localStorage.setItem("filters", JSON.stringify(filters));
    applyFilters(invitations);
    console.log("Filter data after apply:", filters); // Add this line
  };
  
  const handleClearFilters = () => {
    const defaultFilters = {
      months: [],
      relations: [],
      eventTypes: [],
      favoritesOnly: false,
    };
    setFilterData(defaultFilters);
    localStorage.setItem("filters", JSON.stringify(defaultFilters));
    applyFilters(invitations);
    console.log("Filter data after clear:", defaultFilters); // Add this line
  };


  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
        <Spinner animation="border" role="status" style={{ width: "5rem", height: "5rem" }} />
      </div>
    );
  }

 
  const formatDateWithCurrentYear = (formattedDate, originalDate, alternateDate) => {
    const eventDate = new Date(originalDate || alternateDate);
    if (isNaN(eventDate.getTime())) return "Invalid Date";
  
    const today = new Date();
    const currentYear = today.getFullYear();
  
    // Set the event year to the current year
    eventDate.setFullYear(currentYear);
  
    // If today's date is later than the event date, set the event year to the next year
    if (today > eventDate) {
      eventDate.setFullYear(currentYear + 1);
    }
  
    return eventDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };
  
  const getUpcomingBirthdayNumber = (eventDate) => {
    if (!eventDate) return null; // Handle invalid dates

    const today = new Date();
    const birthDate = new Date(eventDate); // The person's birthday date

    // Calculate the initial age (number of birthdays already passed)
    let upcomingBirthday = today.getFullYear() - birthDate.getFullYear();

    // Check if their birthday hasn't occurred yet this year
    const thisYearBirthday = new Date(birthDate);
    thisYearBirthday.setFullYear(today.getFullYear());

    if (today < thisYearBirthday) {
      upcomingBirthday--; // Subtract 1 if the birthday hasn't occurred yet
    }

    // Determine the ordinal suffix (1st, 2nd, 3rd, nth)
    return getOrdinalSuffix(upcomingBirthday + 1); // +1 since we start counting from the 1st birthday
  };

  // Determine the ordinal suffix (1st, 2nd, 3rd, nth)
  const getOrdinalSuffix = (number) => {
    const j = number % 10,
      k = number % 100;
    if (j === 1 && k !== 11) {
      return number + "st";
    }
    if (j === 2 && k !== 12) {
      return number + "nd";
    }
    if (j === 3 && k !== 13) {
      return number + "rd";
    }
    return number + "th";
  };
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
      return "Today!";
    }

    // If the birthday has passed this year, set the target date to next year
    if (diffDays < 0) {
      targetDate.setFullYear(currentYear + 1);
    }

    // Calculate days left for the next birthday (if already passed this year)
    const nextDiffTime = targetDate - today;
    const nextDiffDays = Math.ceil(nextDiffTime / (1000 * 60 * 60 * 24));

    // If the birthday is in the future
    return `${nextDiffDays} Days Left` ;
  };

const handlefavourite=()=>{

}
  return (
    <div className="containers1 mt-4">
      {/* Search Bar */}
    

      {/* Display Invitations */}
      {filteredInvitations.length > 0 ? (
        filteredInvitations.map((invitation, index) => (
          <div key={index} className="d-flex justify-content-center mb-3">
            <Card style={{ width: "100%", minWidth: "310px", border: "0.5px solid rgb(229 229 229)", borderRadius: "10px",marginBottom: index === filteredInvitations.length - 1 ? "80px" : "10px"  }}>
              <div style={{ height: "150px" }}>
                <Card variant="top" style={{ position: "relative", width: "100%", height: "162px",borderBottom:'unset' }}>
                  <img
                    // src={invitation.event.newimage && invitation.event.newimage !== "null" ? `${process.env.REACT_APP_BASE_URL}/${invitation.event.newimage}` : `${process.env.PUBLIC_URL}/img/eventdefault.png`}
                    src={invitation.event.newimage && invitation.event.newimage !== "null" ? `${process.env.REACT_APP_BASE_URL}/${invitation.event.newimage}` : invitation.event.image && invitation.event.image !== "null" ? `${process.env.REACT_APP_BASE_URL}/${invitation.event.image}` : `${process.env.PUBLIC_URL}/img/eventdefault.png`}
                    alt="Event"
                    style={{ width: '100%', height: '162px',padding:'5px' }}
                    className="imgEvent"
                  />
                  <div
                    style={{
                      borderRadius: "0px 4px 0px 0px",
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      color: "white",
                      fontSize: "15px",
                      fontWeight: "bold",
                      backgroundColor: "#ff3366",
                      padding: "5px",
                    }}
                  >
                    {calculateAgeAndBirthdayText(invitation.event.date)}
                  </div>
                </Card>
              </div>
              <Card.Body>
                <Card.Title>{invitation.event.name}   {invitation.event.relation &&
    
    invitation.event.date &&
    getUpcomingBirthdayNumber(invitation.event.date)
  }{" "}  {invitation.event.eventType}</Card.Title>
                <Card.Text className="d-flex justify-content-between" style={{ gap: "10px" }}>
                                 <div style={{ display: "flex", justifyContent: "space-between" }}>
                                   <img className="m-0.5" src={`${process.env.PUBLIC_URL}/img/calender.svg`} height="17px" alt="calendar" />
                                   <h6 style={{ marginRight: "3px", marginBottom: "5px", fontWeight: "600", marginLeft: "5px",fontSize:'13px' }}>
                                     {invitation.event.displayDate ? formatDateWithCurrentYear(invitation.event.displayDate, invitation.event.date) : "Date not available"}
                                   </h6>
                                 </div>
                                 {/* <div>
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
                                   </div> */}
                               </Card.Text>
                {/* <Button variant="danger" onClick={() => handleInvitation(invitation.event.eventId, invitation._id)}>
                  Plan and Celebrate
                </Button> */}
                <div style={{ display: "flex", gap: "8px" }}>
                    <Button
                      className="planbtn"
                      variant="danger"
                      onClick={() => handleInvitation(invitation.event.eventId, invitation._id)}
                    >
                     View Detail
                    </Button>
                    <div
                      className="heartimage"
                      style={{
                        backgroundColor: "#FF3366",
                        padding: "5px",
                        width: "40px",
                        height: "34px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderBottomRightRadius: "5px",
                        borderTopLeftRadius: "0px",
                        borderTopRightRadius: "5px",
                      }} onClick={handlefavourite}
                    >
                      <img
                        src={`${process.env.PUBLIC_URL}/img/Hearticon.svg`}
                   
                        style={{ width: "26px", height: "20px" }}
                      />
                    </div>
                  </div>
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
