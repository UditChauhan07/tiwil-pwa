import React, { useState, useEffect } from "react";
import { Client } from "@pusher/push-notifications-web"; // Correctly import Client from Pusher Beams
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import SignIn from "./components/Signin";
import SignUp from "./components/SignUp";
import Events from "./components/Eventlist"; // Protected Page
import PrivateRoute from "./components/Authentication/Privateroute";
import Profile from "./components/Profile/UserProfile";
import Dashboard from "./components/Dashboard/Dashboard";
import Home from "./components/Home";
import AddInformation from "./components/AdditionalInfo";
import Starting from "./components/OnbaordingScreen/Starting";
import LabTabs from "./components/Tabbingplans/Planandclebs";
import EventDetails from "./components/eventDetails";
import WishlistForm from "./components/Wishlist/addWishlist";
import HomePage from "./components/Home";
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
import ChatList from "./chatsection/ChatList";
import ChatRoom from "./chatsection/ChatRoom";
import GroupDetails from "./chatsection/GroupDetails";
import  {requestNotificationPermission, onMessageListener}  from "../src/firebase/firebase";


function App() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallDialog, setShowInstallDialog] = useState(false);

  useEffect(() => {
   

    // const beamsClient = new PusherPushNotifications.Client({
    //   instanceId: "d37a7939-04e2-4507-a613-a3f1ca44f3db", // Replace with your Pusher Beams instance ID
    // });
    
    // const userId = localStorage.getItem('userId'); // Replace with the actual user ID from your auth system
    // console.log(userId);
    
    // beamsClient
    //   .start()
    //   .then(() => {
    //     console.log("✅ Pusher Beams started successfully");
    
    //     // Authenticate the user with Beams
    //     return beamsClient.setUserId(userId, {
    //       headers: {
    //         Authorization: `Bearer YOUR_AUTH_TOKEN`, // Fetch from backend
    //       },
    //     });
    //   })
    //   .then(() => {
    //     console.log(`✅ User ${userId} registered for notifications`);
    
    //     // Subscribe the user to their unique channel
    //     return beamsClient.addDeviceInterest(`user-${userId}`);
    //   })
    //   .then(() => {
    //     console.log(`✅ Subscribed to user-${userId} for notifications`);
    //   })
    //   .catch((err) => {
    //     console.error("❌ Error setting up Pusher Beams:", err);
    //   });
    
    // // Request permission for notifications
    // if ("Notification" in window && Notification.permission !== "granted") {
    //   Notification.requestPermission().then((permission) => {
    //     if (permission === "granted") {
    //       console.log("✅ Notification permission granted");
    //     } else {
    //       console.log("❌ Notification permission denied");
    //     }
    //   });
    // }
    
   
    // Handle PWA installation prompt
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
    requestNotificationPermission().then((token) => {
      console.log("Notification Token:", token);
      // Iss token ko backend pe store karwana hoga notifications bhejne ke liye
    });

    onMessageListener().then((payload) => {
      console.log("Foreground Notification Received:", payload);
      alert(payload.notification.title + ": " + payload.notification.body);
    });
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
                top: "20%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                padding: "20px",
                background: "white",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "10px",
              }}
            >
              <button onClick={handleInstallClick} style={{ padding: "10px", fontSize: "16px" }}>
                Add to Home Screen
              </button>
            </div>
          )}
        </div>

        <Router>
          <Routes>
            <Route path="/" element={<Starting />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/home" element={<HomePage />} />

            {/* Private Routes (Protected) */}
            <Route element={<PrivateRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/events" element={<Events />} />
              <Route path="/event/:id" element={<EventDetails />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/additionalinfo" element={<AddInformation />} />
              <Route path="/plans" element={<LabTabs />} />
              <Route path="/plandetails/:eventId" element={<EventDetails />} />
              
              <Route path="/addtowish" element={<WishlistForm />} />
              <Route path="/invitation-detail/:eventId" element={<UserEventSection />} />
              <Route path="/notifications" element={<NotificationList />} />
              <Route path="/wishlistdetails/:itemId" element={<WishlistDetails />} />
              <Route path="/createpool/:wishId" element={<PoolingWish />} />
              <Route path="/userdetail" element={<Account />} />
              <Route path="/familyinfo" element={<FamilyInformation />} />
              <Route path="/chat" element={<ChatApp />} />
              <Route path="/chats" element={<ChatList />} />
              <Route path="/chats/:groupId" element={<ChatRoom />} />
              <Route path="/group/:groupId/details" element={<GroupDetails />} />
            </Route>

            {/* Default Route */}
            <Route path="/" element={<Home />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
