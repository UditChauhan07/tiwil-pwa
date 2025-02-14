import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button } from 'react-bootstrap'; // Assuming you're using react-bootstrap
import calender from '../../img/calender.svg'; // Path to the calendar icon image
import Hearticon from '../../img/Hearticon.svg'; // Path to the heart icon image
import image1 from '../../img/image.png'; // Path to the event image
import { useNavigate } from 'react-router-dom';
import '../Home.css';



const Eventlst = () => {
  const [events, setEvents] = useState([]);
const userId=localStorage.getItem('user.id')
const navigate=useNavigate();  


useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/events/${userId}`);
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
            formattedDate,
            daysLeft: `${daysLeft} days`,
          };
        });

        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [userId]);

  const handlePlans = (eventId) => {
    navigate(`/plandetails/${eventId}`); // Navigate with event ID
  };

  const handlefavourite = () => {
    // Handle favourite logic here
    console.log("Added to favourites");
  };

  return (
    <>
      {events.map((event, index) => (
        <div key={index} style={{ gap: "30px", display: "flex", justifyContent: "center", display: "block" }}>
          <Card style={{ width: "100%", minWidth: "310px", border: "0.5px solid rgb(229 229 229)", borderRadius: "10px" }}>
            <div style={{ height: "150px" }}>
              <Card.Img variant="top" src={image1} style={{ width: "100%", height: "100%", objectFit: "contain", marginTop:'5px'}} />
            </div>
            <Card.Body>
            <div className='d-flex'><Card.Title>{event.fullName}</Card.Title> &nbsp; <Card.Title>{event.eventType}</Card.Title>
            </div>
              <Card.Text className="d-flex justify-content-between" style={{ gap: "10px" }}>
                <div className="d-flex">
                  <img className="m-0.5" src={calender} height={"17px"} alt="calendar" />
                  <h6>{event.formattedDate}</h6>
                </div>
                <div className="eventperson">
                  {/* You can add more event details here */}
                </div>
              </Card.Text>
              <Card.Text>
                <small className="text-muted">Days Left: {event.daysLeft}</small>
              </Card.Text>
              <div style={{ display: "flex", gap: "8px" }}>
                <Button
                  variant="danger"
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
                  onClick={() => handlePlans(event._id)}
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
                    borderBottomRightRadius: '5px',
                    borderTopLeftRadius: '0px',
                    borderTopRightRadius: '5px',
                  }}
                >
                  <img
                    src={Hearticon}
                    alt="wishlist"
                    style={{ width: "26px", height: "20px" }}
                    onClick={handlefavourite}
                  />
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      ))}
    </>
  );
};

export default Eventlst;
