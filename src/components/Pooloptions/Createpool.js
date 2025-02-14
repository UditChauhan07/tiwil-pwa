import React, { useState, useEffect } from "react";
import { Button, Card, ProgressBar } from "react-bootstrap";
import { FaArrowRight } from "react-icons/fa";
import img1 from "../../img/image.png"; // Replace with the actual image you have
import Header from "../Header";
import Navbar from "../navbar";
import Footer from "../Footer";
import  InviteModal from '../GuestInvite/PoolguestModal'
import { useLocation } from "react-router-dom";
import axios from "axios";

const PoolingWish = ({}) => {
  const location = useLocation();
  const { wishlistItem } = location.state || {};
  const userId = localStorage.getItem("user.id");

  const initialContribution = 0; // Initial myContribution if any (use number)
  const [myContribution, setMyContribution] = useState(initialContribution);
  const [contributionSaved, setContributionSaved] = useState(false);
  const [showGuestModal, setGuestModal] = useState(false);
  const pendingAmount = wishlistItem.price - myContribution;

  // Function to handle saving the amount
  const handleSaveContribution = async () => {
    // Send the API call to save the contribution
    const contributionData = {
      amount: myContribution,
      wishlistId: wishlistItem._id,
      userId: userId, // Assuming wishlistItem has an _id to uniquely identify
    };

    try {
      const response = await axios.post(
        "http://localhost:3001/api/save-contribution",
        contributionData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data; // Axios automatically parses JSON

      if (data.success) {
        // Once the contribution is saved, update the state
        setContributionSaved(true);
      } else {
        console.error("Error saving contribution:", data.message);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  // Function to handle sending invites
  const handleSendInvites = async () => {
    // Get the list of guests to invite
// Replace with actual guest IDs

    try {
      const response = await axios.post(
        "http://localhost:3001/api/send-invite",
        {
          wishlistId: wishlistItem._id,
          userId,
          guests,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      if (data.success) {
        console.log("Invites sent successfully!");
      } else {
        console.error("Error sending invites:", data.message);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  useEffect(() => {
    // To ensure that the contribution is saved initially if needed
    if (contributionSaved) {
      // Once saved, automatically open the invite modal
      setGuestModal(true);
    }
  }, [contributionSaved]);

  return (
    <>
      <section className="page-controls">
        <Header />
        <Navbar />
        <div className="container mt-4">
          <h4 className="fw-bold mb-4">Pooling Wish</h4>
          <div className="row">
            {/* Image Section */}
            <div className="col-12 mb-3">
              <img
                src={img1}
                className="img-fluid rounded"
                alt="Berlin Trip"
                style={{ maxHeight: "300px", objectFit: "cover" }}
              />
            </div>

            {/* Pool Info */}
            <div className="col-12">
              <Card className="p-3 mb-3 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="fw-bold">{wishlistItem.giftName}</h5>
                      <p className="text-muted">{wishlistItem.description}</p>
                    </div>
                    <div>
                      <span className="badge bg-danger text-white w-100 pt-2">
                        Pool Amount ${wishlistItem.price}
                      </span>
                      <br />
                      <span className="text-muted">Pending Amount ${pendingAmount}</span>
                    </div>
                  </div>

                  {/* Progress Bar for Pool Amount */}
                  <div className="mt-3">
                    <ProgressBar
                      now={(myContribution / wishlistItem.price) * 100}
                      label={`$${myContribution} / $${wishlistItem.price}`}
                      variant="success"
                      animated
                    />
                  </div>

                  {/* Total Contribution */}
                  <div className="mt-3">
                    <h5>Total amount wish: ${wishlistItem.price}</h5>
                    <div className="d-flex justify-content-between">
                      <span>My Contribution</span>
                      <span
                        className="badge  text-white d-flex"
                        style={{ width: "70px", paddingTop: "" }}
                      >
                        {contributionSaved ? `$${myContribution}` : (
                          <input
                            type="number"
                            value={myContribution}
                            onChange={(e) => setMyContribution(Number(e.target.value))}
                            className="form-control"
                            min="1"
                            style={{ border: "1px solid #ff3366", width: "70px" }}
                          />
                        )}
                      </span>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>

            {/* Save or Pool Invite Button Section */}
            <div className="col-12 text-center mt-4">
              <Button
                variant="danger"
                size="lg"
                className="w-30"
                onClick={contributionSaved ? () => setGuestModal(true) : handleSaveContribution}
              >
                {contributionSaved ? "POOL INVITES" : "SAVE AMOUNT"}{" "}
                <FaArrowRight className="ms-2" />
              </Button>
            </div>
          </div>
        </div>
        <InviteModal show={showGuestModal} setShow={setGuestModal} onSendInvites={handleSendInvites} />
        <Footer />
      </section>
    </>
  );
};

export default PoolingWish;
