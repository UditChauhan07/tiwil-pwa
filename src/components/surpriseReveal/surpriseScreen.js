import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Accordion, Card, Button } from "react-bootstrap";

const SurpriseReveal = () => {
  const [surpriseData, setSurpriseData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedContributors, setSelectedContributors] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/getsurprisedata`,
          config
        );

        if (response.data.success && response.data.data.length > 0) {
          // Group data by unique eventId to avoid duplicates
          const uniqueEvents = Object.values(
            response.data.data.reduce((acc, item) => {
              acc[item.eventId] = acc[item.eventId] || { ...item, wishlistItems: [] };
              acc[item.eventId].wishlistItems.push(item.wishlistItem);
              return acc;
            }, {})
          );
          setSurpriseData(uniqueEvents);
          setErrorMessage("");
        } else {
          setSurpriseData([]);
          setErrorMessage(response.data.message || "No surprise reveal for tomorrow.");
        }
      } catch (error) {
        setSurpriseData([]);
        setErrorMessage("Error fetching data. Please try again later.");
      }
    };

    fetchData();
  }, []);

  const openModal = (contributors) => {
    setSelectedContributors(contributors);
    setShowModal(true);
  };
  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="container mt-4 ">
    <div className="d-flex" style={{alignItems:'baseline',gap:'20px'}}>
       <img
        src={`${process.env.PUBLIC_URL}/img/arrow-left.svg`}
        alt="back"
        height={"20px"}
        width={"20px"}
        onClick={handleBack}
        style={{ cursor: "pointer" }}
      />
      <h2 className="text-center text-danger"> Surprise Reveal </h2>
      </div>
      <Accordion>
        {surpriseData.length > 0 ? (
          surpriseData.map((event, index) => (
            <Accordion.Item eventKey={index.toString()} key={event.eventId}>
              <Accordion.Header>{event.eventName}</Accordion.Header>
              <Accordion.Body>
                {event.wishlistItems.map((item, idx) => (
                  <Card className="mb-3" key={idx}>
                    <Card.Body className="d-flex align-items-center">
                      <img
                        src={item.imageUrl ? `${process.env.REACT_APP_BASE_URL}${item.imageUrl}` : "/img/placeholder.jpg"}
                        alt={item.giftName}
                        className="rounded-circle me-3"
                        style={{ width: "60px", height: "60px", objectFit: "cover" }}
                      />
                      <div>
                        <h5>{item.giftName}</h5>
                        <p className={item.status === "Unmark" ? "text-danger" : ""}>
  {item.status === "Unmark"
    ? "Mark"
    : item.status === "Purchased" || item.status === "Completed"
    ? `Purchased by: ${item.markedBy?.name || "Unknown"}`
    : item.status}
</p>
                        {item.status === "Pooling" && item.contributors.length > 0 && (
                          <Button  style={{borderColor:'#ff3366',color:'#ff3366',fontSize:'12px',
                          fontWeight:'600',backgroundColor:'#ffffff'}} onClick={() => openModal(item.contributors)}>
                            View Contributors
                          </Button>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </Accordion.Body>
            </Accordion.Item>
          ))
        ) : (
          <p className="text-center  d-flex align-items-center justify-content-center text-muted mt-8">No Surprise reveal</p>
        )}
      </Accordion>

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
                      {/* <img
                        src={contributor.profileImage || "/img/default-user.png"}
                        alt={contributor.name}
                        className="rounded-circle me-2"
                        style={{ width: "40px", height: "40px" }}
                      /> */}
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