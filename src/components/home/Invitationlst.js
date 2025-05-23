import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../home/Home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { TrendingUpTwoTone } from "@mui/icons-material";

function Invitationlst({ searchQuery }) {
  const [invitations, setInvitations] = useState([]);
  const [filteredInvitations, setFilteredInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterData, setFilterData] = useState({
    months: [],
    relations: [],
    eventTypes: [],
    favoritesOnly: false,
  });
  const [loadedImages, setLoadedImages] = useState({});

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
  const abc = localStorage.getItem("filters");
  // Initial load of filters from localStorage
  useEffect(() => {
    const savedFilters = loadFiltersFromLocalStorage();
    setFilterData(savedFilters);
  }, [filterData]);

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
          // console.log("Invitations data:", response.data.data); // Add this line
        }
      } catch (error) {
        console.error("Error fetching invitations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvitations();
  }, [token]);

  useEffect(() => {
    // Reapply filters whenever invitations or filter data changes
    applyFilters(invitations);
  }, [invitations, filterData,filteredInvitations]);

  // Reapply filters whenever searchQuery or filterData changes
  useEffect(() => {
    applyFilters(invitations);
  }, [searchQuery, filterData, invitations, abc]);


  useEffect(() => {
    applyFilters(invitations);
    // console.log("SSSSS--->",invitations)

  }, [invitations, filterData, searchQuery]); // Add all dependencies here

  const applyFilters = (invitationsList) => {
    let filtered = invitationsList;

    // Apply search query filter
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((invitation) => {
        const name = invitation.event?.name?.toLowerCase() || "";
        const type = invitation.event?.eventType?.toLowerCase() || "";
        return name.includes(lowerQuery) || type.includes(lowerQuery);
      });
    }

    // Apply month filter
    if (filterData.months.length > 0) {
      filtered = filtered.filter((invitation) =>
        filterData.months.includes(
          new Date(invitation.event.date).toLocaleString("en-us", {
            month: "long",
          })
        )
      );
      // console.log("After month filter:", filtered);
    }

    // Apply event type filter
    if (filterData.eventTypes.length > 0) {
      filtered = filtered.filter((invitation) =>
        filterData.eventTypes.includes(invitation.event.eventType)
      );
      // console.log("After event type filter:", filtered);
    }

    // Apply relation filter
    if (filterData.relations.length > 0) {
      filtered = filtered.filter((invitation) =>
        filterData.relations.includes(invitation.event.relation)
      );
      // console.log("After relation filter:", filtered);
    }

    // Apply favorites filter
    if (filterData.favoritesOnly) {
      filtered = filtered.filter(
        (invitation) => invitation.invitations[0]?.isFavourite === true
      );
      // console.log("After favorites filter:", filtered);
    }

    setFilteredInvitations(filtered);
    // console.log("Final filtered invitations:", filtered);
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
    // console.log("Filter data after apply:", filters); 
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
    // console.log("Filter data after clear:", defaultFilters); 
  };

  if (loading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}
      >
        <div
          className="spinner-border text-danger custom-spinner"
          role="status"
          style={{ width: "5rem", height: "5rem", color: "#ff3366" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const formatDateWithCurrentYear = (
    formattedDate,
    originalDate,
    alternateDate
  ) => {
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
  const calculateAgeAndBirthdayText = (eventDate, isCancelled) => {
    if (isCancelled) return "Cancelled"; // Show "Cancelled" if the event is cancelled

    if (!eventDate) return "N/A";

    const today = new Date();
    const targetDate = new Date(eventDate);
    const currentYear = today.getFullYear();

    // Set target year
    targetDate.setFullYear(currentYear);

    const birthDate = new Date(eventDate);
    const age = today.getFullYear() - birthDate.getFullYear();

    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today!";
    }

    if (diffDays < 0) {
      targetDate.setFullYear(currentYear + 1);
    }

    const nextDiffTime = targetDate - today;
    const nextDiffDays = Math.ceil(nextDiffTime / (1000 * 60 * 60 * 24));

    return `${nextDiffDays} Days Left`;
  };

  // const handlefavourite = async (eventId) => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     const response = await axios.put(
  //       `${process.env.REACT_APP_BASE_URL}/favourite/${eventId}`,
  //       {},
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );
  
  //     if (response.data.success) {
  //       // Update the invitations state
  //       setInvitations(prevInvitations => 
  //         prevInvitations.map(inv => {
  //           if (inv.event.eventId === eventId) {
  //             return {
  //               ...inv,
  //               invitations: inv.invitations.map(guest => ({
  //                 ...guest,
  //                 isFavourite: !guest.isFavourite,
  //               })),
  //             };
  //           }
  //           return inv;
  //         })
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error toggling favorite:", error);
  //   }
  // };
  const handlefavourite = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/favourite/${eventId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const data = response.data?.updatedInvitation?.invitations[0]?.isFavourite;
  
      // console.log(data, "res---->");
  
      if (data !== undefined) {
        // Log state before and after the update
        // console.log("Before Update", invitations);
  
        setInvitations(prevInvitations => {
          const updatedInvitations = prevInvitations.map(inv => {
            if (inv.event.eventId === eventId) {
              return {
                ...inv,
                invitations: inv.invitations.map(guest => ({
                  ...guest,
                  isFavourite: data, // Set the new value from the API response
                })),
              };
            }
            return inv;
          });
  
          // console.log("After Update", updatedInvitations);
          return updatedInvitations;
        });
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };
  
  
  return (
    <div className="containers1 mt-4">
      {/* Search Bar */}

      {/* Display Invitations */}
      {filteredInvitations.length > 0 ? (
        filteredInvitations.map((invitation, index) => (
          <div
            key={index}
            className="d-flex justify-content-center mb-3"
            style={{
              pointerEvents: invitation.event.isCanceled ? "none" : "auto",
              opacity: invitation.event.isCancelled ? 0.5 : 1,
              cursor: invitation.event.isCancelled ? "not-allowed" : "default",
            }}
          >
            <Card
              style={{
                width: "100%",
                minWidth: "310px",
                border: "0.5px solid rgb(229 229 229)",
                borderRadius: "10px",
                marginBottom:
                  index === filteredInvitations.length - 1 ? "80px" : "10px",
              }}
            >
              <div style={{ height: "190px" }}>
                <Card
                  variant="top"
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "192px",
                    borderBottom: "unset",
                    border:'none'
                  }}
                >
                 
                    <div style={{ position: "relative" }}>
  {!loadedImages[invitation.event.eventId] && (
    <div
      className="img-loader"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 2,
        marginTop:'50px'
      }}
    >
      <div className="spinner-border text-danger" role="status" style={{ width: "2rem", height: "2rem" }}>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  )}
  <img
    src={
  invitation.event?.newimage && invitation.event.newimage !== "null"
    ? `${process.env.REACT_APP_BASE_URL}/${invitation.event.newimage}`
    : invitation.event?.image && invitation.event.image !== "null"
    ? `${process.env.REACT_APP_BASE_URL}/${invitation.event.image}`
    : `${process.env.PUBLIC_URL}/img/eventdefault1.png`
}
    alt="Event"
    loading="lazy"
    onLoad={() =>
      setLoadedImages((prev) => ({ ...prev, [invitation.event.eventId]: true }))
    }
    className={`imgEvent ${loadedImages[invitation.event.eventId] ? "loaded" : ""}`}
    style={{ width: "100%", maxHeight: "190px", padding: "7px" }}
  />
</div>
                  <div
                    style={{
                      borderRadius: "0px 4px 0px 0px",
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      color: "white",
                      fontSize: "15px",
                      fontWeight: "bold",
                      backgroundColor: "#EE4266",
                      padding: "5px",
                      fontFamily: "Poppins",
                      fontWeight: "700",
                      letterSpacing: "0%",
                    }}
                  >
                    {calculateAgeAndBirthdayText(
                      invitation.event?.date ?? "Default Date",
                      invitation.event?.isCancelled
                    )}
                  </div>
                </Card>
              </div>
              <Card.Body style={{ padding: "7px" }}>
                <Card.Title
                  style={{
                    fontFamily: "Poppins",
                    fontWeight: "500",
                    fontSize: "14px",
                    leadingTrim: "Cap height",
                    lineHeight: "100%",
                    letterSpacing: "0%",
                    color: "#000000",
                    marginBottom: "5px",
                  }}
                >
                  {invitation.event?.name}
                  {""}&nbsp;
                  {invitation.event?.relation &&
                    invitation.event?.date &&
                    getUpcomingBirthdayNumber(invitation.event.date)}
                  {""}&nbsp;{invitation.event?.eventType}
                </Card.Title>
                <Card.Text
                  className="d-flex justify-content-between"
                  style={{ gap: "10px" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "5px",
                      marginBottom: "5px",
                    }}
                  >
                    <img
                      className="m-0.5"
                      src={`${process.env.PUBLIC_URL}/img/calender1.svg`}
                      height="17px"
                      alt="calendar"
                    />
                    <h6
                      style={{
                        fontSize: "13px",
                        fontFamily: "Poppins",
                        fontWeight: " 600",
                        leadingTrim: "Cap height",
                        lineHeight: "100%",
                        letterSpacing: "0%",
                        color: "#000000",
                        marginBottom: "0px",
                      }}
                    >
                      {invitation.event?.displayDate
                        ? formatDateWithCurrentYear(
                            invitation.event.displayDate,
                            invitation.event.date
                          )
                        : "Date not available"}
                    </h6>
                  </div>
                </Card.Text>
                <div style={{ display: "flex", gap: "8px" }}>
                  <Button
                    className="planbtn"
                    variant="danger"
                    onClick={() =>
                      !invitation.event.isCanceled &&
                      handleInvitation(invitation.event.eventId, invitation._id)
                    }
                    disabled={invitation.event.isCancelled}
                  >
                    View Detail
                  </Button>

                  <div
                    className="heartimage"
                    style={{
                      backgroundColor: invitation.invitations[0]?.isFavourite===true
                        ? "white"
                        : "#FF3366",
                      padding: "5px",
                      width: "40px",
                      height: "34px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderBottomRightRadius: "5px",
                      borderTopLeftRadius: "0px",
                      borderTopRightRadius: "5px",
                      border: invitation.invitations[0]?.isFavourite? "1px solid white" : "1px solid #EE4266",
                      cursor: invitation.event.isCancelled
                        ? "not-allowed"
                        : "pointer",
                      opacity: invitation.event.isCancelled ? 0.5 : 1,
                    }}
                    onClick={() => {
                      if (!invitation.event.isCancelled) {
                        handlefavourite(invitation.event.eventId); 
                      }
                    }}
                  >
      <FontAwesomeIcon
  icon={solidHeart}
  style={{
    color: invitation.invitations[0]?.isFavourite ? "#FF3366" : "white",
    fontSize: "26px",
  }}
/>
                  </div> 
                
             
                </div>
              </Card.Body>
            </Card>
          </div>
        ))
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
            fontSize: "x-large",
            fontWeight: "700",
            color: "rgba(238, 66, 102, 0.80)",
          }}
        >
          No invitations found
        </div>
      )}
    </div>
  );
}
  export default Invitationlst;