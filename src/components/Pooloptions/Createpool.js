import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Button, Form } from "react-bootstrap";
import { FaArrowRight } from "react-icons/fa";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import InviteModal from "../GuestInvite/PoolguestModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FaPencilAlt } from "react-icons/fa";
import "./Createpool.css";

function PoolingWish() {
  const { wishId } = useParams();
  const navigate = useNavigate();
  const [pool, setPool] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [contributionAmount, setContributionAmount] = useState(
    pool?.contributors?.amount || 0
  );
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [poolId, setPoolId] = useState(null);
  const [userStatus, setUserStatus] = useState(null);
  const [poolCreator, setpoolCreator] = useState(null);
  const userId = localStorage.getItem("userId");
  const [eventId, seteventId] = useState("");

  // Fetching pool data which includes contributors
  //   useEffect(() => {
  //     const fetchPoolData = async () => {
  //       try {
  //         const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/pool/${wishId}`, {
  //           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  //         });

  //         if (response.data.success) {
  //           setPool(response.data.data);
  //           setPoolId(response.data.data._id);
  //           setpoolCreator(response.data.data.userId)
  //         } else {
  //           console.error("Error fetching pool data");
  //         }
  //       } catch (err) {
  //         console.error("Error fetching pool data:", err);
  //       }
  //     };
  // console.log(poolCreator,'/er/grtd')
  //     fetchPoolData();
  //   }, [wishId]);

  // Fetching the user's status
  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/guests/userId/${wishId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const loggedInUserId = localStorage.getItem("userId");

        // Check if the user is in the guest list and find their status
        const guest = data.guestUsers.find(
          (user) => user.userId === loggedInUserId
        );
        if (guest) {
          setUserStatus(guest.status);
        }
      } catch (err) {
        console.error("Error fetching user status:", err);
      }
    };

    fetchUserStatus();
  }, [wishId]);
  console.log("pool", poolCreator);

  const handleSaveContribution = async () => {
    if (!contributionAmount || contributionAmount <= 0) {
      Swal.fire("Error", "Please enter a valid contribution amount.", "error");
      return;
    }

    if (userStatus === "pending") {
      Swal.fire("Error", "Please accept the pool invitation first.", "error");
      return;
    } else if (userStatus === "declined") {
      Swal.fire({
        title: "Access Denied",
        text: "Invited users can contribute to the pool!wana contribute click OK",
        icon: "error",
        showCancelButton: true, // Show the Cancel button
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#ff3366",
        iconColor: "#ff3366",
      }).then(async (result) => {
        if (result.isConfirmed) {
          // If the user clicked "OK"
          try {
            const itemId = wishId;
            const response = await axios.post(
              `${process.env.REACT_APP_BASE_URL}/request`, // Replace with your actual API endpoint
              { itemId }, // Sending userId in the body
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            if (response.data.success) {
              setIsEditing(false); // Close the edit mode
              setContributionAmount(contributionAmount); // Reset the contribution amount
              Swal.fire({
                title: "Request Sent!",
                text: "Your request has been sent to the pool admin.",
                icon: "success",
                confirmButtonColor: "#ff3366",

                iconColor: "#ff3366",
              });
            } else {
              Swal.fire({
                title: "Error!",
                text: "There was an issue sending the request.",
                icon: "error",

                confirmButtonColor: "#ff3366",
                iconColor: "#ff3366",
              });
            }
          } catch (error) {
            Swal.fire({
              title: "Error!",
              text: "An error occurred while sending the request.",
              icon: "error",
              confirmButtonColor: "#FF3366",
            });
          }
        } else if (result.isDismissed) {
          // If the user clicked "Cancel"
          console.log("User canceled the action.");
          // You can optionally navigate back or do some other action
        }
      });

      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/pool/contribute`,
        { wishId, amount: parseFloat(contributionAmount) },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data.success) {
        setIsEditing(false); // Close the edit mode

        setContributionAmount(contributionAmount);
        fetchPoolData();

        navigate(`/createpool/${wishId}`);
      }
    } catch (error) {
      console.error("Error saving contribution:", error);
    } finally {
      setLoading(false);
    }
  };

  // const sendRequestToAdmin = async () => {
  //   try {
  //     const token = localStorage.getItem("token");

  //     await axios.post(
  //       `${process.env.REACT_APP_BASE_URL}/request`,
  //       { wishId, userId: userIdString },
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     Swal.fire({
  //       title: "Request Sent",
  //       text: "Your request to join the pool has been sent to the admin.",
  //       icon: "success",
  //       confirmButtonColor: "#3085d6",
  //     });
  //   } catch (error) {
  //     console.error("Error sending request:", error);
  //     Swal.fire({
  //       title: "Error",
  //       text: "Could not send request to admin. Please try again later.",
  //       icon: "error",
  //       confirmButtonColor: "#FF3366",
  //     });
  //   }
  // };

  const handleStartChat = async () => {
    const token = localStorage.getItem("token");
    try {
      const eventId = poolId;
      console.log(eventId, "eventId");

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/chats/group`,
        { eventId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Success path
      if (response.data.success) {
        navigate(`/chats/${response.data.chat.groupId}`);
      }
    } catch (error) {
      const message = error.response?.data?.message;

      // Handle known backend message
      if (message === "Guest not found for this pool") {
        Swal.fire({
          icon: "info",
          title: "No one invited yet",
          text: "Invite someone to this pool to start a chat.",
          confirmButtonText: "Invite Now",
        }).then((result) => {
          if (result.isConfirmed) {
            setShowInviteModal(true); // Or navigate to your invite screen
          }
        });
      } else {
        // Handle other unexpected errors
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: message || "Something went wrong while starting the chat.",
        });
      }

      console.error("❌ Error starting chat:", message || error.message);
    }
  };

  // const handleStartChat = async () => {
  //   try {
  //     constr token=localStorage.getitem('token')
  //     const response = await axios.post(`/chat/pool-chat`, {
  //       wishId,
  //       guestId,
  //     });

  //     if (response.data.success) {
  //       navigate(`/chat/${response.data.chatId}`);
  //     } else {
  //       if (response.data.message === "Guest not found for this pool") {
  //         Swal.fire({
  //           icon: 'info',
  //           title: 'No one invited yet',
  //           text: 'Invite someone to this pool to start a chat.',
  //           confirmButtonText: 'Invite Now'
  //         }).then((result) => {
  //           if (result.isConfirmed) {
  //             setShowInviteModal(true); // Open the invite modal
  //           }
  //         });
  //       } else {
  //         Swal.fire({
  //           icon: 'error',
  //           title: 'Error',
  //           text: response.data.message || 'Failed to start chat.',
  //         });
  //       }
  //     }
  //   } catch (error) {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Error',
  //       text: 'Something went wrong while starting the chat.',
  //     });
  //   }
  // };

  ``;
  useEffect(() => {
    const fetchPoolData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/pool/${wishId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          setPool(response.data.data);
          setPoolId(response.data.data._id);
          setpoolCreator(response.data.data.userId);
          seteventId(response.data.data.eventId);
        }
      } catch (err) {
        console.error("Error fetching pool data:", err);
      }
    };

    fetchPoolData();
    const interval = setInterval(fetchPoolData, 5000); // Real-time updates every 5 seconds
    return () => clearInterval(interval);
  }, [wishId]);

  if (!pool)
    return <div className="text-center mt-5">Loading pool data...</div>;

  const { totalAmount, collectedAmount, status, contributors, ownerId } = pool;
  const percentage = (collectedAmount / totalAmount) * 100;
  const isPoolCompleted = collectedAmount >= totalAmount;

  const isOwner = String(poolCreator) === String(userId);
  // Check if the current user is the pool owner

  // Filter contributors
  const aggregatedContributors = contributors.reduce((acc, contributor) => {
    const existingContributor = acc.find(
      (c) => c.userId === contributor.userId
    );
    if (existingContributor) {
      existingContributor.amount += contributor.amount;
    } else {
      acc.push({ ...contributor });
    }
    return acc;
  }, []);

  const myContribution = aggregatedContributors.find(
    (contributor) => contributor.userId === userId
  );
  const otherContributors = aggregatedContributors.filter(
    (contributor) => contributor.userId !== userId
  );
  const pendingAmount = Math.max(totalAmount - collectedAmount, 0); // Ensures pending amount never goes negative

  return (
    <div className="container mt-3" style={{ background: "#fff" }}>
      {/* Back Button */}
      <div className="d-flex align-items-center mb-3 gap-3">
        {/* <span
          className="me-2"
          onClick={() => navigate(-1)}
          style={{ cursor: "pointer" }}
        >
          &larr;
        </span> */}

        <FontAwesomeIcon
          icon={faArrowLeft}
          onClick={() => navigate(`/invitation-detail/${pool.eventId}`)}
          style={{ fontSize: "23px" }}
        />
        <h5 className="mb-0">Pooling Wish</h5>
      </div>

      {/* Image Section */}
      <div style={{ maxHeight: "320x", width: "100%" }}>
        <img
          src={
            pool?.Image
              ? `${process.env.REACT_APP_BASE_URL}/${pool.Image}`
              : `${process.env.PUBLIC_URL}/img/wishlistdefault.png`
          }
          alt={pool?.wishName || "Default Gift"}
          className="img-fluid rounded"
          style={{ width: "100%", minHeight: "290px" }}
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite loop
            e.target.src = `${process.env.PUBLIC_URL}/img/wishlistdefault.png`;
          }}
        />

        <div
          className="d-flex align-items-center mt-4 mybar"
          style={{
            position: "absolute",
            backgroundColor: "#FFFFFF",
            borderRadius: "20px",
            opacity: "0.8",
            gap: "10px",
            margin: "12px",
            width: "90%",
            height: "14%",
          }}
        >
          {/* Circular Progress Bar */}
          <div className="d-flex justify-content-center my-4">
            <div
              style={{
                width: "50px",
                height: "70px",
                marginLeft: "5px",
                marginTop: "20px",
              }}
            >
              <CircularProgressbar
                value={percentage}
                text={`${Math.floor(percentage)}%`}
                styles={buildStyles({
                  pathColor: `#ff3366`,
                  textColor: "#ff3366",
                  trailColor: "#d6d6d6",
                  textSize: "16px",
                })}
              />

              {/* {pool.wishItem && pool.wishItem.length > 0 && (
        <h5 className="m-2">{pool.giftName}</h5>
        
      )}
       */}
            </div>
          </div>

          {/* Contribution Details */}
          <div className="text-center">
            <h6>Total Amount: &#8377;{totalAmount}</h6>
            <h6 className="text-muted">Collected: &#8377;{collectedAmount}</h6>
            <h6 className="text-danger">
              Pending: <strong>&#8377;{pendingAmount}</strong>
            </h6>
          </div>
        </div>
      </div>

      <div
        className="d-flex justify-content-between align-items-center mt-2 gap-3"
        style={{
          width: "100%",
          height: "60px",
          border: "0.5px solid #00000040",
          padding: "15px",
        }}
      >
        <img
          src={
            pool.eventOwner.profileImage
              ? `${process.env.REACT_APP_BASE_URL}/${pool.eventOwner.profileImage}`
              : `${process.env.PUBLIC_URL}/img/defaultproduct.jpg`
          }
          style={{ width: "40px", height: "40px", borderRadius: "50%" }}
        />

        <div className="d-flex " style={{ width: "100%", height: "60px" }}>
          <div className="d-flex align-items-center" style={{ gap: "10px" }}>
            <div>
              <h5 className="giftpoolheading" style={{ fontFamily: "Poppins" }}>
                {pool.description}
              </h5>
              <h6 className="text-muted mb-1">{pool.eventOwner.fullName}</h6>
            </div>
          </div>
        </div>

        {pool.status === "Completed" && (
          <div
            className="d-flex justify-content-between align-items-center mt-2 gap-3"
            style={{
              width: "100%",
              height: "60px",
              border: "none",
              padding: "15px",
            }}
          >
            <h5 style={{ fontFamily: "Poppins", fontSize: "14px" }}>
              Pool Completed
            </h5>
            {/* <h6 style={{ marginLeft: "10px" }}>&#8377;{pool.collectedAmount}</h6> */}
          </div>
        )}
      </div>
      <div
        className="d-flex justify-content-between align-items-center mt-2"
        style={{ width: "100%" }}
      >
        <p className="pooltotal">Total Amount</p>
        <p className="amountpool" style={{ marginLeft: "10px" }}>
          &#8377;{totalAmount}
        </p>
      </div>

      <div>
        {" "}
        {pool.status === "Completed" && (
          <div
            className="d-flex justify-content-between align-items-center mt-2"
            style={{ width: "100%" }}
          >
            <p className="poolcontribute">&#8377;Collected Amount</p>
            <p style={{ marginLeft: "10px" }}>&#8377;{pool.collectedAmount}</p>
          </div>
        )}
      </div>

      {/* If pool is completed, show message and don't allow further contributions */}
      {!isPoolCompleted && (
        <div className="mt-4">
          <Form.Group
            className="d-flex align-items-center justify-content-between"
            style={{ width: "100%" }}
          >
            <Form.Label
              className="poolcontribute mb-0"
              style={{ marginRight: "10px" }}
            >
              My Contribution
            </Form.Label>

            <div className="d-flex align-items-center" style={{ gap: "1px" }}>
              {isEditing ? (
                <Form.Control
                  type="number"
                  style={{ width: "60px", marginRight: "10px" }}
                  value={contributionAmount}
                  onChange={(e) => {
                    let value = parseFloat(e.target.value) || 0;
                    const maxValue =
                      totalAmount -
                      collectedAmount +
                      (myContribution?.amount || 0);
                    if (value > maxValue) {
                      Swal.fire(
                        "Error",
                        `Max you can contribute is ₹${maxValue}`,
                        "error"
                      );
                      value = maxValue;
                    }
                    setContributionAmount(value);
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "60px",
                    marginRight: "10px",
                    padding: "6px 12px",
                    border: "1px solid #ced4da",
                    borderRadius: "4px",
                    backgroundColor: "#FFE3EA",
                    fontWeight: "500",
                  }}
                >
                  ₹{myContribution?.amount || 0}
                </div>
              )}

              {!isEditing ? (
                <FaPencilAlt
                  style={{ cursor: "pointer", color: "#dc3545" }}
                  onClick={() => {
                    setContributionAmount(myContribution?.amount || "");
                    setIsEditing(true);
                  }}
                />
              ) : (
                <Button
                  size="sm"
                  variant="danger"
                  onClick={handleSaveContribution}
                  disabled={loading}
                  style={{
                    width: "40%",
                    fontSize: "13px",
                    padding: "4px 10px",
                    borderRadius: "10px",
                  }}
                >
                  {loading ? "Saving..." : "Save"}
                </Button>
              )}
            </div>
          </Form.Group>
        </div>
      )}

      {/* Show My Contribution separately */}
      {/* {myContribution && !isPoolCompleted && (
        <div className="mt-4">
          <h6 className="fw-bold d-flex justify-content-between" >My Contribution: &#8377;{myContribution.amount}</h6>
        </div>
      )} */}

      {/* Contributors List */}
      <div className="mt-4">
        {otherContributors.length > 0 ? (
          <>
            <h2 style={{ textAlign: "left" }}>Contributors</h2>
            <ul style={{paddingLeft:'0px',borderRadius:'0px'}}>
              {otherContributors.map((contributor) => (
                <li key={contributor.userId}>
                  <div
                    className="d-flex align-items-center "
                    style={{ gap: "10px" ,justifyContent:'space-between'}}
                  >
                    <div
                      className="d-flex align-items-center"
                      style={{ gap: "10px" }}
                    >
                      <span>
                        <img
                          src={
                            contributor.profileImage &&
                            contributor.profileImage !== "null" &&
                            contributor.image !==
                              `${process.env.REACT_APP_BASE_URL}/null`
                              ? `${process.env.REACT_APP_BASE_URL}/${contributor.profileImage}`
                              : `${process.env.PUBLIC_URL}/img/eventdefault.png`
                          }
                          alt=""
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "50%",
                            marginRight: "10px",
                          }}
                        />
                      </span>
                      <span style={{fontFamily:'Poppins',
fontWeight: "400",
fontSize: "14px",
lineHeight: "100%",
letterSpacing: "0px",
verticalAlign: "middle"
}}>{contributor.name}</span>
                    </div>
                    <div style={{padding:'7px',backgroundColor:'#FFE3EA'}}>
                      {" "}
                      
                      <span style={{fontFamily:'Poppins',

fontSize: "14px",
lineHeight: "100%",
letterSpacing: "0px",
verticalAlign: "middle"}}>&#8377;{contributor.amount}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {/* Buttons for contributors */}
            {isOwner && (
              <div className="d-flex gap-2 mt-3">
                <button
                  style={{
                    padding: "6px",
                    background: "#dc3545",
                    borderRadius: "8px",
                    color: "#ffffff",
                    border: "none",
                    padding: "15px",
                  }}
                  onClick={() => setShowInviteModal(true)}
                >
                  Invite more member
                </button>
                <button
                  variant="danger"
                  style={{
                    padding: "6px",
                    background: "#dc3545",
                    borderRadius: "8px",
                    color: "#ffffff",
                    border: "none",
                    padding: "15px",
                  }}
                  onClick={handleStartChat}
                >
                  Start Chat
                </button>
              </div>
            )}
          </>
        ) : (
          isOwner && (
            <div
              className="d-flex justify-content-center "
              style={{ position: "relative", bottom: "-25px" }}
            >
              <button
                variant="danger"
                style={{
                  padding: "9px",
                  background: "#dc3545",
                  borderRadius: "15px",
                  color: "white",
                  marginTop: "50px",
                  right: "46px",
                  width: "78%",
                  border: "none",

                  bottom: "5px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "5px",
                }}
                onClick={() => setShowInviteModal(true)}
              >
                POOL INVITES{" "}
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 13 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 6.5C0 6.05127 0.363769 5.6875 0.8125 5.6875H9.87179L5.91095 1.72666C5.58722 1.40293 5.59186 0.876646 5.92125 0.558678C6.24252 0.248547 6.75305 0.253051 7.0688 0.568802L12.9356 6.43565C12.9712 6.47119 12.9712 6.52881 12.9356 6.56435L7.07001 12.43C6.75521 12.7448 6.2448 12.7448 5.93001 12.43C5.61623 12.1162 5.61509 11.6078 5.92746 11.2926L9.87179 7.3125H0.8125C0.363769 7.3125 0 6.94873 0 6.5Z"
                    fill="white"
                  />
                </svg>
              </button>
            </div>
          )
        )}
        <InviteModal
          wishId={wishId}
          show={showInviteModal}
          poolId={poolId}
          setShow={setShowInviteModal}
        />
      </div>
      {/* <button variant="danger"
                  style={{ padding: "6px", background: "#dc3545", borderRadius: "8px", color: "#ffffff" ,border:'none',padding:'15px'}}
             onClick={handleStartChat}   >
                  Start Chat
                </button> */}
    </div>
  );
}

export default PoolingWish;
