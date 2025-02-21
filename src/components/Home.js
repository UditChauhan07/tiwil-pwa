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
  const [innvitations,setInvitations]=useState([])
  const userId=localStorage.getItem("user.id")
  const [error, setError] = useState(null);
  const [value, setValue] = React.useState('1');
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
    

const navigate=useNavigate();
const handleAllevent=()=>{
  navigate("/events")
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
  
  const handleinvitation=()=>{
    navigate('/invitationdetails/${eventId}')
  }
  const handlefavourite=()=>{
    
  }

  
  
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
  return (
    <>
    <section className="page-controls">
    <Header/>
      <Navbar />

      <div className="mobileMode">
<div className="d-flex">
    <div className="SearLast p-1"  style={{width:"100%"}}>
            <div className=" d-flex searchbarw justify-content-between">
              <input
                type="text"
                placeholder="Find amazing events"
                className="text-mute"
                style={{ width: "100%",height:'30%' }}
              />
              <FaSearch className="me-3 text-muted" style={{ fontSize: "1.5rem", fill: "#FF3366"}} />
            </div>
            <img src={`${process.env.PUBLIC_URL}/img/filterIcon.svg`} alt="filterIcon"/>
            
            </div>
</div>
<div>
      <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label=" " style={{backgroundColor:"#FFEFF3",borderRadius:'40px',display:"flex",justifyContent:'space-between',marginBottom:'10px'}}>
            <Tab className="btn1" label="My events" value="1" />
            <Tab  className="btn1" label="Invitation" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">{<Eventlst/>}</TabPanel>
        <TabPanel value="2">{<Invitationlst/>}</TabPanel>
      
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
      <Footer />
      </section>
    </>
  );
};

export default HomePage;
