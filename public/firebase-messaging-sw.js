

importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js');

firebase.initializeApp({
    
        apiKey: "AIzaSyAS6KhuPYihmJFO0pCFt0wXjrx_abiLorY",
        authDomain: "tiwil-718cf.firebaseapp.com",
        projectId: "tiwil-718cf",
        storageBucket: "tiwil-718cf.firebasestorage.app",
        messagingSenderId: "385369508354",
        appId: "1:385369508354:web:e99f7239e7a8671553b51b",
        measurementId: "G-R6T8CV0QRG"
      
});

const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  console.log('Background Message Received:', payload);

  const { title, body, icon } = payload.notification;

  // Show notification
  self.registration.showNotification(title, {
    body: body,
    icon: icon || '/logo192.png', // Fallback to default icon
  });
});
