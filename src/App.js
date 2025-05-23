import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./components/Authentication/Signin";
import SignUp from "./components/Authentication/SignUp";
import PrivateRoute from "./components/Authentication/Privateroute";
import Profile from "./components/Profile/UserProfile";
import Home from "./components/home/Home";
import AddInformation from "./components/Profile/AdditionalInfo";
import Starting from "./components/OnbaordingScreen/Starting";
import EventDetails from "./components/Events/eventDetails";
import WishlistForm from "./components/Wishlist/addWishlist";
import UserEventSection from "./components/userview/userEventsection";
import NotificationList from "./components/Notifications/Notification";
import WishlistDetails from "./components/userview/wishlistDetails";
import PoolingWish from "./components/Pooloptions/Createpool";
import Account from "./components/Profile/Account";
import FamilyInformation from "./components/Profile/FamilyInformation";
import ChatList from "./chatsection/ChatList";
import ChatRoom from "./chatsection/ChatRoom";
import GroupDetails from "./chatsection/GroupDetails";
import { requestNotificationPermission, onMessageListener } from "../src/firebase/firebase";
import HomePage from "./components/home/Home";
import SurpriseReveal from "./components/surpriseReveal/surpriseScreen";
import EventsFilter from "./components/home/filterModal";
import './App.css'
import { useNavigate } from 'react-router-dom';
import { restoreAuthFromCookie } from "./components/Authentication/auth";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function App() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallDialog, setShowInstallDialog] = useState(false);
  const queryClient = new QueryClient();
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


  useEffect(() => {
    const hasRedirected = sessionStorage.getItem('hasRedirected');
    if (!hasRedirected) {
      const token = localStorage.getItem('token');
      sessionStorage.setItem('hasRedirected', 'true');
  
      if (token) {
        window.location.href = '/home';
      } else {
        window.location.href = '/';
      }
    }
  }, []);        
  
   // empty dependency array: runs once on initial render

 

  useEffect(() => {
    requestNotificationPermission().then((token) => {
      console.log("Notification Token:", token);
    });

    onMessageListener().then((payload) => {
      console.log("Foreground Notification Received:", payload);
      alert(payload.notification.title + ": " + payload.notification.body);
    });
  }, []);
  useEffect(() => {
    restoreAuthFromCookie(); // ✅ restore token if needed
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
      <div className="mainapp">
        <div style={{ textAlign: "center" }}>
          {showInstallDialog && (
            <div
              style={{
            position: "fixed",
    top: "0px",
    right: "0px",
    fontSize: "0px",
  
    
    padding: "0px",
    background: "white",
    borderRadius: "10px",
              }}
            >
              <button onClick={handleInstallClick} style={{ padding: "4px 9px", fontSize: "13px",border:'none',background:'#rgb(195 144 157)',color:'#ff3366',cursor:'pointer' }}>
                Add to Home Screen
              </button>
            </div>

          )}
        </div>
        <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Starting />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            

            {/* Private Routes (Protected) */}
            <Route element={<PrivateRoute />}>
            <Route path="/home" element={<HomePage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/event/:id" element={<EventDetails />} />
              <Route path="/additionalinfo" element={<AddInformation />} />
              <Route path="/plandetails/:eventId" element={<EventDetails />} />
              <Route path="/addtowish" element={<WishlistForm />} />
              <Route path="/invitation-detail/:eventId" element={<UserEventSection />} />
              <Route path="/notifications" element={<NotificationList />} />
              <Route path="/wishlistdetails/:itemId" element={<WishlistDetails />} />
              <Route path="/createpool/:wishId" element={<PoolingWish />} />
              <Route path="/userdetail" element={<Account />} />
              <Route path="/familyinfo" element={<FamilyInformation />} />
              <Route path="/chats" element={<ChatList />} />
              <Route path="/chats/:groupId" element={<ChatRoom />} />
              
              <Route path="/group/:groupId/details" element={<GroupDetails />} />
              <Route path="/surprise" element={<SurpriseReveal/>}/>
            <Route path="/filter" element={<EventsFilter/>}/>
            </Route>

          <Route path="/:eventId" element={<UserEventSection />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
</QueryClientProvider>

        <div id="recaptcha-container" style={{ marginTop: "10px" }}></div>
      </div>
    </>
  );
}

export default App;