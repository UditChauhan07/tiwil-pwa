import React, { useState, useEffect } from "react";
import { Button, Card, ProgressBar } from "react-bootstrap";
import { FaArrowRight } from "react-icons/fa";
import Header from "../Header";
import Navbar from "../navbar";
import Footer from "../Footer";
import InviteModal from "../GuestInvite/PoolguestModal";
import { useLocation } from "react-router-dom";
import axios from "axios";

const PoolingWish = () => {
  const location = useLocation();
  const { wishlistItem } = location.state || {};

  const userId = localStorage.getItem("userId"); // Fixed userId retrieval
  const token = localStorage.getItem("token"); // Ensure token is defined

  const [myContribution, setMyContribution] = useState(null);
  const [contributionSaved, setContributionSaved] = useState(false);
  const [showGuestModal, setGuestModal] = useState(false);
console.log(wishlistItem,'677777777777777777')
  const pendingAmount = wishlistItem?.price - myContribution;

  useEffect(() => {
    const fetchPoolData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/pool/${item._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (response.data.success) {
          const fetchedPool = response.data.data;
          setPool(fetchedPool);

          // ✅ Check if pool is completed & update status in backend
          if (fetchedPool.collectedAmount >= fetchedPool.totalAmount && fetchedPool.status !== "Completed") {
            await axios.put(
              `${process.env.REACT_APP_BASE_URL}/update-status/${item._id}`,
              { status: "Completed" },
              { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );

            // ✅ Update pool state after marking as completed
            setPool((prev) => ({ ...prev, status: "Completed" }));
          }
        }
      } catch (error) {
        console.error("Error fetching pool data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPoolData();
  }, [item._id]);
  // Handle saving contribution
  const handleSaveContribution = async () => {
    const token = localStorage.getItem("token"); 
    if (!wishlistItem?._id || !userId) {
      console.error("Missing wishlistItem ID or user ID");
      return;
    }

    const contributionData = {
      amount: myContribution,
      wishlistId: wishlistItem._id,
      userId,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/pool/contribute`,
        contributionData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setContributionSaved(true);
      } else {
        console.error("Error saving contribution:", response.data.message);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  // Handle sending invites
  const handleSendInvites = async () => {
    if (!wishlistItem?._id || !userId) {
      console.error("Missing wishlistItem ID or user ID");
      return;
    }

    const guests = []; // Replace with actual guest list

    try {
      const response = await axios.post(
        "http://localhost:3001/api/send-invite",
        { wishlistId: wishlistItem._id, userId, guests },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        console.log("Invites sent successfully!");
      } else {
        console.error("Error sending invites:", response.data.message);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  useEffect(() => {
    if (contributionSaved) {
      setGuestModal(true);
    }
  }, [contributionSaved]);

  return (
    <section className="page-controls">
      <Header />
      <Navbar />
      <div className="container mt-4">
        <h4 className="fw-bold mb-4">Pooling Wish</h4>
        <div className="row">
          {/* Image Section */}
          <div className="col-12 mb-3">
            <img
            src={`${process.env.PUBLIC_URL}/img/image.png`}
              className="img-fluid rounded"
              alt="Berlin Trip"
              style={{ maxHeight: "300px", objectFit: "cover" }}
            />
          </div>

          {/* Pool Info */}
          <div className="col-12">
            <Card className=" mb-3 shadow-sm">
              <Card.Body style={{padding:"9px"}}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="fw-bold">{wishlistItem?.giftName}</h6>
                    <p className="text-muted">{wishlistItem?.description}</p>
                  </div>
                  <div>
                    <span className="badge bg-danger text-white w-100 pt-2">
                      Pool Amount ${wishlistItem?.price}
                    </span>
                    <br />
                    <span className="text-muted">Pending Amount ${pendingAmount}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <ProgressBar
                    now={(myContribution / wishlistItem?.price) * 100}
                    label={`$${myContribution} / $${wishlistItem?.price}`}
                    variant="success"
                    animated
                  />
                </div>

                {/* Contribution */}
                <div className="mt-3">
                  <h6>Total amount wish: ${wishlistItem?.price}</h6>
                  <div className="d-flex justify-content-between">
                    <span>My Contribution</span>
                    <span
                      className="badge text-white d-flex"
                      style={{ width: "70px" }}
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

          {/* Save or Pool Invite Button */}
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
 
    </section>
  );
};

export default PoolingWish;
