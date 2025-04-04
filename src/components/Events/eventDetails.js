import React, { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { FaEllipsisV, FaShareAlt, FaArrowRight } from "react-icons/fa";
import "./Eventdetails.css";

import WishlistModal from "../Wishlist/addWishlist";
import InviteModal from "../GuestInvite/GuestModal";
import EditEventModal from "./eventModal";
import axios from "axios";
import { useParams } from "react-router-dom";
import InviteButton from "../userview/Invitetest";
import { useNavigate } from "react-router-dom";
import WishlistEditModal from "../Wishlist/wishlistModal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { Spinner } from "react-bootstrap";


const EventDetails = () => {
  const [activeTab, setActiveTab] = useState("details");
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [guest, setGuest] = useState([])
  console.log("showWishlistModal", showWishlistModal);
  const [showGuestModal, setGuestModal] = useState(false);
  const [showeditWishlistModal, setshoweditWishlistModal] = useState(false)
  const [wishlist, setWishlist] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedWishlist, setSelectedWishlist] = useState(null);
  const [pastevents,setPastEvents]=useState([])
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const { eventId } = useParams(); // Get eventId from URL parameters
  console.log(eventId)
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
              acc[item.eventId] = acc[item.eventId] || { ...item, wishlistItems: [] };
              acc[item.eventId].wishlistItems.push(item.wishlistItem);
              return acc;
            }, {})
          );
          setSurpriseData(uniqueEvents);
          setErrorMessage("");
        } else {
          setSurpriseData([]);
          setErrorMessage(response.data.message || "No surprise reveal for tomorrow.");
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

  useEffect(()=>{
    const fetchHistory=async()=>{
    try{
      const response=await axios.get(`${process.env.REACT_APP_BASE_URL}/history`,
        {
          headers: { Authorization: `Bearer ${token}` },
          }
          );
          setPastEvents(response.data.data);
          console.log(response.data.data);
          }
          catch(error){
            console.error("❌ Error while fetching history:", error);
            }
            }
            fetchHistory();
          },[eventId])

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
  
    return eventDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
    }) + ` ${currentYear}`; // Append the current year at the end
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
  const inviteguest=localStorage.getItem('invited')
  
    
    
    const fetchGuest = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/guests/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

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
          formattedDate: data.formattedDate // ✅ Convert year dynamically
        }
      ]);
      // Store single event in array
    } catch (error) {
      console.log("Error while fetching event:", error);
    }
    setLoading(false);
  };
  useEffect(() => {
    getEvent()
  }, [eventId])



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
      console.error("❌ Error starting chat:", error.response?.data || error.message);
    }
  };

  //   getEvent();
  const handleShare = () => {
    const shareData = {
      
      text: `Check out this event i am celeberating`,
      url: window.location.href,  // Share the current event page URL
    };

    if (navigator.share) {
      navigator.share(shareData)
        .then(() => console.log('Event shared successfully!'))
        .catch((error) => console.error('Error sharing:', error));
    } else {
      // Fallback for unsupported browsers: Copy link to clipboard
      navigator.clipboard.writeText(shareData.url);
      alert("Link copied to clipboard!");
    }
  };


  const handledeletevent=async()=>{
    try {
      const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}/delete-event/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status) {
       navigate('/home')

        console.log("deleted event ");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  if(loading) {
        return (
          <div style={{ display: "flex", justifyContent: "center",alignItems:'center', marginTop: "150px" }}>
            <Spinner animation="border" role="status" style={{ width: "10rem", height: "10rem" }} />
          </div>
        );
      }
  
  
  return (
    <>
      <section className="page-controls" style={{ padding: "0" }}>
       
     
        <div>
          <div className="container mt-4">
            {/* Header Section */}
            <div className="d-flex justify-content-between align-items-baseline">
      <div className="d-flex gap-2 align-items-baseline" >
            <FontAwesomeIcon icon={faArrowLeft}  onClick={() => navigate(-1)}/>

              <h4 className="fw-bold">Event Details</h4>
</div>
              <div className="d-flex align-items-center">
                <FaShareAlt className="me-3 fs-5" onClick={handleShare} />
                <Dropdown>
                  <Dropdown.Toggle
                    as="button"
                    className="btn btn-light border-0 p-2"
                  >
                    <FaEllipsisV />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setShowEditModal(true)}>
                      Edit Event
                    </Dropdown.Item>
                    <Dropdown.Item className="text-danger" onClick={handledeletevent}>
                      Cancel Event
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
            {events.length > 0 ? (
              events.map((event) => (
                <div key={event._id} style={{marginTop:'17px'}}>
                  {/* Event Image */}
                  <div   style={{ width: "100%", height: "174px", borderRadius: "10px" }}  >
                  <img
  src={
    event.newimage && event.newimage !== "null" && event.newimage !== `${process.env.REACT_APP_BASE_URL}/null`
      ? `${process.env.REACT_APP_BASE_URL}/${event.newimage}` // Priority to newimage
      : event.image && event.image !== "null" && event.image !== `${process.env.REACT_APP_BASE_URL}/null`
      ? `${process.env.REACT_APP_BASE_URL}/${event.image}` // Fallback to image
      : `${process.env.PUBLIC_URL}/img/eventdefault.png` // Default image
  }
  className="img-fluid event-img1"
  style={{ width: "550px", height: "174px", borderRadius: "10px" }}
  alt="Event"
/>


                  </div>


                  {/* Map over events to display them dynamically */}

                  <h2 className="mt-3 fw-bold">
                    {event.name}
                  </h2>

                  {/* Tabs */}
                  <ul className="nav nav-tabs mt-3">
                    {["details", "wishlist", "guests", "history"].map((tab) => (
                      <li className="nav-item" key={tab}>
                        <button
                          className={`nav-link ${activeTab === tab
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
                        <p className="d-flex align-items-center gap-2">
                        <div className='calender-icon'>
                        <FontAwesomeIcon icon={faCalendarAlt} style={{ color: "#ff3366", fontSize: "20px" }} />
</div>
                      {event.displayDate
  ? formatDateWithCurrentYear(event.displayDate, event.date,event.eventDate)
  : "Date not available"}
                        </p>


                        <p className="d-flex align-items-center">
                          <span className=" text-white p-2 rounded me-2 location-icon">
                          <FontAwesomeIcon icon={faLocationDot} style={{ color: "#ff3366" }} />

                          </span>
                          {event.location || "Location not available"}
                        </p>
                    
                    <div className='about-event'>
<div className='headersevent'>
                    <h5>About event</h5>
     </div>
                    <div className='aboutevent2'>
                    {event.description}
                    </div>

                    </div>

                      </>
                    )}

                    {activeTab === "wishlist" && (
                      <div >
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
               
                       
                        </div>
                        <div>
                          <div className="wishlist-items">
                          
                            {wishlist.length > 0 ? (
                              wishlist.map((item) => (
                                
                                <div key={item._id} className="row">
                                <h5> Wishlist</h5>
                                  <div className="col-lg-4 col-md-6 col-sm-12" style={{ marginBottom: "8px" }}>
                                    <div
                                      className="card"
                                      style={{
                                        backgroundImage: `url(${process.env.REACT_APP_BASE_URL}/${item.imageUrl})`,
                                        position: "relative",
                                        backgroundRepeat: "round",
                                        backgroundSize: "cover",
                                      }}
                                    >
                                      <div className="card-img-top" style={{ height: "226px" }}>
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

                                          <div className="d-flex justify-content-between" style={{ paddingTop: "11px" }}>
                                            <h6 className="card-title" style={{ color: "black" }}>
                                              {item.giftName}
                                            </h6>
                                            <p className="card-text" style={{ color: "#ff3366", fontWeight: "600" }}>
                                              ${item.price}
                                            </p> <div style={{ display: 'flex', justifyContent: 'end' }} onClick={() => {
                                              setSelectedWishlist(item); // Pass the selected wishlist item
                                              setshoweditWishlistModal(true);
                                            }}>edit</div>
                                          </div>
                                          <div className="d-flex justify-content-between">
                                            <p className="card-text text-secondary m-1 p-main"
                                              style={{ fontSize: '12px' }}
                                            >
                                              {item.description}
                                            </p>
                                            <img src={`${process.env.PUBLIC_URL}/img/Group 33582.svg`} alt="svg" />
                                          </div>
                                        </div>

                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              
                              <div className="no-wishlist">
                              <br/>
                              <br/>
                              <br/>
                              <br/>
                              <br/>
                              <br/>
                              <p>No wishlist found.</p>
                              <br/>
                              <br/>
                              <br/>
                              <br/>
                              <br/>
                              <br/>
                           </div>
                            )}
                          </div>
                        </div>
                        <div className="text-center mt-4">
                          <button
                            className="btn  w-30 d-flex "
                            onClick={() => setShowWishlistModal(true)}
                            style={{ background:'#EE4266',
                              alignItems: 'center', justifyContent: 'center', 
                              margin: "auto",borderRadius:'15px',width:'75%'
                          ,color:'white'}}
                          >
                            ADD WISHLIST <FaArrowRight className="ms-2" />
                          </button>
                        </div>
                      </div>
                    )}

                    {activeTab === "guests" && (
                      <div>
                

                        {guest && guest.length > 0 ? (
                          <>
                            <ul className="guestlist" style={{padding:'0px '}}>
                              {guest.map((g) => (
                                <li key={g._id}>
                                <div key={g.id} className="d-flex gap-3 align-items-center">
  <div style={{ height: '40px', width: '40px', borderRadius: '50%'}}>
    <img
      src={g.profileImage ? `${process.env.REACT_APP_BASE_URL}/${g.profileImage}` : `${process.env.PUBLIC_URL}/img/defaultUser.png`}
      height="40px"
      width="40px"
      style={{ border:'2px solid',borderRadius:'50%' }}
      alt={g.name ? `${g.name}'s profile` : "Default User Profile"} // Added meaningful alt text
    />
  </div>
  <p style={{fontSize:'22px',marginBottom:'0px'}}>{g.name}</p>
  <div style={{display:'flex',justifyContent:'end',width:'30%'}}>
 <span style={{ width: "100%",
    display: "flex",
    justifyContent: "end",
    alignItems: "end"}}> {g.status}</span>
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
<br/>
<br/>
<br/>
                            {/* ADD MORE and START CHAT buttons when guests are available */}
                            <div className="text-center mt-4 d-flex " style={{justifyContent:'space-evenly'}}>
                            <InviteButton onInviteSuccess={fetchGuest}
  style={{ 
    borderRadius: '5px', 
    width: '50%', 
    color:'white',
    fontSize:'12px',
    padding: "12px 0px" // Custom background color
  }}
>
  ADD MORE
</InviteButton>



                              <button
                                className="btn   d-flex align-items-center justify-content-center"
                                style={{ fontSize: "12px" ,background:'#EE4266',width:'35%',color:'white'}}
                                onClick={handleStartChat} // Define this function to start chat
                              >
                                START CHAT
                              </button>
                            </div>
                          </>
                        ) : (
                          
                          // Invite button only when there are no guests
                          <div className=" mt-4">
                         
                          <div className="notinvited">
                          <br/>
                          <br/>
                       
              
                         
                            No Guest Invited
                          </div>
                      
                          <br/>
                  
                          <br/>
                          <br/>
                          <br/>
                         
                          
                          <div className="invtebtn">
                            <InviteButton onInviteSuccess={fetchGuest}> Invite  
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
      <br/>
      <br/>
      <p className=" p-history" >No History </p>
      <br/>
    </div>
    ) : (
      surpriseData.map((event, index) => (
        <div key={index} className="card mb-3 history-card">
          <div className="row g-0">
            {/* Event Image */}
            <div className="col-md-3">
              <img
                src={event.imageUrl || "/img/placeholder.jpg"}
                className="img-fluid event-image"
                alt={event.name}
              />
            </div>
            {/* Event Details */}
            <div className="col-md-9">
              <div className="card-body">
                <h5 className="card-title">{event.name}</h5>
                <p className="event-date">📅 {new Date(event.eventDate).toLocaleDateString()}</p>
                {/* Wishlist Preview */}
                <div className="wishlist-preview">
                  {(event.wishlist || []).slice(0, 3).map((item, i) => (
                    <img key={i} src={item.image} alt="wishlist" />
                  ))}
                  {(event.wishlist || []).length > 3 && (
                    <button className="btn btn-outline-danger btn-sm">
                      View Full Wishlist
                    </button>
                  )}
                </div>

                <div className="guest-section">
                  {(event.guests || []).slice(0, 3).map((guest, i) => (
                    <img key={i} src={guest.profileImage} className="guest-img" alt="guest" />
                  ))}
                  <span className="guest-count">{(event.guests || []).length} guests</span>
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
              setShow={setShowWishlistModal}  // ✅ Make sure this is correctly passed
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
