import React, { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { FaEllipsisV,  FaArrowRight } from "react-icons/fa";
import "./Eventdetails.css";

import { faShareNodes } from '@fortawesome/free-solid-svg-icons';
import WishlistModal from "../Wishlist/addWishlist";
import InviteModal from "../GuestInvite/GuestModal";
import EditEventModal from "./eventModal";
import axios from "axios";
import { useParams } from "react-router-dom";
import InviteButton from "../userview/Invitetest";
import { useNavigate } from "react-router-dom";
import WishlistEditModal from "../Wishlist/wishlistModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'; 


const EventDetails = () => {
  const [activeTab, setActiveTab] = useState("details");
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [guest, setGuest] = useState([]);
  console.log("showWishlistModal", showWishlistModal);
  const [showGuestModal, setGuestModal] = useState(false);
  const [showeditWishlistModal, setshoweditWishlistModal] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedWishlist, setSelectedWishlist] = useState(null);
  const [pastevents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const { eventId } = useParams(); // Get eventId from URL parameters
  console.log(eventId);
  const navigate = useNavigate();
  const [surpriseData, setSurpriseData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedContributors, setSelectedContributors] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/getsurprisedata`,
          config
        );

        if (response.data.success && response.data.data.length > 0) {
          // Group data by unique eventId to avoid duplicates
          const uniqueEvents = Object.values(
            response.data.data.reduce((acc, item) => {
              acc[item.eventId] = acc[item.eventId] || {
                ...item,
                wishlistItems: [],
              };
              acc[item.eventId].wishlistItems.push(item.wishlistItem);
              return acc;
            }, {})
          );
          setSurpriseData(uniqueEvents);
          setErrorMessage("");
        } else {
          setSurpriseData([]);
          setErrorMessage(
            response.data.message || "No surprise reveal for tomorrow."
          );
        }
      } catch (error) {
        setSurpriseData([]);
        setErrorMessage("Error fetching data. Please try again later.");
      }
    };

    fetchData();
  }, []);

  const openModal = (contributors) => {
    setSelectedContributors(contributors);
    setShowModal(true);
  };
  // Fetch wishlist data from the server
  // useEffect(() => {
  //   const fetchWishlist = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${process.env.REACT_APP_BASE_URL}/wishlist/event/${eventId}`,
  //         {
  //           headers: { Authorization: `Bearer ${token}` },
  //         }
  //       );

  //       // ✅ Extract `data` from the response object
  //       setWishlist(response.data.data || []);
  //     } catch (error) {
  //       console.error("❌ Error while fetching wishlist:", error);
  //     }
  //   };

  //   fetchWishlist();
  // }, [eventId]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/history`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPastEvents(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error("❌ Error while fetching history:", error);
      }
    };
    fetchHistory();
  }, [eventId]);

  useEffect(() => {
    fetchWishlist();
  }, [eventId]);
  const fetchWishlist = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/wishlist/event/${eventId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setWishlist(response.data.data || []);
    } catch (error) {
      console.error("❌ Error while fetching wishlist:", error);
    }
  };

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

  // Fetch event details using eventId
  // useEffect(() => {
  //   if (!eventId) return; // Prevent request if eventId is not available

  //   const getEvent = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${process.env.REACT_APP_BASE_URL}/events/${eventId}`,
  //         {
  //           headers: { Authorization: `Bearer ${token}` },
  //         }
  //       );
  //       const data = response.data.data; // Response contains data object
  //       console.log(data);
  //       setEvents([data]); // Store single event in array
  //     } catch (error) {
  //       console.log("Error while fetching event:", error);
  //     }
  //   };

  //   getEvent();
  // }, [eventId]); // Dependency array ensures this effect runs when eventId changes
  const inviteguest = localStorage.getItem("invited");

  const fetchGuest = async () => {
    const token = localStorage.getItem("token");
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

  useEffect(() => {
    fetchGuest();
  }, [inviteguest]);

  const getEvent = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/events/${eventId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = response.data.data; // Response contains data object
      console.log(data);
      setEvents([
        {
          ...data,
          formattedDate: data.formattedDate, // ✅ Convert year dynamically
        },
      ]);
      // Store single event in array
    } catch (error) {
      console.log("Error while fetching event:", error);
    }
    setLoading(false);
  };
  useEffect(() => {
    getEvent();
  }, [eventId]);

  const handleStartChat = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/chats/group`,
        { eventId: eventId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // Navigate to the existing or newly created chat
        navigate(`/chats/${response.data.chat.groupId}`);
      }
    } catch (error) {
      console.error(
        "❌ Error starting chat:",
        error.response?.data || error.message
      );
    }
  };

  //   getEvent();
  const handleShare = () => {
    const shareData = {
      text: `Check out this event i am celeberating`,
      url: window.location.href, // Share the current event page URL
    };

    if (navigator.share) {
      navigator
        .share(shareData)
        .then(() => console.log("Event shared successfully!"))
        .catch((error) => console.error("Error sharing:", error));
    } else {
      // Fallback for unsupported browsers: Copy link to clipboard
      navigator.clipboard.writeText(shareData.url);
      alert("Link copied to clipboard!");
    }
  };

  const handledeletevent = async () => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      confirmButtonColor: "#ff3366", // your custom color inline
      cancelButtonColor: "#d3d3d3", // optional: grey cancel button
    });

    if (confirm.isConfirmed) {
      try {
        const response = await axios.delete(
          `${process.env.REACT_APP_BASE_URL}/delete-event/${eventId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 200) {
          Swal.fire({
            title: "Deleted!",
            text: "The event has been deleted.",
            icon: "success",
            confirmButtonColor: "#ff3366",
          });
          navigate("/home");
        }
      } catch (error) {
        console.error("Error deleting event:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to delete the event.",
          icon: "error",
          confirmButtonColor: "#ff3366",
        });
      }
    }
  };
  const calculateAgeAndBirthdayText = (eventDate) => {
   // <-- Add this check
    if (!eventDate) return "N/A";
  
    const today = new Date();
    const targetDate = new Date(eventDate);
    const currentYear = today.getFullYear();
    targetDate.setFullYear(currentYear);
  
    const birthDate = new Date(eventDate);
    const age = today.getFullYear() - birthDate.getFullYear();
  
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
    if (diffDays === 0) return "Today!";
    if (diffDays < 0) targetDate.setFullYear(currentYear + 1);
  
    const nextDiffTime = targetDate - today;
    const nextDiffDays = Math.ceil(nextDiffTime / (1000 * 60 * 60 * 24));
    return `${nextDiffDays} Days Left`;
  };
  const getUpcomingBirthdayNumber = (eventDate) => {
    if (!eventDate) return null; // Handle invalid dates

    const today = new Date();
    const birthDate = new Date(eventDate); // The person's birthday date

    // Calculate the initial age (number of birthdays already passed)
    let upcomingBirthday = today.getFullYear() - birthDate.getFullYear();

    // Check if their birthday hasn't occurred yet this year
    const thisYearBirthday = new Date(birthDate);
    thisYearBirthday.setFullYear(today.getFullYear());

    if (today < thisYearBirthday) {
      upcomingBirthday--; // Subtract 1 if the birthday hasn't occurred yet
    }

    // Determine the ordinal suffix (1st, 2nd, 3rd, nth)
    return getOrdinalSuffix(upcomingBirthday + 1); // +1 since we start counting from the 1st birthday
  };

  // Determine the ordinal suffix (1st, 2nd, 3rd, nth)
  const getOrdinalSuffix = (number) => {
    const j = number % 10,
      k = number % 100;
    if (j === 1 && k !== 11) {
      return number + "st";
    }
    if (j === 2 && k !== 12) {
      return number + "nd";
    }
    if (j === 3 && k !== 13) {
      return number + "rd";
    }
    return number + "th";
  };
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "150px",
        }}
      >
        {/* <Spinner
          animation="border"
          role="status"
          style={{ width: "10rem", height: "10rem" }}
        /> */}
        <div class="spinner-border text-danger custom-spinner" role="status" style={{width: '5rem', height: '5rem',color:'#ff3366'}}>
  <span class="visually-hidden">Loading...</span>
</div>
      </div>
    );
  }

  return (
    <>
      <section className="page-controls" style={{ padding: "0" }}>
        <div>
          <div className="container mt-2">
            {/* Header Section */}
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex gap-2 align-items-flex-start">
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  onClick={() => navigate(-1)} style={{fontSize:'23px'}}
                />

                <h4>Event Details</h4>
              </div>
              <div className="d-flex align-items-center gap-2" >
                {/* <FontAwesomeIcon icon={faShareNodes} style={{ color: '#ff3366', fontSize: '24px' }} 
                 */}
                
                  <div onClick={handleShare}>
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginBottom:'6px'}}>
<path d="M3.26923 11.7692C4.30885 11.7692 5.23077 11.2723 5.82577 10.5073L10.5858 12.8873C10.5138 13.1619 10.4615 13.4365 10.4615 13.7308C10.4615 15.5354 11.9262 17 13.7308 17C15.5354 17 17 15.5354 17 13.7308C17 11.9262 15.5354 10.4615 13.7308 10.4615C12.6912 10.4615 11.7692 10.9585 11.1742 11.7235L6.41423 9.34346C6.48615 9.06885 6.53846 8.79423 6.53846 8.5C6.53846 8.20577 6.48615 7.93115 6.41423 7.65654L11.1742 5.27654C11.7692 6.04154 12.6912 6.53846 13.7308 6.53846C15.5354 6.53846 17 5.07385 17 3.26923C17 1.46462 15.5354 0 13.7308 0C11.9262 0 10.4615 1.46462 10.4615 3.26923C10.4615 3.56346 10.5138 3.83808 10.5858 4.11269L5.82577 6.49269C5.23077 5.72769 4.30885 5.23077 3.26923 5.23077C1.46462 5.23077 0 6.69538 0 8.5C0 10.3046 1.46462 11.7692 3.26923 11.7692ZM13.7308 11.7692C14.8096 11.7692 15.6923 12.6519 15.6923 13.7308C15.6923 14.8096 14.8096 15.6923 13.7308 15.6923C12.6519 15.6923 11.7692 14.8096 11.7692 13.7308C11.7692 12.6519 12.6519 11.7692 13.7308 11.7692ZM13.7308 1.30769C14.8096 1.30769 15.6923 2.19038 15.6923 3.26923C15.6923 4.34808 14.8096 5.23077 13.7308 5.23077C12.6519 5.23077 11.7692 4.34808 11.7692 3.26923C11.7692 2.19038 12.6519 1.30769 13.7308 1.30769ZM3.26923 6.53846C4.34808 6.53846 5.23077 7.42115 5.23077 8.5C5.23077 9.57885 4.34808 10.4615 3.26923 10.4615C2.19038 10.4615 1.30769 9.57885 1.30769 8.5C1.30769 7.42115 2.19038 6.53846 3.26923 6.53846Z" fill="black"/>
</svg>

                </div>
                <Dropdown>
                  <Dropdown.Toggle
                    as="button"
                    className="btn  border-0 "
                >
              <FontAwesomeIcon icon={faEllipsisVertical} style={{ height:'23px',width:'23px'  }} />

                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setShowEditModal(true)}>
                      Edit Event
                    </Dropdown.Item>
                    <Dropdown.Item
                      className="text-danger"
                      onClick={handledeletevent}
                    >
                      Cancel Event
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
            {events.length > 0 ? (
              events.map((event) => (
                <div key={event._id} style={{ marginTop: "17px" }}>
                  {/* Event Image */}
                  {/* <Card variant="top" style={{ position: "relative", width: "100%", height: "162px" ,borderBottom:'unset'}}>
                                    <img
                                      src={event.newimage && event.newimage !== "null" ? `${process.env.REACT_APP_BASE_URL}/${event.newimage}` : event.image && event.image !== "null" ? `${process.env.REACT_APP_BASE_URL}/${event.image}` : `${process.env.PUBLIC_URL}/img/eventdefault.png`}
                                      alt="Event"
                                      style={{ width: '100%', height: '162px' ,padding:'5px'}}
                                      className="imgEvent"
                                    />
                                    <div style={{ borderRadius: "0px 4px 0px 0px", position: "absolute", top: "5px", right: "5px", color: "white", fontSize: "15px", fontWeight: "bold", backgroundColor: "#ff3366", padding: "5px" }}>
                                      {event.date && calculateAgeAndBirthdayText(event.displayDate, event.date, event.eventDate)}
                                    </div>
                                  </Card> */}
                  <div
                    style={{
                      maxWidth: "760px",
                      width:'100%',
                      maxHeight: "320px",
                      borderRadius: "10px",
                      position:'relative'
                    }}
                  >
                    <img
                      src={
                        event.newimage &&
                        event.newimage !== "null" &&
                        event.newimage !==
                          `${process.env.REACT_APP_BASE_URL}/null`
                          ? `${process.env.REACT_APP_BASE_URL}/${event.newimage}` // Priority to newimage
                          : event.image &&
                            event.image !== "null" &&
                            event.image !==
                              `${process.env.REACT_APP_BASE_URL}/null`
                          ? `${process.env.REACT_APP_BASE_URL}/${event.image}` // Fallback to image
                          : `${process.env.PUBLIC_URL}/img/eventdefault1.png` // Default image
                      }
                      className="img-fluid event-img1"
                      style={{
                        maxWidth:'760px',
                        width: "100%",
                        maxHeight: "300px",
                        borderRadius: "10px",
                     
                      }}
                      alt="Event"
                    />
                         <div
  style={{
    borderRadius: "6px 7px 2px 4px",
    position: "absolute",
    top: "0px",
    right: "0px",
    color: "white",
    fontSize: "15px",
    fontWeight: "bold",
    backgroundColor: "#EE4266",
    padding: "5px",
  }}
>
  {calculateAgeAndBirthdayText(event.displayDate, event.isCancelled)}
</div>
                  </div>

                  {/* Map over events to display them dynamically */}

                  <h4 className="mt-3 " style={{ color: "black" }}>
                    {event.name}{" "}
                    {event.relation &&
                      event.date &&
                      getUpcomingBirthdayNumber(event.date)}{" "}
                    {event.eventType}
                  </h4>

                  {/* Tabs */}
                  <ul className="nav nav-tabs mt-3 ulmain">
                    {["details", "wishlist", "guests", "history"].map((tab) => (
                      <li className="nav-item" key={tab}>
                        <button
                          className={`nav-link ${
                            activeTab === tab
                              ? "active text-danger fw-bold"
                              : ""
                          }`}
                          onClick={() => setActiveTab(tab)}
                        >
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                      </li>
                    ))}
                  </ul>

                  {/* Tab Content */}
                  <div className="tab-content mt-3 bg-white">
                    {activeTab === "details" && (
                      <>
                        <p className="d-flex align-items-center gap-2 mb-2">
                          <div className="calender-icon">
                            <FontAwesomeIcon
                              icon={faCalendarAlt}
                              style={{ color: "#ff3366", fontSize: "20px"  }}
                            />
                          </div>
                          {event.displayDate
                            ? formatDateWithCurrentYear(
                                event.displayDate,
                                event.date,
                                event.eventDate
                              )
                            : "Date not available"}
                        </p>

                        <p className="d-flex align-items-center gap-2">
                          <span className=" text-white   location-icon">
                            <FontAwesomeIcon
                              icon={faLocationDot}
                              style={{ color: "#ff3366",margin:'3px' }}
                            />
                          </span>
                          {event.location || "Location not available"}
                        </p>
                        <br />

                        <div className="about-event">
                          <div className="headersevent">
                            <h5>About event</h5>
                          </div>
                          <div className="aboutevent2">{event.description}</div>
                        </div>
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
                        <div>
                          <div className="wishlist-items">
                            {wishlist.length > 0 ? (
                              wishlist.map((item) => (
                                <div key={item._id} className="row">
                                  <div
                                    className="col-lg-4 col-md-6 col-sm-12"
                                    style={{ marginBottom: "8px" }}
                                  >
                                    <div
                                      className="card"
                                      style={{
                                        backgroundImage: `url(${process.env.REACT_APP_BASE_URL}/${item.imageUrl})`,
                                        position: "relative",
                                        backgroundRepeat: "no-repeat",
                                        backgroundSize: "cover",
                                        borderadius:'20px'
                                      }}
                                    >
                                      <div
                                        className="card-img-top"
                                        style={{ height: "161px" }}
                                      >
                                        {/* ✅ Dynamically Display Image */}
                                        {/* <img
                            src={`${process.env.REACT_APP_BASE_URL}/${item.imageUrl}`}
                            alt={item.giftName}
                            className="img-fluid"
                            style={{ height: "100%", width: "100%", objectFit: "cover" }}
                          /> */}
                                        {/* <div className="d-flex justify-content-end m-2">
                            <p className="card-text status d-flex justify-content-center" style={{ background: "cornsilk" }}>
                              {item.status}
                            </p>
                          </div> */}

                                        <div className="card-body cards11">
                                          <div className="row align-items-center">
                                            {/* Left - Image */}
                                            <div className="col-2">
                                              <img
                                                src={
                                                  event.newimage &&
                                                  event.newimage !== "null" &&
                                                  event.newimage !==
                                                    `${process.env.REACT_APP_BASE_URL}/null`
                                                    ? `${process.env.REACT_APP_BASE_URL}/${event.image}`
                                                    : event.image &&
                                                      event.image !== "null" &&
                                                      event.image !==
                                                        `${process.env.REACT_APP_BASE_URL}/null`
                                                    ? `${process.env.REACT_APP_BASE_URL}/${event.image}`
                                                    : `${process.env.PUBLIC_URL}/img/defaultUser1.png`
                                                }
                                        
                                                style={{height:'43px',width:'43px',borderRadius:'50%',objectFit:'cover'}}
                                              />

<div
  style={{
    borderRadius: "2px 5px 2px 10px",
    position: "absolute",
    top: "5px",
    right: "5px",
    color: "white",
    fontSize: "15px",
    fontWeight: "bold",
    backgroundColor: "#EE4266",
    padding: "5px",
  }}
>
  {calculateAgeAndBirthdayText(events.displayDate)}
</div>
                                            </div>

                                            {/* Middle - Info */}
                                            <div className="col-7">
                                              <h6
                                                className="card-title "
                                                style={{ color: "black", marginBottom:'0px' }}
                                              >
                                                {item.giftName}
                                              </h6>
                                              <p className="">
                                                {event.name}
                                              </p>
                                              <p
                                                className="card-text text-secondary"
                                                style={{ fontSize: "12px" }}
                                              >
                                                {item.description}
                                              </p>
                                            </div>

                                            {/* Right - Price and Edit */}
                                            <div
                                              className="col-3 d-flex flex-column align-items-end justify-content-between"
                                              style={{ height: "100%" }}
                                            >
                                              <p
                                                className="card-text "
                                                style={{
                                                  color: "#ff3366",
                                                  fontWeight: "600",
                                                }}
                                              >
                                                ${item.price}
                                              </p>

                                              <div
                                                style={{
                                                  fontWeight: "500",
                                                  cursor: "pointer",
                                                }}
                                                onClick={() => {
                                                  setSelectedWishlist(item);
                                                  setshoweditWishlistModal(
                                                    true
                                                  );
                                                }}
                                              >
                                                Edit
                                              </div>
                                             
                                              {/* <div
                                                style={{
                                                  display: "flex",
                                                  justifyContent: "end",
                                                
                                                }}
                                                
                                              >
                                                <img
                                                  src={`${process.env.PUBLIC_URL}/img/Group 33582.svg`}
                                                 
                                                />
                                              </div> */}
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
                                <p>No wishlist </p>
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
                        <div className="text-center mt-4">
                          <button
                            className="btn  w-30 d-flex "
                            onClick={() => setShowWishlistModal(true)}
                            style={{
                              background: "#EE4266",
                              alignItems: "center",
                              justifyContent: "center",
                              margin: "auto",
                              borderRadius: "15px",
                              width: "75%",
                              color: "white",
                            }}
                          >
                            ADD WISHLIST{" "}
                            <FaArrowRight
                              className="ms-2"
                              style={{
                                color: "#ff3366",
                                background: "white",
                                fontSize: "24px",
                                borderRadius: "50%",
                                padding: "3px",
                              }}
                            />
                          </button>
                        </div>
                      </div>
                    )}

                    {activeTab === "guests" && (
                      <div>
                        {guest && guest.length > 0 ? (
                          <>
                            <ul
                              className="guestlist"
                              style={{ padding: "0px " }}
                            >
                              {guest.map((g) => (
                                <li key={g._id} style={{ marginBottom: "3px" }}>
                                  <div
                                    key={g.id}
                                    className=" d-flex gap-3 align-items-center"
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        gap: "8px",
                                        width: "70%",
                                      }}
                                    >
                                      <img
                                        src={
                                          g.profileImage
                                            ? `${process.env.REACT_APP_BASE_URL}/${g.profileImage}`
                                            : `${process.env.PUBLIC_URL}/img/defaultUser.png`
                                        }
                                        height="40px"
                                        width="40px"
                                        style={{
                                          border: "2px solid",
                                          borderRadius: "50%",
                                        }}
                                        // Added meaningful alt text
                                      />

                                      <p
                                        style={{
                                          fontSize: "22px",
                                          marginBottom: "0px",
                                          fontWeight: "500",
                                        }}
                                      >
                                        {g.name}
                                      </p>
                                    </div>

                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "end",
                                        width: "30%",
                                      }}
                                    >
                                      <span style={{}}> {g.status}</span>
                                    </div>
                                  </div>

                                  {/* <p
              style={{
                border: "1px solid #ff3366",
                maxWidth: "28%",
                padding: "3px",
                margin: "3px",
              }}
            >
              {g.fullName}
            </p> */}
                                </li>
                              ))}
                            </ul>

                            <br />
                            <br />
                            <br />
                            {/* ADD MORE and START CHAT buttons when guests are available */}
                            <div
                              className="text-center mt-4 d-flex "
                              style={{ justifyContent: "space-evenly" }}
                            >
                              <InviteButton
                                onInviteSuccess={fetchGuest}
                                style={{
                                  borderRadius: "5px",
                                  width: "38%",

                                  color: "white",
                                  fontSize: "12px",
                                  padding: "12px 0px", // Custom background color
                                }}
                              >
                                ADD MORE
                              </InviteButton>

                              <button
                                className="btn   d-flex align-items-center justify-content-center"
                                style={{
                                  fontSize: "12px",
                                  background: "#EE4266",
                                  width: "35%",
                                  color: "white",
                                  gap: "10px",
                                }}
                                onClick={handleStartChat} // Define this function to start chat
                              >
                                START CHAT{" "}
                                <FaArrowRight
                                  style={{
                                    color: "#ff3366",
                                    background: "white",
                                    fontSize: "24px",
                                    borderRadius: "50%",
                                    padding: "3px",
                                  }}
                                />
                              </button>
                            </div>
                          </>
                        ) : (
                          // Invite button only when there are no guests
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

                            <div className="invtebtn">
                              <InviteButton onInviteSuccess={fetchGuest}>
                                {" "}
                                Invite{" "}
                                <FaArrowRight
                                  style={{
                                    color: "#ff3366",
                                    background: "white",
                                    fontSize: "24px",
                                    borderRadius: "50%",
                                    padding: "3px",
                                  }}
                                />
                              </InviteButton>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {activeTab === "history" && (
                      <div className="container mt-5">
                        {surpriseData.length === 0 ? (
                          <div>
                            <br />
                            <br />
                            <p className=" p-history">No History </p>
                            <br />
                          </div>
                        ) : (
                          surpriseData.map((event, index) => (
                            <div key={index} className="card mb-3 history-card">
                              <div className="row g-0">
                                {/* Event Image */}
                                <div className="col-md-3">
                                  <img
                                    src={
                                      event.imageUrl || "/img/placeholder.jpg"
                                    }
                                    className="img-fluid event-image"
                                    alt={event.name}
                                  />
                                </div>
                                {/* Event Details */}
                                <div className="col-md-9">
                                  <div className="card-body">
                                    <h5 className="card-title" style={{marginBottom:'0px'}}>{event.name}</h5>
                                    <p className="event-date">
                                      📅{" "}
                                      {new Date(
                                        event.eventDate
                                      ).toLocaleDateString()}
                                    </p>
                                    {/* Wishlist Preview */}
                                    <div className="wishlist-preview">
                                      {(event.wishlist || [])
                                        .slice(0, 3)
                                        .map((item, i) => (
                                          <img
                                            key={i}
                                            src={item.image}
                                            alt="wishlist"
                                          />
                                        ))}
                                      {(event.wishlist || []).length > 3 && (
                                        <button className="btn btn-outline-danger btn-sm">
                                          View Full Wishlist
                                        </button>
                                      )}
                                    </div>

                                    <div className="guest-section">
                                      {(event.guests || [])
                                        .slice(0, 3)
                                        .map((guest, i) => (
                                          <img
                                            key={i}
                                            src={guest.profileImage}
                                            className="guest-img"
                                            alt="guest"
                                          />
                                        ))}
                                      <span className="guest-count">
                                        {(event.guests || []).length} guests
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>Loading event details...</p>
            )}
          </div>

          {/* Wishlist Modal */}
          {showWishlistModal && (
            <WishlistModal
              eventId={eventId}
              setShow={setShowWishlistModal} // ✅ Make sure this is correctly passed
              fetchWishlist={fetchWishlist}
            />
          )}

          <InviteModal
            show={showGuestModal}
            setShow={setGuestModal}
            setActiveTab={setActiveTab}
          />
          <EditEventModal
            show={showEditModal}
            setShow={setShowEditModal}
            event={events[0]} // Pass the specific event
            setEvent={setEvents}
            fetchevent={getEvent} // Pass fetchWishlist as a prop
          />

          <WishlistEditModal
            show={showeditWishlistModal}
            setShow={setshoweditWishlistModal}
            wishlist={selectedWishlist}
            fetchWishlist={fetchWishlist}
          />
        </div>
      </section>
    </>
  );
};

export default EventDetails;
