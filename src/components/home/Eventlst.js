import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button } from 'react-bootstrap';
import calender from '../../img/calender.svg';
import Hearticon from '../../img/Hearticon.svg';
import image1 from '../../img/image.png';
import { useNavigate } from 'react-router-dom';
import '../Home.css';

const Eventlst = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
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
        event.name.toLowerCase().includes(query) || 
        event.date.includes(query)
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
    const targetDate = new Date(eventDate);  // The person's birthday date
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
    <>
      {filteredEvents.map((event, index) => (
        <div key={index} style={{ gap: "30px", display: "flex", justifyContent: "center" }}>
          <Card style={{ width: "100%", minWidth: "310px", border: "0.5px solid rgb(229 229 229)", borderRadius: "10px" }}>
            <div style={{ height: "150px" }}>
              <Card variant="top"   style={{
            backgroundImage: `url(${
              event.image && event.image !== "null" && event.image !== `${process.env.REACT_APP_BASE_URL}/null`
                ? `${process.env.REACT_APP_BASE_URL}/${event.image}`
                : image1
            })`,
            position: "relative",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            height: "162px",
            width: "311px"
          }}
        
              >
              <small className="" style={{color:"white",paddingRight:"24px",paddingTop:'5px',textAlign:'end'}}>{calculateAgeAndBirthdayText(event.date)}</small>
              </Card>
            </div>
            <Card.Body>
              <div className='d-flex'>
                <Card.Title>{event.name}</Card.Title> 
              </div>
              <Card.Text className="d-flex justify-content-between" style={{ gap: "10px" }}>
                
                <div style={{display:'flex',justifyContent:'space-between'}}>
                  <img className="m-0.5" src={calender} height={"17px"} alt="calendar" />
                
                
                  <h6 style={{marginRight:'50px' ,marginBottom:'5px'}}>{formatDateWithCurrentYear(event.date)}</h6> <div >
                  </div>
                  
                  <div>
  {event.relation ? (
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

                  </div>
               
              </Card.Text>
              {/* <Card.Text>
                <small className="text-muted">{calculateAgeAndBirthdayText(event.date)}</small>
              </Card.Text> */}
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
