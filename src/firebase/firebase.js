import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";


import Swal from "sweetalert2";

// Firebase configuration
const firebaseNotifConfig  = {
  apiKey: "AIzaSyAS6KhuPYihmJFO0pCFt0wXjrx_abiLorY",
  authDomain: "tiwil-718cf.firebaseapp.com",
  projectId: "tiwil-718cf",
  storageBucket: "tiwil-718cf.firebasestorage.app",
  messagingSenderId: "385369508354",
  appId: "1:385369508354:web:e99f7239e7a8671553b51b",
  measurementId: "G-R6T8CV0QRG",
};

// Initialize Firebase
const notifapp = initializeApp(firebaseNotifConfig ,"notifapp");
const messaging = getMessaging(notifapp);

// Register Service Worker
export const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
      console.log("Service Worker registered:", registration);
      return registration;
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  }
};

// Request notification permission and generate token
export const requestNotificationPermission = async () => {
  try {
    // First, register service worker
    await registerServiceWorker();

    // Request notification permission
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: "BBvmoxoOK-m3XEx1qr8aG6J8WvGWqOhJ94qPkXEbLEi_qx26vI1di6cMMNFiadRBqtCxsdnKKSMicBaRhnBMumQ",
      });

      console.log("FCM Token:", token);
      localStorage.setItem("PushToken", token);
      return token;
    } else {
      console.log("Notification permission denied.");
    }
  } catch (error) {
    console.error("Error in getting notification token:", error);
  }
};

export const genToken = async () => {
  await registerServiceWorker(); // Ensure SW is registered before requesting token

  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    try {
      const token = await getToken(messaging, { 
        vapidKey: "BBvmoxoOK-m3XEx1qr8aG6J8WvGWqOhJ94qPkXEbLEi_qx26vI1di6cMMNFiadRBqtCxsdnKKSMicBaRhnBMumQ" 
      });
      console.log("FCM Token:", token);
      localStorage.setItem("PushToken", token);
      return token;
    } catch (error) {
      console.error("Error getting token:", error);
    }
  } else {
    console.log("Permission denied");
  }
};

// Listener for foreground messages
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("Foreground Message:", payload);
      Swal.fire({
        title: payload.notification.title,
        text: payload.notification.body,
        icon: "info",
      });
      resolve(payload);
    });
  });
