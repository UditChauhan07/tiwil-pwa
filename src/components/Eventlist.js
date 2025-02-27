import React from "react";
import Footer from "./Footer";
import Navbar from "./navbar";

import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import './Eventlist.css';
import { FaSearch } from "react-icons/fa";
import { BsFilter } from "react-icons/bs";  // Import filter icon
import { MdClear } from "react-icons/md"; // Import clear icon for reset

const EventList = () => {
  const navigate = useNavigate();
 const userId=localStorage.getItem('user.id')
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Search by name
  const [monthFilter, setMonthFilter] = useState(""); // Filter by month
  const [dateFilter, setDateFilter] = useState(""); // Filter by specific day
  const [eventTypeFilter, setEventTypeFilter] = useState(""); // Filter by event type
  const [showFilters, setShowFilters] = useState(false); // To toggle filter visibility
  const filterRef = useRef(null); // Reference to filter panel

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/events/${userId}`); // Adjust API URL as needed
  const eventId=response.data._id;
        const formattedEvents = response.data.map((event) => {
          const today = new Date();
          const eventDate = new Date(event.eventDate);
  
          // Extract day and month from the event
          const eventDay = eventDate.getDate();
          const eventMonth = eventDate.getMonth();
  
          // Set event date for the current year
          let nextEventDate = new Date(today.getFullYear(), eventMonth, eventDay);
  
          // If the event has already passed this year, calculate for the next year
          if (nextEventDate < today) {
            nextEventDate = new Date(today.getFullYear() + 1, eventMonth, eventDay);
          }
  
          // Format the event date to "12 March"
          const formattedDate = nextEventDate.toLocaleDateString("en-US", {
            day: "2-digit",
            month: "long",
          });
  
          // Calculate days left
          const timeDifference = nextEventDate.getTime() - today.getTime();
          const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Convert ms to days
  
          return {
            ...event,
            formattedDate: formattedDate, // e.g., "12 March"
            daysLeft: `${daysLeft} `,
          };
        });
  
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
  
    fetchEvents();  }, [userId]);

  const handlePlans = () => {
    navigate('/plans');
  };

  // Filter events based on search term, month, date, and event type
  const filteredEvents = events.filter((event) => {
    return (
      (searchTerm ? event.fullName && event.fullName.toLowerCase().includes(searchTerm.toLowerCase()) : true) &&
      (monthFilter ? event.eventMonth === parseInt(monthFilter) : true) &&
      (dateFilter ? event.eventDay === parseInt(dateFilter) : true) &&
      (eventTypeFilter ? event.eventType === eventTypeFilter : true)
    );
  });

  // Generate months for dropdown
  const months = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ];

  // Generate days for dropdown
  const days = Array.from({ length: 31 }, (_, index) => index + 1);

  // Generate event types (this would come from your API or a predefined list)
  const eventTypes = ["Conference", "Workshop", "Seminar", "Meetup", "Celebration"];

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setMonthFilter("");
    setDateFilter("");
    setEventTypeFilter("");
    setShowFilters(false);
  };

  // Close filter if clicked outside
  const handleClickOutside = (event) => {
    if (filterRef.current && !filterRef.current.contains(event.target)) {
      setShowFilters(false);
    }
  };

  useEffect(() => {
    // Add event listener to close the filter panel when clicked outside
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <section className="page-controls">
        <Header />
        <Navbar />
        <div className="container-fluid py-4">
          <div className="container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 className="mb-4" style={{ color: "#FF3366" }}>My Events</h2>
              <div className="SearLast" style={{ display: "flex", alignItems: "center" }}>
                {/* Search Bar */}
                <div className="d-none d-md-flex searchbarw">
                  <input
                    type="text"
                    placeholder="Search"
                    className="form-control"
                    style={{ width: "100%" }}
                    value={searchTerm} // Bind search input value to state
                    onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm as user types
                  />
                  <FaSearch className="me-3 text-muted" style={{ fontSize: "1.5rem", fill: "#FF3366" }} />
                </div>

                {/* Filters Button */}
                <button
                  className="btn btn-light ms-3"
                  style={{ color: "#FF3366", border: "1px solid #FF3366", borderRadius: "20px" }}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <BsFilter /> Filters
                </button>

                {/* Clear Filters Button */}
                {(searchTerm || monthFilter || dateFilter || eventTypeFilter) && (
                  <button
                    className="btn btn-light ms-3"
                    style={{ color: "#FF3366", border: "1px solid #FF3366", borderRadius: "20px" }}
                    onClick={clearFilters}
                  >
                    <MdClear /> Clear Filters
                  </button>
                )}
              </div>
            </div>

            {/* Floating Filters Section */}
            {showFilters && (
              <div ref={filterRef} className="floating-filters" style={{
                position: "fixed",
                 
                right: "100px",
                backgroundColor: "#fff",
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                padding: "20px",
                zIndex: 1000,
                transition: "transform 0.3s ease-in-out",
                transform: showFilters ? "translateX(0)" : "translateX(300px)",
              }}>
                <h5 style={{ color: "#FF3366" }}>Filters</h5>
                <div className="filter-item mb-3">
                  <label style={{ fontWeight: "bold", color: "#FF3366" }}>Month</label>
                  <select
                    onChange={(e) => setMonthFilter(e.target.value)}
                    value={monthFilter}
                    className="form-select"
                  >
                    <option value="">All Months</option>
                    {months.map((month, index) => (
                      <option key={index} value={index}>{month}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-item mb-3">
                  <label style={{ fontWeight: "bold", color: "#FF3366" }}>Day</label>
                  <select
                    onChange={(e) => setDateFilter(e.target.value)}
                    value={dateFilter}
                    className="form-select"
                  >
                    <option value="">All Days</option>
                    {days.map((day) => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-item mb-3">
                  <label style={{ fontWeight: "bold", color: "#FF3366" }}>Event Type</label>
                  <select
                    onChange={(e) => setEventTypeFilter(e.target.value)}
                    value={eventTypeFilter}
                    className="form-select"
                  >
                    <option value="">All Event Types</option>
                    {eventTypes.map((type, index) => (
                      <option key={index} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Render filtered events */}
            {filteredEvents.map((event, index) => (
              <div
                key={index}
                className="card mb-3"
                style={{
                  borderRadius: "10px",
                  border: "1px solid #FF3366",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="row g-0">
                  <div className="col-md-4">
                    <div>
                      <img
                        src={`${process.env.PUBLIC_URL}/img/SplashScreen3.png`}
                        className="rounded-start imgmain"
                        alt="event"
                        height={"10px"}
                      />
                      <h3 style={{ display: "flex", alignItems: "center", marginLeft: "20px" }}>{event.fullName}</h3>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className="card-title">{event.name}</h5>
                      <p className="card-text">
                        <small className="text-muted">Date: {event.formattedDate}</small>
                      </p>
                      <p className="card-text">
                        <small className="text-muted">
                          {event.daysLeft} Days Left
                        </small>
                      </p>
                      <p className="card-text" style={{ fontWeight: "bold" }}>
                        Category: {event.eventType}
                      </p>
                      <button className="btn btn-danger rounded-pill" style={{ backgroundColor: "#FF3366" }} onClick={handlePlans}>
                        Plan And Celebrate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      
      </section>
    </>
  );
};

export default EventList;
