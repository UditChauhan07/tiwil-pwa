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
import Image2 from '../../img/userimage1.jpg'
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import arrow from '../../img/Group 33582.svg'
const EventDetails = () => {
  const [activeTab, setActiveTab] = useState("details");
  const [users, setUsers] = useState([]); // Array to store guests
  const [wishlistItems, setWishlistItems] = useState([]);
  const [events, setEvents] = useState({});
  const [invitationStatus, setInvitationStatus] = useState(null);
  const [Loading,setLoading]=useState(false)
  // const eventId = localStorage.getItem('eventId');
  const {eventId}=useParams();
  // Fetch wishlist data from the server
  const fetchWishlist = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/wishlist/event/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setWishlistItems(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  useEffect(() => {
    fetchWishlist();
}, [eventId]); // ✅ Re-fetch when eventId changes
console.log(wishlistItems)


  // Fetch event details using eventId
  useEffect(() => {
    const fetchEventDetail = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
  
      console.log("Fetching event with ID:", eventId); // Debug log
  
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/events/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (response.data.success) {
          setEvents([response.data.data]);
          localStorage.setItem('eventId1',eventId)
          // setDescription(response.data.data.aboutEvent || "");
          // setLocation(response.data.data.location || "");
        } else {
          console.error("Event fetch failed:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching event details:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
  
    if (eventId) {
      fetchEventDetail();
    }
  }, [eventId]);
  // Fetch guest list based on eventId
  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.data) {
          setUsers(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);
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
  const formatDateWithCurrentYear = (dateString) => {
    if (!dateString) return "Invalid Date";
    const eventDate = new Date(dateString);
    const currentYear = new Date().getFullYear();
    
    // Set event year to current year
    eventDate.setFullYear(currentYear);

    return eventDate.toLocaleDateString("en-GB"); // "DD/MM/YYYY"
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
          <img
            src={img1}
            className="img-fluid rounded"
            alt="Event"
            height="100px"
            width="100px"
          />
        </div>

        {events && events.length > 0 && (
          <div>
            <h2 className="mt-3 fw-bold">
              {events[0].name} 
            </h2>
            <ul className="nav nav-tabs mt-3">
              {[
                "details",
                invitationStatus === "accepted" ? "wishlist" : null,
                invitationStatus === "accepted" ? "guests" : null,
              ]
                .filter((tab) => tab !== null)
                .map((tab) => (
                  <li className="nav-item" key={tab}>
                    <button
                      className={`nav-link ${
                        activeTab === tab ? "active text-danger fw-bold" : ""
                      }`}
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
                    {formatDateWithCurrentYear(events[0].date) || "Date not available"}
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

              {/* You can add additional tabs like 'wishlist' and 'guests' here based on status */}
         
      

                  {activeTab === "wishlist" && (
                    <div>
                      <h5>🎁 Wishlist</h5>
                      <h2>Your Wishlist</h2>
                      <div>
                        <div className="wishlist-items">
                          {wishlistItems.length > 0 ? (
                            wishlistItems.map((item) => (
                              <div key={item._id}>
                                <div className="row">
                                  <div className="col-lg-4 col-md-6 col-sm-12">
                                    <div className="card" style={{ backgroundImage: `url(${img2})`, position: "relative", backgroundRepeat: "no-repeat", backgroundSize: "cover" }}>
                                      <div className="card-img-top" style={{height:"226px"}}  >
                                     <div className="d-flex justify-content-end m-2" > <p className="card-text status d-flex justify-content-center" style={{background:"cornsilk"}} >{item.status}</p></div>
                                      </div>
                                      <Link to={`/wishlistdetails/${item._id}`} >
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
                      {users.length > 0 ? (
                        <ul>
                          {users.map((g) => (
                           <li key={g._id}>{g.name}
                              
                                <p style={{ border: "1px solid #ff3366", maxWidth: "28%", padding: "3px", margin: "3px" }}>
                                  {g.fullName}
                                </p>
                              </li>
                            ))
                          }
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
