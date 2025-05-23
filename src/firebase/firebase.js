import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import {getAuth,RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import Swal from "sweetalert2";
import { onAuthStateChanged } from 'firebase/auth';
import { connectAuthEmulator } from 'firebase/auth';


const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_AUTH_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_AUTH_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_AUTH_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_AUTH_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_AUTH_APP_ID,
};

console.log("Firebase Config:", firebaseConfig);
// ✅ Initialize and export the shared app
const app = initializeApp(firebaseConfig);




export const auth = getAuth(app);

export const messaging = getMessaging(app);

// --- Notifications ---
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is logged in:", user);
  } else {
    console.log("User is not logged in");
  }
});

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

export const requestNotificationPermission = async () => {
  try {
    await registerServiceWorker();
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: process.env.REACT_APP_VAPID_KEY, // ✅ use env here too
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
  await registerServiceWorker();
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    try {
      const token = await getToken(messaging, {
        vapidKey: process.env.REACT_APP_VAPID_KEY,
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


  
export {RecaptchaVerifier, signInWithPhoneNumber }