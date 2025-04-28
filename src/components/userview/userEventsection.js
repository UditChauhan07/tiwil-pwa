import React, { useEffect, useState } from "react";
import "../Events/Eventdetails.css";
import { FaShareAlt } from "react-icons/fa";
import Navbar from "../Navbar/navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
const EventDetails = () => {
  const [activeTab, setActiveTab] = useState("details");
  const [wishlistItems, setWishlistItems] = useState([]);
  const [events, setEvents] = useState({});
  const [invitationStatus, setInvitationStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guest, setGuest] = useState([]);
  const [owner, setOwner] = useState(null);
  const { eventId, phoneNumber } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("userId");
  const location = useLocation();

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
    const params = new URLSearchParams(location.search);
    const tabFromUrl = params.get("tab");
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [location.search]);

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
        console.log("main");
        // Check if there's at least one item in the wishlista
        const markedItem = wishlistData.find((item) => item.markedBy?.userId);

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
        setIsLoading(false);
      }
    };

    fetchEventDetail();
  }, [eventId]);

  const formatDateWithCurrentYear = (originalDate) => {
    const eventDate = new Date(originalDate);
    if (isNaN(eventDate.getTime())) return "Invalid Date";

    const today = new Date();
    const currentYear = today.getFullYear();

    // Set the event year to the current year
    eventDate.setFullYear(currentYear);

    return (
      eventDate.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
      }) + ` ${currentYear}`
    ); // Append the current year at the end
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
         Swal.fire({
                        title: "Success",
                        text: "Accepted  successfully!",
                        icon: "success",
                        confirmButtonColor: "#ff3366" // Custom confirm button color
                      });
                      
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
    console.log(isOwner);
    console.log(owner);
    console.log(currentUserId);
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
            console.log(isOwner);
            console.log(owner);
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
                        Authorization: `Bearer ${localStorage.getItem(
                          "token"
                        )}`,
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
          );
          if (isOwner) {
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
                        Authorization: `Bearer ${localStorage.getItem(
                          "token"
                        )}`,
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
                        Authorization: `Bearer ${localStorage.getItem(
                          "token"
                        )}`,
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

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "200px",
        }}
      >
        {/* <Spinner
          animation="border"
          role="status"
          style={{ width: "7rem", height: "7rem" }}
        /> */}
        <div class="spinner-border text-danger custom-spinner" role="status" style={{width: '5rem', height: '5rem',color:'#ff3366'}}>
  <span class="visually-hidden">Loading...</span>
</div>
      </div>
    );
  }

  return (
    <>
      <section className="page-controls">
        <div className="container mt-4 ">
          <div className="d-flex justify-content-between align-items-center fixed_Top mt-5 mb-5">
          <div className="d-flex align-items-center gap-2">
            <FontAwesomeIcon
              icon={faArrowLeft}
              onClick={() => navigate("/home")}
              style={{ fontSize: "23px" }}
            />
            <h4 style={{ marginBottom: "0px" }}>Event Details</h4>
            </div>
            <div className="d-flex align-items-center">
              <FaShareAlt className="me-3 fs-5" />
            </div>
          </div>

          <div
            className="mt-3"
            style={{
              width: "100%",
              maxHeight: "300px",
              top: "97px",
              left: "21px",
              borderRadius: "10px",
            }}
          >
            <img
              src={
                events.newimage &&
                events.newimage !== "null" &&
                events.newimage !== `${process.env.REACT_APP_BASE_URL}/null`
                  ? `${process.env.REACT_APP_BASE_URL}/${events.newimage}` // Priority to newimage
                  : events.image &&
                    events.image !== "null" &&
                    events.image !== `${process.env.REACT_APP_BASE_URL}/null`
                  ? `${process.env.REACT_APP_BASE_URL}/${events.image}` // Fallback to image
                  : `${process.env.PUBLIC_URL}/img/eventdefault1.png` // Default image
              }
              alt="event"
              className="img-fluid"
              style={{
                width: "100%",
                maxHeight: "300px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
          </div>

          {events && (
            <div>
              <h4 className="mt-3 " style={{fontFamily: 'Poppins',
fontWeight: "500",
fontSize: '24px',
leadingTrim: 'Cap-height',
lineHeight: '100%',
letterSpacing: '0%'}}>
                {events.name} {events.eventType}
              </h4>
              <ul className="nav nav-tabs mt-3 ulmain">
                {[
                  "details",
                  invitationStatus === "Accepted" || "accepted"
                    ? "wishlist"
                    : null,
                  invitationStatus === "Accepted" || "accepted"
                    ? "guests"
                    : null,
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

              <div className="tab-content  mt-3   bg-white">
                {activeTab === "details" && (
                  <>
                   <p className="d-flex align-items-center gap-2 mb-2">
                                             <div className="calender-icon">
                                               <FontAwesomeIcon
                                                 icon={faCalendarAlt}
                                                 style={{ color: "#ff3366", fontSize: "20px"  }}
                                               />
                                             </div>
                                          <span className='detailspan'>   {events.displayDate
                                               ? formatDateWithCurrentYear(
                                                   events.displayDate,
                                                 
                                                 
                                                 )
                                               : "Date not available"}
                                           </span></p>
                   
                                           <p className="d-flex align-items-center gap-2">
                                             <span className=" text-white   location-icon">
                                               <FontAwesomeIcon
                                                 icon={faLocationDot}
                                                 style={{ color: "#ff3366",margin:'3px' }}
                                               />
                                             </span>
                                             <span className='locspan'>
                                             {events.location || "Location not available"}
                                          </span></p>
                    {/* <p className="d-flex align-items-center">
                      {events.description}
                    </p> */}
                    <br />
                   
                    <div className="about-event">
                      <br />

                      <div className="headersevent">
                        <h5>About event</h5>
                      </div>
                      <div className="aboutevent2">  <span classname="eventdesc">{events.description || 'Not provided by owner'}</span></div>
                      {invitationStatus === "Pending" ||
                    invitationStatus === "invited" ||
                    null ||
                    !invitationStatus ? (
                      <div className="text-center mt-4 d-flex gap-1 fixed_bottom" >
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
                      <div className="text-center mt-4 fixed_bottom">
                        <button
                          style={{ marginTop: "30px" }}
                          className="btn btn-danger w-30"
                          onClick={handleStartChat}
                        >
                          START CHAT
                        </button>
                      </div>
                    ) : null}    </div>
                   
                  </>
                )}

                {activeTab === "wishlist" && (
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    ></div>
                    <div className="wishlist-items">
                      <h5> Wishlist</h5>
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
                                    backgroundImage: `url(${
      item?.imageUrl
        ? `${process.env.REACT_APP_BASE_URL}/${item.imageUrl}`
        : `${process.env.PUBLIC_URL}/img/wishlistdefault.png`
    })`,
                                    position: "relative",
                                    backgroundRepeat: "no-repeat",
                                    backgroundSize: "cover",
                                  }}
                                >
                                  <div
                                    className="card-img-top"
                                    style={{ height: "161px" }}
                                  >
                                    <div className="d-flex justify-content-end m-2">
                                      {item.status !== "Unmark" && (
                                        <p
                                          className="card-text status d-flex justify-content-center"
                                          style={{ background: "cornsilk" }}
                                        >
                                          {item.status === "Mark"
                                            ? "Marked"
                                            : item.status === "Purchase"
                                            ? "Purchased"
                                            : item.status === "Pooling"
                                            ? "Pool"
                                            : item.status}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <div
                                    onClick={() => handleClick(item)}
                                    style={{ cursor: "pointer" }}
                                  >
                                    <div className="card-body cards11">
                                      <div className="row align-items-center">
                                        {/* Left Side: Image */}
                                        <div className="col-2">
                                              <img
                                                src={
                                                  events.image &&
                                                  events.image !== "null" &&
                                                  events.image !==
                                                    `${process.env.REACT_APP_BASE_URL}/null`
                                                    ? `${process.env.REACT_APP_BASE_URL}/${events.image}`
                                                    : events.image &&
                                                      events.image !== "null" &&
                                                      events.image !==
                                                        `${process.env.REACT_APP_BASE_URL}/null`
                                                    ? `${process.env.REACT_APP_BASE_URL}/${events.image}`
                                                    : `${process.env.PUBLIC_URL}/img/defaultUser1.png`
                                                }
                                        
                                                style={{height:'43px',width:'43px',borderRadius:'50%',objectFit:'cover'}}
                                              />
                                            </div>

                                        {/* Middle: Content */}
                                        <div className="col-7">
                                          <h6
                                            className="card-title mb-0"
                                            style={{
                                              color: "black",
                                              fontSize: "15px",
                                              margin: "0",
                                            }}
                                          >
                                            {item.giftName}
                                          </h6>
                                          <p
                                            className="card-text text-secondary"
                                            style={{ margin: 0, padding: 0 }}
                                          >
                                            <span
                                              style={{
                                                fontSize: "13px",
                                                display: "block",
                                                lineHeight: "1.9",
                                              }}
                                            >
                                              {events.name}
                                            </span>
                                            <span className="descriptionwish"
                                              style={{
                                                fontSize: "12px",
                                                display: "block",
                                                lineHeight: "1.9",
                                              }}
                                            >
                                              {item.description}
                                            </span>
                                          </p>
                                        </div>

                                        {/* Right Side: Price and Button */}
                                        <div className="col-3 d-flex flex-column justify-content-between align-items-end h-100">
                                          {/* Price */}
                                          <p
                                            className="card-text"
                                            style={{
                                              color: "#ff3366",
                                              fontWeight: "600",
                                              marginBottom: "0.5rem",
                                            }}
                                          >
                                            ${item.price}
                                          </p>
                                          {/* Button */}
                                          <img
                                            src={`${process.env.PUBLIC_URL}/img/Group 33582.svg`}
                                            alt="svg"
                                            style={{
                                              maxWidth: "100%",
                                              height: "auto",
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="no-wishlist">
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                          <p>No wishlist found.</p>
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "guests" && (
                  <div>
                    {guest.length > 0 ? (
                      guest.map((guest) => (
                        <div key={guest.id} className="d-flex gap-3 align-items-center">
                          <div
                            style={{
                              height: "45px",
                              width: "45px",
                              borderRadius: "50%",
                              overflow: "hidden",
                            }}
                          >
                            <img
                              src={
                                guest.profileImage
                                  ? `${process.env.REACT_APP_BASE_URL}/${guest.profileImage}`
                                  : `${process.env.PUBLIC_URL}/img/defaultUser.png`
                              }
                              height="45px"
                              width="45px"
                              style={{
                             
                                borderRadius: "50%",
                              }}
                              // alt={
                              //   guest.name
                              //     ? `${guest.name}'s profile`
                              //     : "Default User Profile"
                              // } // Added meaningful alt text
                            />
                          </div>
                         <span style={{ fontFamily: "Poppins",
fontWeight: "500",
fontSize: "14px",
lineHeight: "100%",
letterSpacing: "0px",
verticalAlign: "middle",
color:' #120D26'

}}>{guest.name}</span></div>
                       
                      ))
                    ) : (
                      <div className=" mt-4">
                        <div className="notinvited">
                          <br />
                          <br />
                          No Guest Invited
                        </div>

                        <br />

                        <br />
                        <br />
                        <br />
                      </div>
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
