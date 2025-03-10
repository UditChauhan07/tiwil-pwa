import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const SurpriseReveal = ({ data }) => {
  const [selectedContributors, setSelectedContributors] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const openModal = (contributors) => {
    setSelectedContributors(contributors);
    setShowModal(true);
  };
 // Token from the user (usually from login or session)


const fetchData = async (token, interval) => {
  try {
    // Set up Axios configuration with the Authorization header
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`, // Pass the token for verification
        'Content-Type': 'application/json',  // Ensure content type is JSON
      },
    };

    // Make the API call to trigger the backend task
    const response = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/test-surprise-reveal`, 
      {
        params: { interval },  // Send the interval as a query parameter
        ...config,  // Add the headers to the request
      }
    );

    if (response.status === 200) {
      console.log('Task scheduled successfully');
      console.log(response.data); // Handle the data received from the backend (message or success)
    } else {
      console.error('Failed to schedule task', response.data.message);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// Example usage:
const token = localStorage.getItem('token');  // Token from the user (usually from login or session)
const interval = 1;  // Time interval in hours (example: 1 hour)
fetchData(token, interval);

  

  return (
    <div className="container mt-4">
      <h2 className="text-center text-danger">🎉 Surprise Reveal 🎉</h2>
      <div className="row">
        {data.map((item, index) => (
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
        ))}
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
