import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
// import MyProfile from "./components/Profile/Myprofile";
// import FamilyList from "./components/Profile/Familyinfo";
// import LoginPage from "./components/Login";
// import InvitePag from "../src/components/InvitPage";
import Account from "./components/Profile/Account";
import FamilyInformation from "./components/Profile/FamilyInformation";
import ChatList from "./chatsection/ChatList";
import ChatRoom from "./chatsection/ChatRoom";
import GroupDetails from "./chatsection/GroupDetails";
import  {requestNotificationPermission, onMessageListener}  from "../src/firebase/firebase";
import HomePage from "./components/home/Home";


function App() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallDialog, setShowInstallDialog] = useState(false);

  useEffect(() => {
   
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
