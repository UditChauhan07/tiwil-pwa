import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import SignIn from "./components/Signin";
import SignUp from "./components/SignUp";
import Events from "./components/Eventlist";  // Protected Page
// import Invitations from "./components/Invitations"; // Protected Page
import PrivateRoute from "./components/Authentication/Privateroute";
import UserProfile from "./components/UserProfile";
import Dashboard from "./components/Dashboard/Dashboard"
import Home from "./components/Home";
import AddInformationForm from "./components/AdditionalInfo";
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
function App() {
  const [isPromptVisible, setPromptVisible] = useState(false);
  let deferredPrompt; // To store the deferred 'beforeinstallprompt' event

  // Set up event listener for beforeinstallprompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      console.log('beforeinstallprompt event fired:', e);
      // Prevent the default mini-infobar
      e.preventDefault();
      // Save the event for later use
      deferredPrompt = e;
      setPromptVisible(true); // Show the install button
    };

    // Add the event listener
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Cleanup the event listener when the component is unmounted
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      setPromptVisible(false); // Hide the install button once clicked
      console.log('Prompting installation...');
      // Trigger the installation prompt
      deferredPrompt.prompt();
      
      // Wait for user choice
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        // Nullify the deferred prompt after the user's choice
        deferredPrompt = null;
      });
    } else {
      console.log('Install prompt is not available');
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('homescreen') === '1') {
      console.log('App launched from the home screen');
    }
  }, []);

  return (
    <>
      {isPromptVisible && (
        <button onClick={handleInstallClick}>
          Add to Home Screen
        </button>
     

      )}
   
    <Router>
      <Routes>
<Route path="/" element={<SignIn/>}></Route>
        {/* Public Routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<HomePage/>}/>
        {/* Private Routes (Protected) */}
        <Route element={<PrivateRoute />}>
          
        <Route path="/userprofile" element={<UserProfile/>}></Route>
          {/* <Route path="/invitations" element={<Invitations />} /> */}
        </Route>
    
        <Route path="/events" element={<Events />} />
        {/* Default Route */}
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/additionalinfo" element={<AddInformationForm/>} />
        <Route path="/plans" element={<LabTabs/>} />
        <Route path="/plandetails/:eventId" element={<EventDetails />} />
        <Route path='/addtowish' element={<WishlistForm/>}/>
        <Route path="/invitationdetails/:eventId" element={<UserEventSection/>}/>
        <Route path="/notifications" element={<NotificationList/>}/>
        <Route path='/wishlistdetails/:itemId'element={<WishlistDetails/>}></Route>
        <Route path='/createpool' element={<PoolingWish/>}></Route>
        <Route path='/userdetail' element={<MyProfile/>}/>
        <Route path="/familyinfo"  element={<FamilyList/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/invitation' element={<InvitationList/>}/>
        <Route path="/invite" element={<InvitePag/>} />

      </Routes>
    </Router>
</>
  );
}

export default App;
