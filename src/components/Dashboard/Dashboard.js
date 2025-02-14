import React from "react";
import { FaHeart, FaCalendarAlt } from "react-icons/fa"; // For the heart and calendar icons
import Header from "../Header";
import Navbar from "../navbar";
import Footer from "../Footer";
import { useNavigate } from "react-router-dom";

// EventCard component
const EventCard = ({ eventName, eventDate, relation, daysLeft }) => {
  const navigate = useNavigate();

  const handlePlans = () => {
    // Navigate to the "plans" page when clicked
    navigate("/plans");
  };

  return (
    <div className="card mb-3" style={{ width: "100%", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
      <img
        src="https://via.placeholder.com/150"
        className="card-img-top"
        alt="Event"
        style={{ borderRadius: "10px 10px 0 0", height: "150px", objectFit: "cover" }}
      />
      <div className="card-body">
        <h5 className="card-title">{eventName}</h5>
        <p className="card-text">
          <FaCalendarAlt /> {eventDate}
        </p>
        <p className="text-muted">{relation}</p>
        <p className="badge bg-danger">{daysLeft} Days Left</p>
        <button className="btn btn-danger mt-3" onClick={handlePlans}>
          <FaHeart className="me-2" />
          Plan And Celebrate
        </button>
      </div>
    </div>
  );
};

// EventList component
const EventList = () => {
  const events = [
    { name: "Ayushi 5TH Birthday", date: "25 July, 24", relation: "Daughter", daysLeft: 10 },
    { name: "Anniversary Celebration", date: "10 Aug, 24", relation: "Family", daysLeft: 100 },
    { name: "John's Graduation", date: "1 Dec, 24", relation: "Friend", daysLeft: 210 },
  ];

  return (
    <>
      <Header />
      <Navbar />
      <div className="container mt-4">
        <div className="row justify-content-center">
          {events.map((event, index) => (
            <div key={index} className="col-md-4 mb-3">
              <EventCard
                eventName={event.name}
                eventDate={event.date}
                relation={event.relation}
                daysLeft={event.daysLeft}
              />
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EventList;
