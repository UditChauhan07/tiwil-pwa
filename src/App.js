import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import SignIn from "./components/Signin";
import SignUp from "./components/SignUp";
import Events from "./components/Eventlist";  // Protected Page
// import Invitations from "./components/Invitations"; // Protected Page
import PrivateRoute from "./components/Authentication/Privateroute";
import Profile from "./components/Profile/UserProfile";
import Dashboard from "./components/Dashboard/Dashboard"
import Home from "./components/Home";
import AddInformation from "./components/AdditionalInfo";
import Starting from "./components/OnbaordingScreen/Starting";
import LabTabs from "./components/Tabbingplans/Planandclebs";
import EventDetails from "./components/eventDetails";
import WishlistForm from "./components/Wishlist/addWishlist";
import HomePage from "./components/Home";
import { useState,useEffect } from "react";
import UserEventSection from "./components/userview/userEventsection";
import NotificationList from "./components/Notifications/Notification";
import WishlistDetails from "./components/userview/wishlistDetails";
import PoolingWish from "./components/Pooloptions/Createpool";
import MyProfile from "./components/Profile/Myprofile";
import FamilyList from "./components/Profile/Familyinfo";
import LoginPage from "./components/Login";
import InvitationList from "./components/InvitationList";
import InvitePag from "../src/components/InvitPage";
import Account from "./components/Account";
import FamilyInformation from "./components/FamilyInformation";
import ChatApp from "./components/Chat";

function App() {
  
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstallDialog, setShowInstallDialog] = useState(false);
  
    useEffect(() => {
      const handler = (event) => {
        event.preventDefault();
        setDeferredPrompt(event);
        setShowInstallDialog(true);
      };
  
      window.addEventListener("beforeinstallprompt", handler);
  
      return () => {
        window.removeEventListener("beforeinstallprompt", handler);
      };
    }, []);
  
    const handleInstallClick = () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === "accepted") {
            console.log("User accepted the PWA install");
          } else {
            console.log("User dismissed the PWA install");
          }
          setDeferredPrompt(null);
          setShowInstallDialog(false);
        });
      }
    };

  return (
    <>
     <div style={{ textAlign: "center" }}>
   
    
      {showInstallDialog && (
        <div style={{ position: "fixed", top: "20%", left: "50%", transform: "translate(-50%, -50%)", padding: "20px", background: "white", boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)", borderRadius: "10px" }}>
       
          <button onClick={handleInstallClick} style={{ padding: "10px", fontSize: "16px" }}>
            Add to Home Screen
          </button>
        </div>
      )}
    </div>
    <Router>
      <Routes>
      <Route path="/" element={<Starting/>}></Route>
<Route path="/signin" element={<SignIn/>}></Route>
        {/* Public Routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<HomePage/>}/>
        {/* Private Routes (Protected) */}
        <Route element={<PrivateRoute />}>
          
        <Route path="/profile" element={<Profile/>}></Route>
          {/* <Route path="/invitations" element={<Invitations />} /> */}
        </Route>
    
        <Route path="/events" element={<Events />} />
        <Route path="/event/:id" element={<EventDetails/>} />
        {/* Default Route */}
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/additionalinfo" element={<AddInformation/>} />
        <Route path="/plans" element={<LabTabs/>} />
        <Route path="/plandetails/:eventId" element={<EventDetails />} />
        <Route path='/addtowish' element={<WishlistForm/>}/>
        <Route path="/invitation-detail/:eventId" element={<UserEventSection/>}/>
        <Route path="/notifications" element={<NotificationList/>}/>
        <Route path='/wishlistdetails/:itemId'element={<WishlistDetails/>}></Route>
        <Route path='/createpool' element={<PoolingWish/>}></Route>
        <Route path='/userdetail' element={<Account/>}/>
        <Route path="/familyinfo"  element={<FamilyInformation/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/invitation' element={<InvitationList/>}/>
        <Route path="/invite" element={<InvitePag/>} />
        <Route path="/chat" element={<ChatApp/>}/>

      </Routes>
    </Router>
</>
  );
}

export default App;
