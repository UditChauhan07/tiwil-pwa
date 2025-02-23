import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../Home.css';

const Eventlst = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/events`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          const fetchedEvents = response.data.data;

          // Sort events by date in ascending order
          const sortedEvents = fetchedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

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

    const filtered = events.filter((event) =>
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

  return (
    <>
      {/* Search Bar */}
      <div className="search-container" style={{ marginBottom: '15px', textAlign: 'center' }}>
        <Form.Control
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={handleSearch}
          style={{ maxWidth: "400px", margin: "auto", padding: "10px" }}
        />
      </div>

      {/* Event List */}
      {filteredEvents.map((event, index) => (
        <div key={index} style={{ gap: "30px", display: "flex", justifyContent: "center" }}>
          <Card style={{ width: "100%", minWidth: "310px", border: "0.5px solid rgb(229 229 229)", borderRadius: "10px" }}>
            <div style={{ height: "150px" }}>
              <Card variant="top" style={{
                backgroundImage: `url(${
                  event.image && event.image !== "null" && event.image !== `${process.env.REACT_APP_BASE_URL}/null`
                    ? `${process.env.REACT_APP_BASE_URL}/${event.image}`
                    : `${process.env.PUBLIC_URL}/img/image.png`
                })`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                height: "162px",
                width: "311px"
              }}>
              </Card>
            </div>
            <Card.Body>
              <Card.Title>{event.name}</Card.Title> 
              <Card.Text className="d-flex justify-content-between" style={{ gap: "10px" }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <img src={`${process.env.PUBLIC_URL}/img/calender.svg`} height={"17px"} alt="calendar" />
                  <h6 style={{ marginRight: '50px', marginBottom: '5px' }}>{event.date}</h6>
                </div>
              </Card.Text>
              <div style={{ display: "flex", gap: "8px" }}>
                <Button
                  style={{
                    height: "34px",
                    backgroundColor: "#FF3366",
                    width: "100%",
                    borderBottomRightRadius: '0px',
                    borderTopLeftRadius: '5px',
                    borderTopRightRadius: '0px',
                    borderBottomLeftRadius: "5px",
                    padding: "0px"
                  }}
                  onClick={() => handlePlans(event.eventId)}
                >
                  Plan And Celebrate
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      ))}
    </>
  );
};

export default Eventlst;
