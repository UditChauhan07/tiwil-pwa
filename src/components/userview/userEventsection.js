import React, { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import "../Eventdetails.css";
import Footer from "../Footer";
import { FaEllipsisV, FaShareAlt, FaArrowRight } from "react-icons/fa";
import Header from "../Header";
import Navbar from "../navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";

const EventDetails = () => {
  const [activeTab, setActiveTab] = useState("details");
  const [users, setUsers] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [events, setEvents] = useState({});
  const [invitationStatus, setInvitationStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { invitationId } = location.state || {};

  useEffect(() => {
    if (invitationId) {
      fetchInvitationStatus();
    }
  }, [invitationId]);

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
  }, [eventId]);

  // Fetch event details using eventId
  useEffect(() => {
    const fetchEventDetail = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/events/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setEvents(response.data.data); // Set data directly (not in array)
          localStorage.setItem('eventId1', eventId);
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
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/guests/${eventId}`, {
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

  // Fetch invitation status from the backend
  const fetchInvitationStatus = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/guests-status/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setInvitationStatus(response.data.data.status);
      } else {
        console.error("Failed to fetch invitation status:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching invitation status:", error);
    }
  };

  // Handle Accept Invitation
  const handleAccept = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/invitations/${invitationId}`,
        { status: "Accepted" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setInvitationStatus("Accepted");
        Swal.fire("Success", "You have accepted the invitation!", "success");
      }
    } catch (error) {
      Swal.fire("Error!", error.response?.data?.message || "Something went wrong", "error");
    }
  };

  // Handle Decline Invitation
  const handleDecline = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once declined, you won't be able to change this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff4d6d",
      cancelButtonColor: "#999",
      confirmButtonText: "Yes, Decline",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem('token');
        try {
          const response = await axios.put(
            `${process.env.REACT_APP_BASE_URL}/invitations/${invitationId}`,
            { status: "Declined" },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (response.data.success) {
            setInvitationStatus("Declined");
            Swal.fire("Declined", "You have declined the invitation.", "success");
          }
        } catch (error) {
          Swal.fire("Error!", error.response?.data?.message || "Something went wrong", "error");
        }
      }
    });
  };

  const formatDateWithCurrentYear = (dateString) => {
    if (!dateString) return "Invalid Date";
    const eventDate = new Date(dateString);
    const currentYear = new Date().getFullYear();
    eventDate.setFullYear(currentYear);

    return eventDate.toLocaleDateString("en-GB");
  };

  const handleStartChat = async () => {
    const token = localStorage.getItem("token");
    try {

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/chats/group`,
        { eventId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.data.success) {
        // Navigate to the existing or newly created chat
        navigate(`/chats/${response.data.chat.groupId}`);
      }
    } catch (error) {
      console.error("❌ Error starting chat:", error.response?.data || error.message);
    }
  };

  return (
    <>
      <section className="page-controls">
        <Header />
        <Navbar />
        <div className="container mt-4">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="fw-bold">Event Details</h4>
            <div className="d-flex align-items-center">
              <FaShareAlt className="me-3 fs-5" />
            </div>
          </div>

          <div className="mt-3">
            <img
              src={`${process.env.PUBLIC_URL}/img/SplashScreen2img.png`}
              className="img-fluid rounded"
              alt="Event"
              height="100px"
              width="100px"
            />
          </div>

          {events && (
            <div>
              <h2 className="mt-3 fw-bold">{events.name}</h2>
              <ul className="nav nav-tabs mt-3">
                {[
                  "details",
                  invitationStatus === "Accepted" ? "wishlist" : null,
                  invitationStatus === "Accepted" ? "guests" : null,
                ]
                  .filter((tab) => tab !== null)
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
                      {formatDateWithCurrentYear(events.date) || "Date not available"}
                    </p>
                    <p className="d-flex align-items-center">
                      <span className="bg-danger text-white p-2 rounded me-2">📍</span>
                      {events.location || "Location not available"}
                    </p>
                    {invitationStatus === "Pending" || "Invited" ? (
                      <div className="text-center mt-4 d-flex gap-1">
                        <button className="btn btn-danger w-30" onClick={handleAccept}>ACCEPT</button>
                        <button className="btn w-30" style={{ border: "1px solid" }} onClick={handleDecline}>DECLINE</button>
                      </div>
                    ) : invitationStatus === "Accepted" ? (
                      <div className="text-center mt-4">
                        <button className="btn btn-danger w-30" onClick={handleStartChat}>START CHAT</button>
                      </div>
                    ) : null}
                  </>
                )}

                {activeTab === "wishlist" && (
                  <div>
                    <div  style={{display:"flex",justifyContent:"space-between"}}>
                      <h5>🎁 Wishlist</h5>
                      <h5 >Show All</h5>
                    </div>
                    <div className="wishlist-items">
                      {wishlistItems.length > 0 ? (
                        wishlistItems.map((item) => (
                          <div key={item._id}>
                            <div className="row">
                              <div className="col-lg-4 col-md-6 col-sm-12" style={{marginBottom:'10px'}}>
                                <div className="card" style={{ backgroundImage: `url(${process.env.REACT_APP_BASE_URL}/${item.imageUrl})`, position: "relative", backgroundRepeat: "no-repeat", backgroundSize: "cover" }}>
                                  <div className="card-img-top" style={{height:"226px"}}  >
                                    <div className="d-flex justify-content-end m-2">
                                      <p className="card-text status d-flex justify-content-center" style={{background:"cornsilk"}}>{item.status}</p>
                                    </div>
                                  </div>
                                  <Link to={`/wishlistdetails/${item._id}`} >
                                    <div className="card-body cards11">
                                      <div className="d-flex justify-content-between " style={{paddingTop:"11px"}}>
                                        <h6 className="card-title " style={{color:"black"}}>{item.giftName}</h6>
                                        <p className="card-text " style={{color:"#ff3366",fontWeight:"600"}}>${item.price}</p>
                                      </div>
                                      <div className="d-flex justify-content-between">
                                        <p className="card-text text-secondary m-1">{item.description}</p>
                                        <img src={`${process.env.PUBLIC_URL}/img/Group 33582.svg`} alt="svg"/>
                                      </div>
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
                )}

                {activeTab === "guests" && (
                  <div>
                    <h5>👥 Guest List</h5>
                    {users.length > 0 ? (
                      <ul>
                        {users.map((g) => (
                          <li key={g._id}>{g.name}
                          </li>
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
      </section>
      <Footer />
    </>
  );
};

export default EventDetails;
