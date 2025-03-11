import React from "react";
import Slider from "react-slick"; // Importing Slick Slider
import { Button, Card } from "react-bootstrap";
import Footer from "./Footer";
import Navbar from "./navbar";
// Static image for events and invitations
import Header from "./Header";
import { useNavigate } from "react-router-dom";

import { useEffect,useState } from "react";
import axios from "axios";
import FooterNavBar from "./TabFooter";
import FloatingActionButton from "./Floating Plus/FloatingTab";
import Eventlst from "./home/Eventlst";
import Invitationlst from "./home/Invitationlst";
import './Home.css'
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { FaSearch} from "react-icons/fa";
import '../components/Hedaer.css'




const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [innvitations,setInvitations]=useState([])
  const userId=localStorage.getItem("user.id")
  const [error, setError] = useState(null);
  const [value, setValue] = React.useState('1');
  const [filteredEvents, setFilteredEvents] = useState([]);
    const [data, setData] = useState([]);
    console.log(results,"results of the result current state")
  const navigate=useNavigate();
  // const [daysLeft, setDaysLeft] = useState(null);
  // const [eventDate, setEventDate] = useState("");
  const fetchEvents = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated.");
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/events`, config);
      
      // Format the event date using moment.js
      const formattedEvents = response.data.map((event) => ({
        ...event,
        formattedDate: moment(event.date).format("MMMM Do YYYY, h:mm:ss a"), // Format date
      }));
      
      // Process the response data here
      setEvents(formattedEvents);
      setFilteredEvents(response.data.data);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Failed to fetch events.");
    }
  };

  // Fetch invitations
  const fetchInvitations = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated.");
      return;
    }

    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/invitations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Format the invitation date using moment.js
      const formattedInvitations = response.data.map((invitation) => ({
        ...invitation,
        formattedDate: moment(invitation.date).format("MMMM Do YYYY, h:mm:ss a"), // Format date
      }));
      
      setInvitations(formattedInvitations);
    } catch (error) {
      console.error("Error fetching invitations:", error);
      setError("Failed to fetch invitations.");
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchEvents();
    fetchInvitations();
  }, []);

    // Fetch invitation when component is mounted or `eventId` and `userId` change
  // Add eventId and userId to dependency array if they change
    
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim() !== "" || searchDate !== "") {
        console.log(searchDate)
        fetchSearchResults();
        console.log("Search query:", searchDate);
        console.log(results,'dtrwtr')
      } else {
        setResults([]); // Clear results if input is empty
      }
    }, 500); // 500ms debounce time

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, searchDate]);
  const fetchSearchResults = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/search?query=${searchQuery}&date=${searchDate}`,
        {
          headers: { Authorization: `Bearer ${token}` } // ✅ Headers inside config object
        }
      );
  console.log(res.data.results,"res.data.results")
      setResults(res.data.results);
      console.log("Search results:", res.data.results);
    } catch (error) {
      console.error("Search error:", error);
    }
    setLoading(false);
  };
  
  const handleResultClick = (item) => {
    const eventId = item.id;
    if (item.type === "Event") {
      window.location.href = `/plandetails/${eventId}`; // Redirect to event details
    } else if (item.type === "Invitation") {
      window.location.href = `/invitation-detail/${eventId}`; // Redirect to invitation details
    }
  };

const handleAllevent=()=>{
  navigate("/plandetails/${eventId}")
}

const handleAllinvitation=()=>{
  navigate(`/invitationdetails/${eventId}`); // Correct usage of template literals

}
  // Slider settings for events (left to right direction)
  const eventSliderSettings = {
    
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 2000,
    centerMode: true,
  
    focusOnSelect: true,
    responsive: [
      {
        breakpoint: 1385,
        settings: {
          slidesToShow: 3,
          centerMode:true
        }
      },
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 3,
          centerMode: false
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          centerMode: false
        }
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          centerMode: false
        }
      }
    ]
  };


  // Slider settings for invitations (right to left direction)
  const invitationSliderSettings = {
    arrow:true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    centerMode: true,
    focusOnSelect: true,
    rtl: true, // Right to Left direction for invitations
    responsive: [
      {
        breakpoint: 1385,
        settings: {
          slidesToShow: 3,
          centerMode:true
        }
      },
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 3,
          centerMode: false
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          centerMode: false
        }
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          centerMode: false
        }
      }
    ]
  };
  
    const handlePlans = (eventId) => {
      navigate(`/plandetails/${eventId}`); // Navigate with event ID
    };
  
  // const handleinvitation=()=>{
  //   navigate('/invitationdetails/${eventId}')
  // }
  const handlefavourite=()=>{
    
  }

  // const filterItem = (toSearch) => {
  //   if(value == 1){
  //     const filtered = events.filter(
  //       (event) =>
  //         event.name.toLowerCase().includes(toSearch) || event.date.includes(toSearch)
  //     );
  //     setFilteredEvents(filtered);
  //   }
  //   if(value == 2){
  //     const filtered = innvitations.filter(
  //       (event) =>
  //         event.name.toLowerCase().includes(toSearch) || event.date.includes(toSearch)
  //     );
  //     setFilteredEvents(filtered);
  //   }
  // }

  // const filterItem = (data) => {
  //   const filtered = data.filter(
  //           (event) =>
  //             event.name.toLowerCase().includes(searchQuery) || event.date.includes(searchQuery)
  //         );
  // }
  
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
    const handleSearch = (e) => {
      const query = e.target.value.toLowerCase();
      setSearchQuery(query);
      filterItem(searchQuery)
    }
   
  return (
    <>
    <section className="page-controls">
    <Header/>
      <Navbar />

      <div className="mobileMode">
      <div className="d-flex">
        <div className="SearLast p-1" style={{ width: "100%" }}>
          <div className="d-flex searchbarw justify-content-between">
            <input
              type="text"
              value={searchQuery}
              placeholder="Find events or invitations"
              className="text-mute inputhome"
              style={{ width: "100%", height: "30%" }}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <input
              type="date"
              value={searchDate}
              className="text-mute inputhome"
              onChange={(e) => setSearchDate(e.target.value)}
              style={{ marginLeft: "10px", padding: "5px" }}
            />
            {/* <FaSearch className="me-3 text-muted" style={{ fontSize: "1.5rem", fill: "#FF3366" }} /> */}
          </div>
        </div>
      </div>

      {/* SEARCH RESULTS */}
      {searchQuery && (
        <div
          className="search-results"
          style={{
            position: "absolute", // Position above the tabs
            top: "121px", // Adjust as per your design
            width: "90%",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            margin:'0px 5px -2px 6px',
            backgroundColor: "#FFEFF3",
            borderRadius: "30px",
            maxHeight: "200px", // Set a max height for the search results container
            overflowY: results.length > 5 ? "auto" : "unset", // Enable scrolling if more than 5 results
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            zIndex: 1000, // Ensure it's on top of other elements
            padding: "10px",
          }}
        >
          {loading ? (
            <p>Loading...</p>
          ) : (
            results.map((item, index) => (
              <div
                key={index}
                className="search-result-item"
                onClick={() => handleResultClick(item)}
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #ddd",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <p>{item.name} <span style={{ fontSize: "0.8rem", color: "#888" }}>({item.type})</span></p>
                
              </div>
            ))
          )}
        </div>
      )}

      {/* TABS */}
      <div style={{ position: "relative" }}>
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider", backgroundColor: "" }}>
              <TabList
                onChange={handleChange}
                aria-label=" "
                style={{
                  backgroundColor: "#FFEFF3",
                  borderRadius: "40px",
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <Tab className="btn1" label="My events" value="1" />
                <Tab className="btn1" label="Invitation" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <Eventlst searchQuery={searchQuery} />
            </TabPanel>
            <TabPanel value="2">
              <Invitationlst searchQuery={searchQuery} />
            </TabPanel>
          </TabContext>
        </Box>
      </div>
    </div>
<div className="position-relative" >
      {/* Event Slider */}
      <div className="  homemain">
        <div className="heading-control"><h2 className="" style={{ color: "#FF3366" }}>Upcoming Events</h2> 
        <div style={{display:"flex" ,justifyContent:"center",alignItems:"center", position:"absolute", top:"0px", right:"0px"}}>
        <button className="buttonevent"  style={{backgroundColor:"#fff",border:"0.5px solid #ff3366",color:"#ff3366",padding:"5px 10px",borderRadius:"6px",fontWeight:"500"}} onClick={handleAllevent}> <img   src={`${process.env.PUBLIC_URL}/img/EyeIcon.svg`} alt="view" /> ALL </button></div></div>
        <Slider {...eventSliderSettings} style={{ height: "250px" }} > {/* Minimized height */}
          {events.map((event, index) => (
            <div key={index} style={{ gap: "30px", display: "flex", justifyContent: "center" }}>
              <Card style={{  width: "100%", minWidth:"310px",     border: "0.5px solid rgb(229 229 229)", borderRadius: "10px"}}>
                <div style={{height:"150px"}}><Card.Img variant="top"        src={`${process.env.PUBLIC_URL}/img/SplashScreen3.png`} style={{ width:"100%" , height:"100%",objectFit:"contain"}} /></div>
                <Card.Body>
                <Card.Title>{event.eventType}</Card.Title>
                  <Card.Title>{event.fullName}</Card.Title>
                  <Card.Text className="d-flex justify-content-between" style={{
                    gap:"10px"
                  }}>
                <div className="d-flex" >  <img className="m-0.5" src={`${process.env.PUBLIC_URL}/img/calender.svg`} height={"17px"}/>
                    <h6 className="">{event.formattedDate}</h6></div>
                    <div className="eventperson"> 
                    
                    </div>
                  </Card.Text>
                  <Card.Text>
                    <small className="text-muted">Days Left: {event.daysLeft}</small>
                  </Card.Text>
                 <div style={{display:"flex", gap:"8px"}}>
                  <Button variant="danger" style={{height:"34px", backgroundColor: "#FF3366", width:"100%",   
    borderBottomRightRadius:'0px',
    borderTopLeftRadius:'5px',borderTopRightRadius:'0px',borderBottomLeftRadius:"5px",
 padding:"0px" }} onClick={()=>handlePlans(event._id)}>
                    Plan And Celebrate
                  </Button>
                 <div className="heartimage " style={{backgroundColor:"#FF3366",padding:"5px",width: "40px", height: "34px", display: "flex",alignItems: "center",justifyContent:"center",borderBottomRightRadius:'5px',
    borderTopLeftRadius:'0px',borderTopRightRadius:'5px',}}>
                 <img  src={`${process.env.PUBLIC_URL}/img/Hearticon.svg`} alt="wishlist" style={{width: "26px", height: "20px",}} onClick={handlefavourite}/></div>
                 </div>
                </Card.Body>
              </Card>
            </div>
          ))}
        </Slider>
      </div>
     
<br/>
</div>
      {/* Invitation Slider */}
      {/* <div className="container py-4 homemain">
    
      <div className="heading-control"><h2 className="" style={{ color: "#FF3366" }}>Upcoming Events</h2> 
        <div style={{display:"flex" ,justifyContent:"center",alignItems:"center", position:"absolute", top:"0px", right:"0px"}}>
        <button className="buttonevent"  style={{backgroundColor:"#fff",border:"0.5px solid #ff3366",color:"#ff3366",padding:"5px 10px",borderRadius:"6px",fontWeight:"500"}} onClick={handleAllevent}> <img src={eye} alt="view" /> ALL </button></div></div>
      
        <Slider {...invitationSliderSettings} > 
          {innvitations.map((invitation, index) => (
            <div key={index} style={{ gap: "15px", display: "flex", justifyContent: "center" }}>
              <Card style={{ width: "100%", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", border: "2px solid#e0e0e0", borderRadius: "10px" }}>
                <Card.Img variant="top" src={image1} style={{ height: "150px", objectFit: "contain" }} />
                <Card.Body>
                  <Card.Title>{invitation.fullName}</Card.Title>
                  <Card.Title>{invitation.eventType}</Card.Title>
                  <Card.Text>
                    <small className="text-muted">Date: {invitation.formattedDate}</small>
                  </Card.Text>
                  <Card.Text>
                    <small className="text-muted">{invitation.daysLeft}</small>
                  </Card.Text>
                  
                  <Button variant="danger" style={{ backgroundColor: "#FF3366" }} onClick={handleinvitation}>
                    All
                  </Button>
                </Card.Body>
              </Card>
            </div>
          ))}
        </Slider>
        
      </div> */}
     
      <div className="tabnav">
<FooterNavBar/></div>
<div className="floating-action"><FloatingActionButton/></div>
      {/* <Footer /> */}
      </section>
    </>
  );
};

export default HomePage;
