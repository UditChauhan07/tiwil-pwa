import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Button, Form } from "react-bootstrap";
import { FaArrowRight } from "react-icons/fa";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function PoolingWish() {
  const { wishId } = useParams();
  const navigate = useNavigate();
  const [pool, setPool] = useState(null);
  const [loading, setLoading] = useState(false);
  const [contributors, setContributors] = useState([]); // Contributors state
  const [contributionAmount, setContributionAmount] = useState(""); // Dynamic input amount
  const userId = localStorage.getItem("userId");

  // Fetching pool data
  useEffect(() => {
    const fetchPoolData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/pool/${wishId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setPool(response.data.data);
      } catch (err) {
        console.error("Error fetching pool data:", err);
      }
    };

    fetchPoolData();
  }, [wishId]);

  // Fetching and combining contributors
  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/pool/contributors/${wishId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (response.data.success) {
          const combinedContributors = response.data.data.reduce((acc, contributor) => {
            const existingContributor = acc.find(
              (c) => c.userId._id === contributor.userId._id
            );
            if (existingContributor) {
              existingContributor.amount += contributor.amount;
            } else {
              acc.push({ ...contributor });
            }
            return acc;
          }, []);
          setContributors(combinedContributors);
        } else {
          console.log("Error fetching contributors");
        }
      } catch (err) {
        console.log("Error fetching contributors:", err);
      }
    };

    fetchContributors();
  }, [wishId]);

  const handleSaveContribution = async () => {
    if (!contributionAmount || contributionAmount <= 0) {
      Swal.fire("Error", "Please enter a valid contribution amount.", "error");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/pool/contribute`,
        { wishId, amount: parseFloat(contributionAmount) },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      if (response.data.success) {
        Swal.fire("Success!", "Your contribution has been saved.", "success");
        navigate(`/createpool/${wishId}`);
      }
    } catch (error) {
      console.error("Error saving contribution:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!pool) return <div className="text-center mt-5">Loading pool data...</div>;

  const { totalAmount, collectedAmount, status } = pool;
  const percentage = (collectedAmount / totalAmount) * 100;

  // Check if the pool is completed
  const isPoolCompleted = totalAmount === collectedAmount;

  // Find the user's own contribution
  const myContribution = contributors.find(
    (contributor) => contributor.userId._id === userId
  );

  // Filter out the user's contribution from the contributors list
  const otherContributors = contributors.filter(
    (contributor) => contributor.userId._id !== userId
  );

  return (
    <div className="container mt-3">
      {/* Back Button */}
      <div className="d-flex align-items-center mb-3">
        <span
          className="me-2"
          onClick={() => navigate(-1)}
          style={{ cursor: "pointer" }}
        >
          &larr;
        </span>
        <h5 className="mb-0">Pooling Wish</h5>
      </div>

      {/* Image Section */}
      <div className="text-center">
        <img
          src={`${process.env.PUBLIC_URL}/img/userimage3.jpg`}
          alt="Berlin Trip"
          className="img-fluid rounded"
        />
      </div>

      {/* Circular Progress Bar */}
      <div className="d-flex justify-content-center my-4">
        <div style={{ width: "150px", height: "150px" }}>
          <CircularProgressbar
            value={percentage}
            text={`${percentage.toFixed(0)}%`}
            styles={buildStyles({
              pathColor: `#ff3366`,
              textColor: "#ff3366",
              trailColor: "#d6d6d6",
              textSize: "16px",
            })}
          />
        </div>
      </div>

      {/* Contribution Details */}
      <div className="text-center">
        <h6 className="fw-bold">
          Total Amount: <strong>&#8377;{totalAmount}</strong>
        </h6>
        <h6 className="text-muted">
          Collected: <strong>&#8377;{collectedAmount}</strong>
        </h6>
        <h6 className="text-danger">
          Pending: <strong>&#8377;{totalAmount - collectedAmount}</strong>
        </h6>
      </div>

      {/* If pool is completed, show message and don't allow further contributions */}
      {isPoolCompleted ? (
        <div className="text-center my-4">
          <h4>Pool is Completed</h4>
          {/* Show My Contribution */}
          {myContribution && (
            <div>
              <h6>My Contribution: &#8377;{myContribution.amount}</h6>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Contribution Input */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h6>My Contribution</h6>
            <Form.Group className="mt-3" style={{ width: "70px" }}>
              <Form.Control
                type="number"
                placeholder="&#8377;"
                value={contributionAmount}
                onChange={(e) => {
                  let value = parseFloat(e.target.value);
                  if (value > totalAmount - collectedAmount) {
                    Swal.fire(
                      "Error",
                      `You cannot contribute more than &#8377;${totalAmount - collectedAmount}`,
                      "error"
                    );
                    value = totalAmount - collectedAmount;
                  }
                  setContributionAmount(value);
                }}
              />
            </Form.Group>
          </div>

          {/* Save Contribution Button */}
          <div className="mt-4 text-center">
            <Button
              variant="danger"
              className="w-100 py-2 d-flex align-items-center justify-content-center"
              onClick={handleSaveContribution}
            >
              {loading ? "Processing..." : "Contribute"} <FaArrowRight className="ms-2" />
            </Button>
          </div>
        </>
      )}

      {/* Show My Contribution separately */}
      {myContribution && !isPoolCompleted && (
        <div className="mt-4">
          <h6 className="fw-bold">My Contribution: &#8377;{myContribution.amount}</h6>
        </div>
      )}

      {/* Contributors List */}
      <div className="mt-4">
        <h2>Contributors</h2>
        <ul>
          {otherContributors.map((contributor) => (
            <li key={contributor.userId._id}>
              <span>{contributor.userId._id}</span>: <span>&#8377;{contributor.amount}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PoolingWish;
