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
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const { eventId, phoneNumber } = useParams();
  const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchInvitationStatus = async () => {
  //     setLoading(true);
  //     try {
  //       let response;
  //       if (eventId && phoneNumber) {
  //         response = await axios.get(`${process.env.REACT_APP_BASE_URL}/updatestatus/${eventId}/${phoneNumber}`);
  //       } else if (eventId) {
  //         response = await axios.get(`${process.env.REACT_APP_BASE_URL}/updatestatus/${eventId}`);
  //       }

  //       if (response?.data?.success) {
  //         setInvitationStatus(response.data.data.status);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching invitation status:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchInvitationStatus();
  // }, [eventId, phoneNumber]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/guests/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInvitationStatus(response.data.data || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [eventId]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/wishlist/event/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlistItems(response.data.data || []);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    fetchWishlist();
  }, [eventId]);

  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/events/${eventId}`);
        if (response.data.success) {
          setEvents(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetail();
  }, [eventId]);

  const formatDateWithCurrentYear = (dateString) => {
    if (!dateString) return "Invalid Date";
    const eventDate = new Date(dateString);
    const currentYear = new Date().getFullYear();
    eventDate.setFullYear(currentYear);
    return eventDate.toLocaleDateString("en-GB");
  };

  const handleAccept = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      Swal.fire({
        title: 'Error',
        text: 'Please sign in to accept the invitation.',
        icon: 'error',
      });
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/updatestatus/${eventId}`,
        {
          status: "Accepted",
          phoneNumber: phoneNumber || undefined,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        setInvitationStatus("Accepted");
        Swal.fire("Success", "You have accepted the invitation!", "success");
      }
    } catch (error) {
      Swal.fire("Error!", error.response?.data?.message || "Something went wrong", "error");
    }
  };

  const handleDecline = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      Swal.fire({
        title: 'Error',
        text: 'Please sign in to decline the invitation.',
        icon: 'error',
      });
      return;
    }

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
        try {
          const response = await axios.put(
            `${process.env.REACT_APP_BASE_URL}/invitations/${eventId}`,
            {
              status: "Declined",
              phoneNumber: phoneNumber || undefined,
            }
          );
          if (response.data.success) {
            setInvitationStatus("Declined");
            Swal.fire("Declined", "You have declined the invitation.", "success");
          }
        } catch (error) {
          Swal.fire("Error!", error.response?.message || "Something went wrong", "error");
        }
      }
    });
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
        navigate(`/chats/${response.data.chat.groupId}`);
      }
    } catch (error) {
      console.error("❌ Error starting chat:", error.response?.data || error.message);
    }
  };

  const handleClick = (item) => {
    // Check if the status is "Purchased" or "Marked"
    if (item.status === "Purchased" || item.status === "Marked") {
      if (item.userId === currentUserId) {
        navigate(`/wishlistdetails/${item._id}`, { state: { item } });
      } else {
        alert("You cannot open this item because it has already been purchased or marked by someone else.");
      }
    } else if (item.status === "Unmark" || item.status === "CreatePool") {
      navigate(`/wishlistdetails/${item._id}`, { state: { item } });
    }
  };

  if (loading) return <div style={{display:'flex',justifyContent:'center', marginTop:'50%'}}>Loading...</div>;

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
              src={
    events.image && events.image !== "null" && events.image !== `${process.env.REACT_APP_BASE_URL}/null`
      ? `${process.env.REACT_APP_BASE_URL}/${events.image}`
      : `${process.env.PUBLIC_URL}/img/eventdefault.png`
  }
  alt="event"
  className="img-fluid"
  style={{ width: "100%", height: "300px", objectFit: "cover", borderRadius: "10px" }} 
/>
          </div>

          {events && (
            <div>
              <h2 className="mt-3 fw-bold">{events.name}</h2>
              <ul className="nav nav-tabs mt-3">
                {[ "details", invitationStatus === "Accepted" ? "wishlist" : null, invitationStatus === "Accepted" ? "guests" : null ]
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
                    <p className="d-flex align-items-center">{events.description}</p>

                    {invitationStatus === "Pending" || invitationStatus === "Invited" || null || !invitationStatus ? (
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
                          <div key={item._id} className="wishlist-item" onClick={() => handleClick(item)}>
                            <h6 className="wishlist-item-name">{item.name}</h6>
                            <p className="wishlist-item-status">{item.status}</p>
                          </div>
                        ))
                      ) : (
                        <p>No wishlist items found</p>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "guests" && (
                  <div>
                    <h5>💬 Guest List</h5>
                    {users.length > 0 ? (
                      users.map((user) => (
                        <div key={user.id}>
                          <p>{user.name}</p>
                        </div>
                      ))
                    ) : (
                      <p>No guests invited yet</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default EventDetails;
