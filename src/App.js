import React, { useState, useEffect } from "react";

const App = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const handler = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setShowInstallButton(true);
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
        setShowInstallButton(false);
      });
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>PWA Concept App</h1>
      <p>Install this app on your home screen for a better experience.</p>
      {showInstallButton && (
        <button onClick={handleInstallClick} style={{ padding: "10px", fontSize: "16px" }}>
          Add to Home Screen
        </button>
      )}
    </div>
  );
};

export default App