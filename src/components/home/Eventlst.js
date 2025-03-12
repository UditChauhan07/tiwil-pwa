import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Spinner, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../Home.css";

const Eventlst = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // State to store search query
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/events`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.success) {
          const fetchedEvents = response.data.data;

          // Sort events by date in ascending order
          const sortedEvents = fetchedEvents.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateA - dateB; // Ascending order
          });

          setEvents(sortedEvents);
          setFilteredEvents(sortedEvents);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [token]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = events.filter(
      (event) =>
        event.name.toLowerCase().includes(query) || event.date.includes(query)
    );
    setFilteredEvents(filtered);
  };

  const handlePlans = (eventId) => {
    if (!eventId) {
      console.error("Error: Event ID is missing");
      return;
    }
    navigate(`/plandetails/${eventId}`);
  };

  const formatDateWithCurrentYear = (dateString) => {
    if (!dateString) return "Invalid Date";
    
    const eventDate = new Date(dateString);
    const currentYear = new Date().getFullYear();
  
    // Set event year to current year
    eventDate.setFullYear(currentYear);
  
    // If the event (birthday) has already passed this year, use the next year
    const today = new Date();
    if (eventDate < today) {
      eventDate.setFullYear(currentYear + 1); // Set the event to next year if already passed
    }
  
    return eventDate.toLocaleDateString("en-GB"); // "DD/MM/YYYY"
  };
  
  const calculateDaysLeft = (eventDate) => {
    if (!eventDate) return "N/A";
    const today = new Date();
    let targetDate = new Date(eventDate);

    // Ensure the target date is set to the current year
    targetDate.setFullYear(today.getFullYear());

    // If the event has already passed this year, set it to next year
    if (targetDate < today) {
      targetDate.setFullYear(today.getFullYear() + 1);
    }

    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays >= 0 ? diffDays : "Event Passed";
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
    <>
      <div className="mt-4 mains121">
        {/* Search bar */}
        <Form.Control
          type="text"
          placeholder="Search for events..."
          value={searchQuery}
          onChange={handleSearch}
          style={{ marginBottom: "18px", width: "98%" }}
        />

        {/* Show loader if loading is true */}
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "50px",
            }}
          >
            <Spinner
              animation="border"
              role="status"
              style={{ width: "5rem", height: "5rem" }}
            >
              <span className="sr-only"></span>
            </Spinner>
          </div>
        ) : (
          filteredEvents.map((event, index) => (
            <div
              key={index}
              style={{ gap: "30px", display: "flex", justifyContent: "center" }}
            >
              <Card
                style={{
                  width: "100%",
                  minWidth: "310px",
                  border: "0.5px solid rgb(229 229 229)",
                  borderRadius: "10px",
                
                  marginBottom: index === filteredEvents.length - 1 ? "80px" : "10px",
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
                        event.image &&
                        event.image !== "null" &&
                        event.image !== `${process.env.REACT_APP_BASE_URL}/null`
                          ? `${process.env.REACT_APP_BASE_URL}/${event.image}`
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
                        event.date || event.eventDate
                      )}
                    </div>

                    {/* <small className="" style={{ color: "white", paddingRight: "24px", paddingTop: '5px', textAlign: 'end', color: "#ff3366", fontWeight: '600' }}>
                
                    </small> */}
                  </Card>
                </div>
                <Card.Body>
                  <div className="d-flex">
                    <Card.Title>
                      {event.name} &nbsp;
                      {/* Only render the birthday number if eventType is not "other" and the event date is available */}
                      {event.eventType !== ("other" || null) && (
                        <span>{getUpcomingBirthdayNumber(event.date)}</span>
                      )}
                      &nbsp;
                      {event.eventType}
                    </Card.Title>
                  </div>

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
                          marginRight: "50px",
                          marginBottom: "5px",
                          fontWeight: "600",
                          marginLeft: "5px",
                        }}
                      >
                        {formatDateWithCurrentYear(
                          event.date || event.eventDate
                        )}
                      </h6>
                    </div>
                    <div>
                      {event.relation &&
                      event.relation.toLowerCase() !== "parent anniversary" &&
                      event.relation.toLowerCase() !==
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
                          {event.relation}
                        </h4>
                      ) : null}
                    </div>
                  </Card.Text>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <Button
                      className="planbtn"
                      variant="danger"
                      onClick={() => handlePlans(event.eventId)}
                    >
                      Plan And Celebrate
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
                      }}
                    >
                      <img
                        src={`${process.env.PUBLIC_URL}/img/Hearticon.svg`}
                        alt="wishlist"
                        style={{ width: "26px", height: "20px" }}
                      />
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Eventlst;
