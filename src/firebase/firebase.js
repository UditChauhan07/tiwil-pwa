import { SwapCalls } from "@mui/icons-material";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import Swal from "sweetalert2";
const firebaseConfig = {
        apiKey: "AIzaSyAS6KhuPYihmJFO0pCFt0wXjrx_abiLorY",
        authDomain: "tiwil-718cf.firebaseapp.com",
        projectId: "tiwil-718cf",
        storageBucket: "tiwil-718cf.firebasestorage.app",
        messagingSenderId: "385369508354",
        appId: "1:385369508354:web:e99f7239e7a8671553b51b",
        measurementId: "G-R6T8CV0QRG"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Function to request permission and generate token
export const genToken = async () => {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    const token = await getToken(messaging, { 
      vapidKey: "BAP_H0y2nu0WtM4N-xgbHU7SlNUzxXWG32mZaCtrV1MW968sbw2I7xqtHlE9x7QO7P0aFeS7pBBSCE1phYMENAw" 
    });
    
//    console.log(token);
  localStorage.setItem('PushToken',token)
  return token;
  } else {
    console.log('Permission denied');
  }
};



export const requestNotificationPermission = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: "BAP_H0y2nu0WtM4N-xgbHU7SlNUzxXWG32mZaCtrV1MW968sbw2I7xqtHlE9x7QO7P0aFeS7pBBSCE1phYMENAw",
    });
    console.log("FCM Token:", token);
    return token;
  } catch (error) {
    console.error("Permission Denied", error);
  }
};
self.addEventListener("notificationclick", function (event) {
  let url = event.notification.data?.FCM_MSG?.data?.url || event.notification.click_action;
  event.notification.close(); // Close notification

  if (url) {
      clients.openWindow(url); // Redirect to URL on click
  } else {
      clients.openWindow("/"); // Default to home if no URL is provided
  }
});
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("Foreground Notification:", payload);

      if (payload.notification) {
        const { title, body } = payload.notification;
        const url = payload.data?.url; // Get URL from data

        // ✅ Show native browser notification
        const notification = new Notification(title, {
          body,
          icon: "/logo.png",
          data: { url },
        });

        // ✅ Open URL when user clicks the notification
        notification.onclick = (event) => {
          event.preventDefault(); // Prevent default behavior
          if (url) {
            window.open(url, "_blank");
          }
        };

        resolve(payload);
      }
    });
  });
