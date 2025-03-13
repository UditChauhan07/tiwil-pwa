import React, { useEffect, useState } from "react";
import "../Events/Eventdetails.css";
import {  FaShareAlt } from "react-icons/fa";
import Navbar from "../Navbar/navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {  useParams } from "react-router-dom";
import Swal from "sweetalert2";


const EventDetails = () => {
  const [activeTab, setActiveTab] = useState("details");
  const [wishlistItems, setWishlistItems] = useState([]);
  const [events, setEvents] = useState({});
  const [invitationStatus, setInvitationStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guest, setGuest] = useState([]);
  const [owner, setOwner] = useState(null);
  const { eventId, phoneNumber } = useParams();
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("userId");


  useEffect(() => {
    console.log("Updated Owner State:", owner);
}, [owner]); 
  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchGuest = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/guests/${eventId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data && response.data.data) {
          setGuest(response.data.data);

          console.log(response.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchGuest();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/guests-status/${eventId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response?.data?.success) {
          setInvitationStatus(response.data.data.status); // Extract status correctly
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (eventId) {
      fetchUsers();
    }
  }, [eventId]);

  useEffect(() => {
    const fetchWishlist = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${process.env.REACT_APP_BASE_URL}/wishlist/event/${eventId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            
            const wishlistData = response.data.data || [];
            setWishlistItems(wishlistData);
console.log("main")
            // Check if there's at least one item in the wishlist
            const markedItem = wishlistData.find(item => item.markedBy?.userId);

            if (markedItem) {
                console.log("Found Marked Owner ID:", markedItem.markedBy.userId);
                setOwner(markedItem.markedBy.userId);
            } else {
                console.log("No MarkedBy User Found in Any Item");
                setOwner(null);
            }
            

        } catch (error) {
            console.error("Error fetching wishlist:", error);
        }
    };

    fetchWishlist();
}, [eventId]);

  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/events/${eventId}`
        );
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
    if (!dateString) return null;
  
    const eventDate = new Date(dateString);
    if (isNaN(eventDate.getTime())) return null; // Check if date is valid
  
    eventDate.setFullYear(new Date().getFullYear());
  
    return eventDate.toLocaleDateString("en-GB"); // "DD/MM/YYYY"
  };
  

  const handleAccept = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      Swal.fire({
        title: "Error",
        text: "Please sign in to accept the invitation.",
        icon: "error",
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
      Swal.fire(
        "Error!",
        error.response?.data?.message || "Something went wrong",
        "error"
      );
    }
  };

  const handleDecline = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      Swal.fire({
        title: "Error",
        text: "Please sign in to decline the invitation.",
        icon: "error",
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
            Swal.fire(
              "Declined",
              "You have declined the invitation.",
              "success"
            );
          }
        } catch (error) {
          Swal.fire(
            "Error!",
            error.response?.message || "Something went wrong",
            "error"
          );
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
      console.error(
        "❌ Error starting chat:",
        error.response?.data || error.message
      );
    }
  };
//   const handleClick = async (item) => {
//     const isPurchasedOrMarked =
//       item.status === "Purchased" || item.status === "Mark";
//     const isUnmarked = item.status === "Unmark";
//     const isPooling = item.status === "Pooling";
//     const isOwner = owner === currentUserId;
    
//     const wishId = item._id;
// console.log(owner)
// console.log(currentUserId)
// console.log(isOwner)
//     if (isPurchasedOrMarked) {
//       if (isOwner) {
//         navigate(`/wishlistdetails/${item._id}`, { state: { item } });
//       } else {
//         Swal.fire({
//           title: "Error",
//           text: "Someone already wants to purchase it or it has already been purchased.",
//           icon: "warning",
//           confirmButtonColor: "#FF3366",
//         });
//       }
//     } 
    
const handleClick = async (item) => {
  const isPurchasedOrMarked =
    item.status === "Purchased" || item.status === "Mark";
  const isUnmarked = item.status === "Unmark";
  const isPooling = item.status === "Pooling";
  const isOwner = owner === currentUserId;
  console.log(isOwner)
  console.log(owner)
  console.log(currentUserId)
  const wishId = item._id;

  if (isPurchasedOrMarked) {
    if (isOwner) {
      navigate(`/wishlistdetails/${item._id}`, { state: { item } });
    } else {
      Swal.fire({
        title: "Error",
        text: "Someone already wants to purchase it or it has already been purchased.",
        icon: "warning",
        confirmButtonColor: "#FF3366",
      });
    }
  } else if (isUnmarked) {
    navigate(`/wishlistdetails/${item._id}`, { state: { item } });
  } else if (isPooling) {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found in localStorage");
        Swal.fire({
          title: "Unauthorized",
          text: "You must be logged in to access this feature.",
          icon: "error",
          confirmButtonColor: "#FF3366",
        });
        return;
      }

      

      // Try to fetch the guest data to check if the user is invited
      try {
        if (isOwner) {
          console.log(isOwner)
          console.log(owner)
          navigate(`/createpool/${item._id}`, { state: { item } });
          return;
        }
        
        const { data } = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/guests/userId/${wishId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // If no invited users are found, show the contribution dialog
        if (data.message === "No invited users found.") {
          const ItemId = item._id;
          Swal.fire({
            title: "Access Denied",
            text: "Invited users can contribute to the pool! Wanna contribute? Click OK.",
            icon: "error",
            showCancelButton: true,
            confirmButtonText: "OK",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#FF3366",
          }).then(async (result) => {
            if (result.isConfirmed) {
              try {
                const response = await axios.post(
                  `${process.env.REACT_APP_BASE_URL}/request`,
                  { ItemId },
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  }
                );

                if (response.data.success) {
                  Swal.fire({
                    title: "Request Sent!",
                    text: "Your request has been sent to the pool admin.",
                    icon: "success",
                    confirmButtonColor: "#FF3366",
                  });
                } else {
                  Swal.fire({
                    title: "Error!",
                    text: "There was an issue sending the request.",
                    icon: "error",
                    confirmButtonColor: "#FF3366",
                  });
                }
              } catch (error) {
                Swal.fire({
                  title: "Error!",
                  text: "An error occurred while sending the request.",
                  icon: "error",
                  confirmButtonColor: "#FF3366",
                });
              }
            }
          });
          return;
        }

        // If the user is invited, proceed to the pooling page
        const isInvited = data.guestUsers?.some(
          (user) => user.userId.toString() === currentUserId.toString()
        ); if (isOwner) {
          navigate(`/createpool/${item._id}`, { state: { item } });
          return;
        }
  

        if (isInvited) {
          navigate(`/createpool/${item._id}`, { state: { item } });
        } else {
          const ItemId = item._id;
          Swal.fire({
            title: "Access Denied",
            text: "You need to be invited to contribute to the pool. Wanna contribute? Click OK.",
            icon: "error",
            showCancelButton: true,
            confirmButtonText: "OK",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#FF3366",
          }).then(async (result) => {
            if (result.isConfirmed) {
              try {
                const response = await axios.post(
                  `${process.env.REACT_APP_BASE_URL}/request`,
                  { wishId },
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  }
                );

                if (response.data.success) {
                  Swal.fire({
                    title: "Request Sent!",
                    text: "Your request has been sent to the pool admin.",
                    icon: "success",
                    confirmButtonColor: "#FF3366",
                  });
                } else {
                  Swal.fire({
                    title: "Error!",
                    text: "There was an issue sending the request.",
                    icon: "error",
                    confirmButtonColor: "#FF3366",
                  });
                }
              } catch (error) {
                Swal.fire({
                  title: "Error!",
                  text: "An error occurred while sending the request.",
                  icon: "error",
                  confirmButtonColor: "#FF3366",
                });
              }
            }
          });
        }

      } catch (error) {
        // Handle error if the resource isn't found (404) or any other issue
        if (error.response && error.response.status === 404) {
          const ItemId = item._id;
          Swal.fire({
            title: "Access Denied",
            text: "Invited users can contribute to the pool! Wanna contribute? Click OK.",
            icon: "error",
            showCancelButton: true,
            confirmButtonText: "OK",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#FF3366",
          }).then(async (result) => {
            if (result.isConfirmed) {
              try {
                const response = await axios.post(
                  `${process.env.REACT_APP_BASE_URL}/request`,
                  { wishId },
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  }
                );

                if (response.data.success) {
                  Swal.fire({
                    title: "Request Sent!",
                    text: "Your request has been sent to the pool admin.",
                    icon: "success",
                    confirmButtonColor: "#FF3366",
                  });
                } else {
                  Swal.fire({
                    title: "Error!",
                    text: "There was an issue sending the request.",
                    icon: "error",
                    confirmButtonColor: "#FF3366",
                  });
                }
              } catch (error) {
                Swal.fire({
                  title: "Error!",
                  text: "An error occurred while sending the request.",
                  icon: "error",
                  confirmButtonColor: "#FF3366",
                });
              }
            }
          });
        } else {
          // Generic error handling if the error isn't 404
          Swal.fire({
            title: "Error!",
            text: "An error occurred while checking guest status.",
            icon: "error",
            confirmButtonColor: "#FF3366",
          });
        }
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      Swal.fire({
        title: "Unexpected Error!",
        text: "An unexpected error occurred. Please try again later.",
        icon: "error",
        confirmButtonColor: "#FF3366",
      });
    }
  }
};

         
  if (loading)
    return (
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "50%" }}
      >
        Loading...
      </div>
    );

  return (
    <>
      <section className="page-controls">
   
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
                events.image &&
                events.image !== "null" &&
                events.image !== `${process.env.REACT_APP_BASE_URL}/null`
                  ? `${process.env.REACT_APP_BASE_URL}/${events.image}`
                  : `${process.env.PUBLIC_URL}/img/eventdefault.png`
              }
              alt="event"
              className="img-fluid"
              style={{
                width: "100%",
                height: "300px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
          </div>

          {events && (
            <div>
              <h2 className="mt-3 fw-bold">
                {events.name}
                {events.eventType}
              </h2>
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
  {events.formattedDate || "Date not available"}
</p>
                    <p className="d-flex align-items-center">
                      <span className="bg-danger text-white p-2 rounded me-2">
                        📍
                      </span>
                      {events.location || "Location not available"}
                    </p>
                    <p className="d-flex align-items-center">
                      {events.description}
                    </p>

                    {invitationStatus === "Pending" ||
                    invitationStatus === "invited" || 
                    null ||
                    !invitationStatus ? (
                      <div className="text-center mt-4 d-flex gap-1">
                        <button
                          className="btn btn-danger w-30"
                          onClick={handleAccept}
                        >
                          ACCEPT
                        </button>
                        <button
                          className="btn w-30"
                          style={{ border: "1px solid" }}
                          onClick={handleDecline}
                        >
                          DECLINE
                        </button>
                      </div>
                    ) : invitationStatus === "Accepted" ? (
                      <div className="text-center mt-4">
                        <button
                          className="btn btn-danger w-30"
                          onClick={handleStartChat}
                        >
                          START CHAT
                        </button>
                      </div>
                    ) : null}
                  </>
                )}

                {activeTab === "wishlist" && (
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <h5>🎁 Wishlist</h5>
                      <h5>Show All</h5>
                    </div>
                    <div className="wishlist-items">
                      {wishlistItems.length > 0 ? (
                        wishlistItems.map((item) => (
                          <div key={item._id}>
                            <div className="row">
                              <div
                                className="col-lg-4 col-md-6 col-sm-12"
                                style={{ marginBottom: "10px" }}
                              >
                                <div
                                  className="card"
                                  style={{
                                    backgroundImage: `url(${process.env.REACT_APP_BASE_URL}/${item.imageUrl})`,
                                    position: "relative",
                                    backgroundRepeat: "no-repeat",
                                    backgroundSize: "cover",
                                  }}
                                >
                                  <div
                                    className="card-img-top"
                                    style={{ height: "226px" }}
                                  >
                                    <div className="d-flex justify-content-end m-2">
                                      <p
                                        className="card-text status d-flex justify-content-center"
                                        style={{ background: "cornsilk" }}
                                      >
                                        {item.status}
                                      </p>
                                    </div>
                                  </div>
                                  <div
                                    onClick={() => handleClick(item)}
                                    style={{ cursor: "pointer" }}
                                  >
                                    <div className="card-body cards11">
                                      <div
                                        className="d-flex justify-content-between"
                                        style={{ paddingTop: "11px" }}
                                      >
                                        <h6
                                          className="card-title"
                                          style={{ color: "black" }}
                                        >
                                          {item.giftName}
                                        </h6>
                                        <p
                                          className="card-text"
                                          style={{
                                            color: "#ff3366",
                                            fontWeight: "600",
                                          }}
                                        >
                                          ${item.price}
                                        </p>
                                      </div>
                                      <div className="d-flex justify-content-between">
                                        <p className="card-text text-secondary m-1">
                                          {item.description}
                                        </p>
                                        <img
                                          src={`${process.env.PUBLIC_URL}/img/Group 33582.svg`}
                                          alt="svg"
                                        />
                                      </div>
                                    </div>
                                  </div>
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
                    <h5>💬 Guest List</h5>
                    {guest.length > 0 ? (
                      guest.map((guest) => (
                        <div key={guest.id}>
                          <p>{guest.name}</p>
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
