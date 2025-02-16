import React, { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { FaEllipsisV, FaShareAlt, FaArrowRight } from "react-icons/fa";
import "./Eventdetails.css";
import Footer from "./Footer";
import Header from "./Header";
import Navbar from "./navbar";
import img1 from "../img/SplashScreen2img.png";
import WishlistForm from "../components/Wishlist/addWishlist"; // Import WishlistForm
import InviteModal from "./GuestInvite/GuestModal";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import img2 from "../img/ps5.webp"; // Assuming this is a placeholder for wishlist items
import EditEventModal from "./Events/eventModal";
import arrow from '../img/Group 33582.svg'

const EventDetails = () => {
  const [activeTab, setActiveTab] = useState("details");
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [showGuestModal, setGuestModal] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false); // Set it as an array since it will hold multiple wishlist items
  const [events, setEvents] = useState([]); // Array to hold multiple events

  const { eventId } = useParams(); // Get eventId from URL parameters

  // Fetch wishlist data from the server
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/getwishlist");
        const data = response.data; // axios directly gives you the JSON data
        setWishlist(data); // Update the state with fetched wishlist data
        console.log(data);
      } catch (error) {
        console.error("Error while fetching wishlist:", error);
      }
    };

    fetchWishlist();
  }, []);

  // Fetch event details using eventId
  useEffect(() => {
    if (!eventId) return; // Prevent request if eventId is not available
    const getEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/getevent/${eventId}`);
        const data = response.data;
        console.log(data);
        setEvents(data); // Store all events in the array
      } catch (error) {
        console.log("Error while fetching event:", error);
      }
    };

    getEvent();
  }, [eventId]); // Dependency array ensures this effect runs when eventId changes

  return (
    <>
      <section className="page-controls">
        <Header />
        <Navbar />
        <div>
          <div className="container mt-4">
            {/* Header Section */}
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="fw-bold">Event Details</h4>
              <div className="d-flex align-items-center">
                <FaShareAlt className="me-3 fs-5" />
                <Dropdown>
                  <Dropdown.Toggle as="button" className="btn btn-light border-0">
                    <FaEllipsisV />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item  onClick={() => setShowEditModal(true)}>Edit Event</Dropdown.Item>
                    <Dropdown.Item className="text-danger">Cancel Event</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>

            {/* Event Image */}
            <div className="mt-3">
              <img
                src={img1}
                className="img-fluid rounded"
                alt="Event"
                height="100px"
                width="100px"
              />
            </div>

            {/* Map over events to display them dynamically */}
            {events.map((event) => (
              <div key={event._id}>
                <h2 className="mt-3 fw-bold">  {event.fullName}-{event.eventType}</h2>

                {/* Tabs */}
                <ul className="nav nav-tabs mt-3">
                  {["details", "wishlist", "guests", "history"].map((tab) => (
                    <li className="nav-item" key={tab}>
                      <button
                        className={`nav-link ${activeTab === tab ? "active text-danger fw-bold" : ""}`}
                        onClick={() => setActiveTab(tab)}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    </li>
                  ))}
                </ul>

                {/* Tab Content */}
                <div className="tab-content p-3 mt-3 border rounded shadow-sm bg-white">
                  {activeTab === "details" && (
                    <>
                      <p className="d-flex align-items-center">
                        <span className="bg-danger text-white p-2 rounded me-2">📅</span>
                        {new Date(event.eventDate).toLocaleDateString() || "Date not available"} {/* Dynamically render event date */}
                      </p>
                      <p className="d-flex align-items-center">
                        <span className="bg-danger text-white p-2 rounded me-2">📍</span>
                        {event.location || "Location not available"} {/* Dynamically render event location */}
                      </p>
                      <div className="text-center mt-4">
                        <button className="btn btn-danger w-30 d-flex align-items-center justify-content-center">
                          SAVE <FaArrowRight className="ms-2" />
                        </button>
                      </div>
                    </>
                  )}

                  {activeTab === "wishlist" && (
                    <div>
                      <h5>🎁 Wishlist</h5>
                      <h2>Your Wishlist</h2>
                      <div>
                        <div className="wishlist-items">
                          {wishlist.length > 0 ? (
                            wishlist.map((item) => (
                              <div key={item._id}>
                              <div className="row">
                                  <div className="col-lg-4 col-md-6 col-sm-12">
                                    <div className="card" style={{ backgroundImage: `url(${img2})`, position: "relative", backgroundRepeat: "no-repeat", backgroundSize: "cover" }}>
                                      <div className="card-img-top" style={{height:"226px"}}  >
                                     <div className="d-flex justify-content-end m-2" > <p className="card-text status d-flex justify-content-center" style={{background:"cornsilk"}} >{item.status}</p></div>
                                      </div>
                                      <Link to={`/wishlistdetails/${item._id}`}>
                                        <div className="card-body cards11 " >
                                          <div className="d-flex justify-content-between " style={{paddingTop:"11px"}}>
                                            <h6 className="card-title " style={{color:"black"}}>{item.giftName}</h6>
                                            <p className="card-text " style={{color:"#ff3366",fontWeight:"600"}}>${item.price}</p>
                                        
                                          </div>
                                 <div className="d-flex justify-content-between">                                          <p className="card-text text-secondary m-1">{item.description}</p><img src={arrow} alt="svg"/></div>

                                        </div>
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p>No wishlist items found.</p>
                          )}
                        </div>
                      </div>
                      <div className="text-center mt-4">
                        <button
                          className="btn btn-danger w-30 d-flex align-items-center justify-content-center"
                          onClick={() => setShowWishlistModal(true)}
                        >
                          ADD WISHLIST <FaArrowRight className="ms-2" />
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === "guests" && (
                    <div>
                      <h5>👥 Guest List</h5>
                      <p>List of guests attending the event.</p>
                      <div className="text-center mt-4">
                        <button
                          className="btn btn-danger w-30 d-flex align-items-center justify-content-center"
                          onClick={() => setGuestModal(true)}
                        >
                          INVITE <FaArrowRight className="ms-2" />
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === "history" && (
                    <div>
                      <h5>📜 Event History</h5>
                      <p>Past updates and modifications of this event.</p>
                    </div>
                  )}
                </div>
              </div>
            ))}

          </div>

          {/* Wishlist Modal */}
          <WishlistForm show={showWishlistModal} setShow={setShowWishlistModal} setActiveTab={setActiveTab} />
          <InviteModal show={showGuestModal} setShow={setGuestModal} setActiveTab={setActiveTab} />
          <EditEventModal
  show={showEditModal}
  setShow={setShowEditModal}
  event={events} // Pass the specific event
  setEvent={setEvents} // Pass the state updater to modify the event list
/>

        </div>
        <Footer />
      </section>
    </>
  );
};

export default EventDetails;
