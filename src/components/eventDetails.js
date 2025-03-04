import React, { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { FaEllipsisV, FaShareAlt, FaArrowRight } from "react-icons/fa";
import "./Eventdetails.css";
import Footer from "./Footer";
import Header from "./Header";
import Navbar from "./navbar";
import WishlistModal from "./Wishlist/addWishlist";
import InviteModal from "./GuestInvite/GuestModal";
import EditEventModal from "./Events/eventModal";
import axios from "axios";
import { useParams } from "react-router-dom";
import InviteButton from "./userview/Invitetest";
import { useNavigate } from "react-router-dom";
import WishlistEditModal from "./Wishlist/wishlistModal";

const EventDetails = () => {
  const [activeTab, setActiveTab] = useState("details");
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [guest,setGuest]=useState([])
  console.log("showWishlistModal", showWishlistModal);
  const [showGuestModal, setGuestModal] = useState(false);
  const [showeditWishlistModal,setshoweditWishlistModal]=useState(false)
  const [wishlist, setWishlist] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedWishlist, setSelectedWishlist] = useState(null);
  const token = localStorage.getItem("token");
  const { eventId } = useParams(); // Get eventId from URL parameters
  console.log(eventId)
  const navigate=useNavigate();
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

  
  const formatDateWithCurrentYear = (dateString) => {
    if (!dateString) return "Invalid Date";
    const eventDate = new Date(dateString);
    const currentYear = new Date().getFullYear();
    
    // Set event year to current year
    eventDate.setFullYear(currentYear);

    return eventDate.toLocaleDateString("en-GB"); // "DD/MM/YYYY"
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
  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchGuest = async () => {
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

    fetchGuest();
  }, []);

const  getEvent = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/events/${eventId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = response.data.data; // Response contains data object
        console.log(data);
        setEvents([data]); // Store single event in array
      } catch (error) {
        console.log("Error while fetching event:", error);
      }
    };
    useEffect(()=> {
      getEvent()
    },[eventId])



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
      title: event.title,
      text: `Check out this event: ${event.title}`,
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
  
  return (
    <>
      <section className="page-controls" style={{ padding: "0" }}>
        <Header />
        <Navbar />
        <div>
          <div className="container mt-4">
            {/* Header Section */}
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="fw-bold">Event Details</h4>
              <div className="d-flex align-items-center">
                <FaShareAlt className="me-3 fs-5" onClick={handleShare}/>
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
                    <Dropdown.Item className="text-danger">
                      Cancel Event
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
            {events.length > 0 ? (
              events.map((event) => (
                <div key={event._id}>
            {/* Event Image */}
            <div>
            <img 
  src={
    event.image && event.image !== "null" && event.image !== `${process.env.REACT_APP_BASE_URL}/null`
      ? `${process.env.REACT_APP_BASE_URL}/${event.image}`
      : `${process.env.PUBLIC_URL}/img/eventdefault.png`
  }
  alt="event"
  className="img-fluid"
  style={{ width: "100%", height: "300px", objectFit: "cover", borderRadius: "10px" }} 
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
                  <div className="tab-content p-3 mt-3 border rounded shadow-sm bg-white">
                    {activeTab === "details" && (
                      <>
                        <p className="d-flex align-items-center">
                          <span className="bg-danger text-white p-2 rounded me-2">
                            📅
                          </span>
                          {formatDateWithCurrentYear(event.date) ||
                            "Date not available"}
                        </p>
                        <p className="d-flex align-items-center">
                          <span className="bg-danger text-white p-2 rounded me-2">
                            📍
                          </span>
                          {event.location || "Location not available"}
                        </p>
                        <div className="text-center mt-4">
                          <button className="btn btn-danger w-25 d-flex align-items-center justify-content-center">
                            SAVE <FaArrowRight className="ms-2" />
                          </button>
                        </div>
                      </>
                    )}

                    {activeTab === "wishlist" && (
        <div >
        <div style={{display:"flex",justifyContent:"space-between"}}>
          <h5>🎁 Wishlist</h5>
          <h5>Show All</h5>
          </div>
          <div>
            <div className="wishlist-items">
              {wishlist.length > 0 ? (
                wishlist.map((item) => (
                  <div key={item._id} className="row">
                    <div className="col-lg-4 col-md-6 col-sm-12" style={{marginBottom:"8px"}}>
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
                              </p> <div style={{display:'flex',justifyContent:'end'}}    onClick={() => {
      setSelectedWishlist(item); // Pass the selected wishlist item
        setshoweditWishlistModal(true);
    }}>edit</div>
                            </div>
                            <div className="d-flex justify-content-between">
                              <p className="card-text text-secondary m-1 p-main" 
             style={{fontSize:'12px'}}
                              >
                                {item.description}
                              </p>
                              <img  src={`${process.env.PUBLIC_URL}/img/Group 33582.svg`} alt="svg" />
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
          <div className="text-center mt-4">
            <button
              className="btn btn-danger w-30 d-flex "
              onClick={() => setShowWishlistModal(true)} 
              style={{alignItems:'center',justifyContent:'center',width:"70%",position:'fixed',bottom: "20px",
    left: "50px"}}
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

  {guest && guest.length > 0 ? (
    <>
      <ul>
        {guest.map((g) => (
          <li key={g._id}>
          <div style={{display:'flex',justifyContent:'space-between'}}>
           <span style={{}}> {g.name}</span><span>
            {g.status}</span>
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
      
      {/* ADD MORE and START CHAT buttons when guests are available */}
      <div className="text-center mt-4 d-flex">
        <InviteButton/>

        <button
          className="btn btn-success w-25 d-flex align-items-center justify-content-center"
          style={{ fontSize: "12px" }}
          onClick={handleStartChat} // Define this function to start chat
        >
          START CHAT
        </button>
      </div>
    </>
  ) : (
    // Invite button only when there are no guests
    <div className=" mt-4">
    <InviteButton/>
    </div>
  )}
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
