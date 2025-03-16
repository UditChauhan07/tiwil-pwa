import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const SurpriseReveal = () => {
  const [selectedContributors, setSelectedContributors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Store error messages
  const [surpriseData, setSurpriseData] = useState([]); // Store API response as an array

  const openModal = (contributors) => {
    setSelectedContributors(contributors);
    setShowModal(true);
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token"); // Fetch token from localStorage
      const interval = 1; // Example: 1 hour
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/test-surprise-reveal`,
        { params: { interval }, ...config }
      );

      if (response.data.success && response.data.events.length > 0) {
        setSurpriseData(response.data.events); // Ensure response contains an array
        setErrorMessage(""); // Reset error message
      } else {
        setSurpriseData([]); // Empty array when no events found
        setErrorMessage(response.data.message || "No surprise reveal for tomorrow.");
      }
    } catch (error) {
      setSurpriseData([]);
      setErrorMessage("Error fetching data. Please try again later.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const handleback=()=>{
    window.history.back();
  }
  return (
    <div className="container mt-4">
      <img src={`${process.env.PUBLIC_URL}/img/arrow-left.svg`} alt="notification" height={"20px"} width={"20px"} onClick={handleback} />
      <h2 className="text-center text-danger">🎉 Surprise Reveal 🎉</h2>

      
        <div className="row">
          {surpriseData.length > 0 ? (
            surpriseData.map((item, index) => (
              <div key={index} className="col-12 mb-3">
                <div className="card shadow-sm p-3">
                  <div className="d-flex align-items-center">
                    <img
                      src={item.wishlistItem.imageUrl}
                      alt={item.wishlistItem.giftName}
                      className="rounded-circle me-3"
                      style={{ width: "60px", height: "60px", objectFit: "cover" }}
                    />
                    <div>
                      <h5 className="mb-1">{item.wishlistItem.giftName}</h5>
                      <p className="mb-1">Purchased by: {item.wishlistItem.markedBy.name}</p>
                    </div>
                  </div>
                  {item.wishlistItem.status === "Pooling" && (
                    <button
                      className="btn btn-outline-primary mt-2"
                      onClick={() => openModal(item.wishlistItem.contributors || [])}
                    >
                      View Contributors
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted">No surprise reveal available.</p>
          )}
        </div>
   

      {/* Modal for Contributors */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Contributors</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                {selectedContributors.length > 0 ? (
                  selectedContributors.map((contributor, index) => (
                    <div key={index} className="d-flex align-items-center mb-2">
                      <img
                        src={contributor.profileImage}
                        alt={contributor.name}
                        className="rounded-circle me-2"
                        style={{ width: "40px", height: "40px" }}
                      />
                      <div>
                        <p className="mb-0">{contributor.name}</p>
                        <small>₹{contributor.amount}</small>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No contributors found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurpriseReveal;
