import React, { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";

import "../Eventdetails.css";
import Footer from "../Footer";
import { FaEllipsisV, FaShareAlt, FaArrowRight } from "react-icons/fa";
import Header from "../Header";
import Navbar from "../navbar";
import img1 from "../../img/SplashScreen2img.png"; // Event image
import img2 from "../../img/ps5.webp"; // Placeholder image for wishlist items
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import arrow from '../../img/Group 33582.svg'
const EventDetails = () => {
  const [activeTab, setActiveTab] = useState("details");
  const [guest, setGuest] = useState([]); // Array to store guests
  const [wishlist, setWishlist] = useState([]);
  const [events, setEvents] = useState({});
  const [invitationStatus, setInvitationStatus] = useState(null);
  const eventId = localStorage.getItem('eventId');
  
  // Fetch wishlist data from the server
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/getwishlist");
        const data = response.data;
        setWishlist(data);
        console.log(data);
      } catch (error) {
        console.error("Error while fetching wishlist:", error);
      }
    };

    fetchWishlist();
  }, []);

  // Fetch event details using eventId
  useEffect(() => {
    if (!eventId) return;
    const getEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/getevent/${eventId}`);
        const data = response.data;
        console.log(data);
        setEvents(data);
      } catch (error) {
        console.log("Error while fetching event:", error);
      }
    };

    getEvent();
  }, [eventId]);

  // Fetch guest list based on eventId
  const fetchGuests = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/auth/getGuest/${eventId}`);
      setGuest(response.data);
    } catch (error) {
      console.error("Error fetching guests:", error);
    }
  };
  
  // Fetch guests when eventId changes
  useEffect(() => {
    if (eventId) {
      fetchGuests();
    }
  }, [eventId]);
  
  // Handle invitation acceptance
  const handleAccept = () => {
    setInvitationStatus("accepted");
    Swal.fire({
      title: "Invitation Accepted!",
      text: "You've accepted the invitation.",
      icon: "success",
      confirmButtonText: "OK",
    });
  };

  // Handle invitation decline
  const handleDecline = () => {
    Swal.fire({
      title: 'Are You Sure?',
      text: "You will not be able to attend the event if you decline.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Decline',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        setInvitationStatus("declined");
        Swal.fire({
          title: 'Invitation Declined',
          text: "You've declined the invitation.",
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    });
  };

  return (
    <>
      <section className="page-controls">
        <Header />
        <Navbar />
        <div>
          <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="fw-bold">Event Details</h4>
              <div className="d-flex align-items-center">
                <FaShareAlt className="me-3 fs-5" />
              </div>
            </div>

            <div className="mt-3">
              <img src={img1} className="img-fluid rounded" alt="Event" height="100px" width="100px" />
            </div>

            {events && events.length > 0 && (
              <div>
                <h2 className="mt-3 fw-bold">
                  {events[0].fullName} - {events[0].eventType}
                </h2>
                <ul className="nav nav-tabs mt-3">
                  {["details", invitationStatus === "accepted" ? "wishlist" : null, invitationStatus === "accepted" ? "guests" : null]
                    .filter(tab => tab !== null)
                    .map((tab) => (
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

                <div className="tab-content p-3 mt-3 border rounded shadow-sm bg-white">
                  {activeTab === "details" && (
                    <>
                      <p className="d-flex align-items-center">
                        <span className="bg-danger text-white p-2 rounded me-2">📅</span>
                        {new Date(events[0].eventDate).toLocaleDateString() || "Date not available"}
                      </p>
                      <p className="d-flex align-items-center">
                        <span className="bg-danger text-white p-2 rounded me-2">📍</span>
                        {events[0].location || "Location not available"}
                      </p>
                      {invitationStatus === null ? (
                        <div className="text-center mt-4 d-flex gap-1">
                          <button
                            className="btn btn-danger w-30 d-flex align-items-center justify-content-center"
                            onClick={handleAccept}
                          >
                            ACCEPT
                          </button>
                          <button
                            className="btn w-30 d-flex align-items-center justify-content-center"
                            style={{ border: "1px solid" }}
                            onClick={handleDecline}
                          >
                            DECLINE
                          </button>
                        </div>
                      ) : invitationStatus === "accepted" ? (
                        <div className="text-center mt-4">
                          <button className="btn btn-danger w-30 d-flex align-items-center justify-content-center">
                            START CHAT
                          </button>
                        </div>
                      ) : (
                        <div className="text-center mt-4">
                          <button className="btn btn-secondary w-30 d-flex align-items-center justify-content-center">
                            INVITATION DECLINED
                          </button>
                        </div>
                      )}
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
                    </div>
                  )}

                  {activeTab === "guests" && (
                    <div>
                      <h5>👥 Guest List</h5>
                      {guest.length > 0 ? (
                        <ul>
                          {guest.map((g) => (
                            g.guests.map((guest) => (
                              <li key={guest._id}>
                                <p style={{ border: "1px solid #ff3366", maxWidth: "8%", padding: "3px", margin: "3px" }}>
                                  {guest.userId.fullName}
                                </p>
                              </li>
                            ))
                          ))}
                        </ul>
                      ) : (
                        <p>No guests yet.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <Footer />
        </div>
      </section>
    </>
  );
};

export default EventDetails;
