import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';

import "../home/Home.css";


const Eventlst = ({ searchQuery }) => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterData, setFilterData] = useState({
    months: [],
    relations: [],
    eventTypes: [],
    favoritesOnly: false,
  });
  const [favoriteStatus, setFavoriteStatus] = useState(false); 
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const abc = localStorage.getItem("filters");

  const loadFiltersFromLocalStorage = () => {
    const savedFilters = localStorage.getItem("filters");
    if (savedFilters) return JSON.parse(savedFilters);
    return { months: [], relations: [], eventTypes: [], favoritesOnly: false };
  };

  useEffect(() => {
    const savedFilters = loadFiltersFromLocalStorage();
    setFilterData(savedFilters);
  }, [abc]);

  useEffect(() => {
    let isMounted = true;

    const fetchEvents = async (isSilent = false) => {
      if (!token || !isMounted) return;
      if (!isSilent) setLoading(true);

      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/events`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          if (isMounted) {
            setEvents(response.data.data);
            applyFilters(response.data.data);
          }
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        if (isMounted && !isSilent) setLoading(false);
      }
    };

    fetchEvents(false);
    const interval = setInterval(() => fetchEvents(true), 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [token]);

  useEffect(() => {
    applyFilters(events);
  }, [searchQuery, filterData, events, abc]);
  
  const isSameOrAfterToday = (eventDate, today) => {
    const event = new Date(eventDate);
    return (
      event.getFullYear() > today.getFullYear() ||
      (event.getFullYear() === today.getFullYear() &&
        (event.getMonth() > today.getMonth() ||
          (event.getMonth() === today.getMonth() && event.getDate() >= today.getDate())))
    );
  };
  
  const normalizeEventDateForSorting = (eventDate) => {
    const today = new Date();
    const event = new Date(eventDate);
    if (isNaN(event.getTime())) return null;
 
    event.setFullYear(today.getFullYear());
  
    if (
      event.getMonth() < today.getMonth() ||
      (event.getMonth() === today.getMonth() && event.getDate() < today.getDate() )
    ) {
      event.setFullYear(today.getFullYear() + 1);
    }
    return event;
  };

  // const normalizeEventDateForSorting = (eventDate) => {
  //   const today = new Date();
  //   const event = new Date(eventDate);
  //   if (isNaN(event.getTime())) return null;
  
  //   // Force event to current year
  //   event.setFullYear(today.getFullYear());
  
  //   const isSameDay =
  //     event.getDate() === today.getDate() &&
  //     event.getMonth() === today.getMonth() &&
  //     event.getFullYear() === today.getFullYear();
  
  //   const isBeforeToday =
  //     event.getMonth() < today.getMonth() ||
  //     (event.getMonth() === today.getMonth() && event.getDate() < today.getDate());
  
  //   // 🔁 If event is before today (but not today), push to next year
  //   if (!isSameDay && isBeforeToday) {
  //     event.setFullYear(today.getFullYear() + 1);
  //   }
  
  //   return event;
  // };
  
  const applyFilters = (eventsList) => {
    let filtered = [...eventsList];

    // Apply search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((event) =>
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.date.includes(searchQuery)
      );
    }

    // Apply basic filters
    if (filterData.months.length > 0) {
      filtered = filtered.filter((event) =>
        filterData.months.includes(new Date(event.date).toLocaleString("en-us", { month: "long" }))
      );
    }
    if (filterData.eventTypes.length > 0) {
      filtered = filtered.filter((event) => filterData.eventTypes.includes(event.eventType));
    }
    if (filterData.relations.length > 0) {
      filtered = filtered.filter((event) => filterData.relations.includes(event.relation));
    }
    if (filterData.favoritesOnly) {
      filtered = filtered.filter((event) => event.isfavourite === true);
    }

    // Filter only events from today onward (after adjusting year logic)
    const today = new Date();
    filtered = filtered
      .map((event) => ({
        ...event,
        normalizedDate: normalizeEventDateForSorting(event.date || event.displayDate),
      }))
      .filter((event) => event.normalizedDate && isSameOrAfterToday(event.normalizedDate, today))

      .sort((a, b) => a.normalizedDate - b.normalizedDate);

    setFilteredEvents(filtered);
  };


  const handleApplyFilters = (filters) => {
    setFilterData(filters);
    localStorage.setItem("filters", JSON.stringify(filters)); // Save filters to localStorage
    applyFilters(events); // Apply filters immediately
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
    applyFilters(events); // Fetch all events again after clearing filters
  };

  const handlePlans = (eventId) => {
    if (!eventId) {
      console.error("Error: Event ID is missing");
      return;
    }
    navigate(`/plandetails/${eventId}`);
  };

  const formatDateWithCurrentYear = (formattedDate, originalDate, alternateDate) => {
    const eventDate = new Date(originalDate || alternateDate);
    if (isNaN(eventDate.getTime())) return "Invalid Date";
  
    const today = new Date();
    const currentYear = today.getFullYear();
  
    // Set the year to current year first
    eventDate.setFullYear(currentYear);
  
    // Remove time part from both dates for accurate comparison
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const eventOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
  
    // If event already passed (excluding today), shift to next year
    if (eventOnly < todayOnly) {
      eventDate.setFullYear(currentYear + 1);
    }
  
    return eventDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };
  

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
        {/* <Spinner animation="border" role="status" style={{ width: "5rem", height: "5rem" }} /> */}
        <div class="spinner-border text-danger custom-spinner" role="status" style={{width: '5rem', height: '5rem',color:'#ff3366'}}>
  <span class="visually-hidden">Loading...</span>
</div>
      </div>
    );
  }

  const handlefavourite = async (eventId) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/favouriteevent/${eventId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.data.success) {
        // Update local state
        const updatedEvents = events.map((event) =>
          event.eventId === eventId
            ? { ...event, isfavourite: !event.isfavourite }
            : event
        );
        setEvents(updatedEvents);
        applyFilters(updatedEvents); // Reapply filters in case favoritesOnly is active
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };
  
  const calculateAgeAndBirthdayText = (eventDate, isCancelled) => {
    if (isCancelled) return "Cancelled"; // <-- Add this check
    if (!eventDate) return "N/A";
  
    const today = new Date();
    const targetDate = new Date(eventDate);
    const currentYear = today.getFullYear();
    targetDate.setFullYear(currentYear);
  
    const birthDate = new Date(eventDate);
    const age = today.getFullYear() - birthDate.getFullYear();
  
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
    if (diffDays === 0) return "Today!";
    if (diffDays < 0) targetDate.setFullYear(currentYear + 1);
  
    const nextDiffTime = targetDate - today;
    const nextDiffDays = Math.ceil(nextDiffTime / (1000 * 60 * 60 * 24));
    return `${nextDiffDays} Days Left`;
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
  return (
    <div className="mt-4 mainns121">
      {/* <div>
        <button onClick={handleClearFilters}>Clear All Filters</button>
      </div> */}

      {filteredEvents.length > 0 ? (
        filteredEvents.map((event, index) => (
          <div
  key={index}
  style={{
    gap: "30px",
    display: "flex",
    justifyContent: "center",
    opacity: event.isCanceled ? 0.4 : 1,
    pointerEvents: event.isCancelled ? "none" : "auto",
    cursor: event.isCancelled ? "not-allowed" : "default",
  }}
>


            <Card style={{ width: "100%", minWidth: "310px", border: "0.5px solid rgb(229 229 229)", borderRadius: "10px", marginBottom: index === filteredEvents.length - 1 ? "80px" : "10px" }}>
              <div style={{ maxHeight: "320px",padding:'3px' }}>
                <Card variant="top" style={{ position: "relative", width: "100%" ,border:'none'}}>
                  <img
                    src={event.newimage && event.newimage !== "null" ? `${process.env.REACT_APP_BASE_URL}/${event.newimage}` : event.image && event.image !== "null" ? `${process.env.REACT_APP_BASE_URL}/${event.image}` : `${process.env.PUBLIC_URL}/img/eventdefault1.png`}
                    alt="Event" loading="lazy"   
                    style={{ width: '100%', maxHeight: '190px' ,padding:'5px'}}
                    className="imgEvent"
                  />
                <div
  style={{
    borderRadius: "2px 5px 2px 10px",
    position: "absolute",
    top: "5px",
    right: "5px",
    color: "white",

    fontWeight: "bold",
    backgroundColor: "#EE4266",
    padding: "5px",
    fontFamily: 'Poppins',
fontWeight: '700',
fontSize: '15px',

letterSpacing: '0%',

  }}
>
  {calculateAgeAndBirthdayText(event.displayDate, event.isCancelled)}
</div>

                </Card>
             
              <Card.Body style={{    paddingTop: '3px',
    paddingLeft: '6px',
    paddingBottom: '12px',
    paddingRight: '6px',}}>
                <div className="d-flex">
                <Card.Title style={{fontFamily: 'Poppins',
fontWeight: '500',
fontSize: '14px',
leadingTrim: 'Cap height',
lineHeight: '100%',
letterSpacing: '0%',
color:'#252525',
marginBottom:'0px',
                }}>
  {event.name}{" "}
  {event.relation &&
    
    event.date &&
    getUpcomingBirthdayNumber(event.date)
  }{" "}
  {event.eventType}
</Card.Title>

                </div>
                <Card.Text className="d-flex justify-content-between" style={{ gap: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" ,alignItems: "center" }}>
                    <img className="m-0.5" src={`${process.env.PUBLIC_URL}/img/calender.svg`} height="17px" alt="calendar" />
                    <h6 style={{ marginRight: "3px", marginBottom: "5px", fontWeight: "600", marginLeft: "5px",fontSize:'13px' ,fontFamily: 'Poppins',
fontWeight:' 600',

leadingTrim: 'Cap height',
lineHeight: '100%',
letterSpacing: '0%',
color:'#000000',
marginBottom:'0px'
}}>
                      {event.displayDate ? formatDateWithCurrentYear(event.displayDate, event.date) : "Date not available"}
                    </h6>
                  </div>
                  <div>
  <h4
    style={{
      background: "white",
      color: "#ff3366",
      border: "1px solid #EE4266",
      paddingLeft: "10px",
      padding: "3px 27px 3px 26px",
      borderRadius: "5px",
      fontFamily: 'Poppins',
fontWeight: '500',
fontSize: '12px',
leadingTrim: 'Cap height',

letterSpacing: '0%',
verticalAlign: 'middle'

    }}
  >
    {event.relation &&
    event.relation.toLowerCase() !== "parent anniversary" &&
    event.relation.toLowerCase() !== "marriage anniversary"
      ? event.relation
      : "Event"}
  </h4>
</div>

                </Card.Text>
                
                  <div style={{ display: "flex", gap: "8px",
height: '34px',



 }}>
                  <button
  className="planbtn"

  onClick={() => !event.isCancelled && handlePlans(event.eventId)}
  disabled={event.isCancelled} // Disables the button
>
  Plan And Celebrate
</button>

                    <div
  className="heartimage"
  style={{
    backgroundColor: event.isfavourite ? "white" : "#FF3366",
 
    padding: "5px",
    width: "40px",
    height: "34px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderBottomRightRadius: "5px",
    borderTopLeftRadius: "0px",
    borderTopRightRadius: "5px",
    cursor: "pointer",
    border: event.isfavourite ? "1px solid white" : "1px solid #EE4266",
    cursor: event.isCancelled ? "not-allowed" : "pointer",
    opacity: event.isCancelled ? 0.5 : 1, // Optional: add border for visual clarity on white bg
  }}
 
  onClick={() =>
    !event.isCancelled &&
    handlefavourite(event.eventId)
  }
>
  <FontAwesomeIcon
    icon={solidHeart }
    style={{
      color: event.isfavourite ? "#EE4266" : "white", // filled heart red, outline white
      fontSize:event.isfavourite ? "26px" : "26px"
    }}
  />



                    </div>
                  </div>
              </Card.Body>
              </div>
            </Card>
          </div>
        ))
      ) : (
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'50vh' ,fontSize:'x-large',fontWeight:'700',color:'#EE4266'}}>No events found</div>
      )}
    </div>
  );
};

export default Eventlst;
