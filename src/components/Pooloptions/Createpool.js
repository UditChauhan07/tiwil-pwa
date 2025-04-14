import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Button, Form } from "react-bootstrap";
import { FaArrowRight } from "react-icons/fa";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import InviteModal from "../GuestInvite/PoolguestModal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function PoolingWish() {
  const { wishId } = useParams();
  const navigate = useNavigate();
  const [pool, setPool] = useState(null);
  const [loading, setLoading] = useState(false);
  const [contributionAmount, setContributionAmount] = useState(""); 
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [poolId, setPoolId] = useState(null);
  const [userStatus, setUserStatus] = useState(null);
  const [poolCreator,setpoolCreator]=useState(null) 
  const userId = localStorage.getItem("userId");
  const [eventId,seteventId]=useState("")





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
        const { data } = await axios.get(`${process.env.REACT_APP_BASE_URL}/guests/userId/${wishId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const loggedInUserId = localStorage.getItem("userId");

        // Check if the user is in the guest list and find their status
        const guest = data.guestUsers.find(user => user.userId === loggedInUserId);
        if (guest) {
          setUserStatus(guest.status);
        }
      } catch (err) {
        console.error("Error fetching user status:", err);
      }
    };

    fetchUserStatus();
  }, [wishId]);
console.log('pool',poolCreator)
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
        showCancelButton: true,  // Show the Cancel button
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#ff3366",
        iconColor:'#ff3366',
      }).then(async (result) => {
        if (result.isConfirmed) {
          // If the user clicked "OK"
          try {
            const itemId = wishId;
            const response = await axios.post(
              `${process.env.REACT_APP_BASE_URL}/request`, // Replace with your actual API endpoint
              { itemId}, // Sending userId in the body
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`, 
                },
              }
            );
      
            if (response.data.success) {
              Swal.fire({
                title: "Request Sent!",
                text: "Your request has been sent to the pool admin.",
                icon: "success",
                confirmButtonColor: "#ff3366",
                
                iconColor:'#ff3366',
              });
            } else {
              Swal.fire({
                title: "Error!",
                text: "There was an issue sending the request.",
                icon: "error",
                
                confirmButtonColor: "#ff3366",
                iconColor:'#ff3366',
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
          icon: 'info',
          title: 'No one invited yet',
          text: 'Invite someone to this pool to start a chat.',
          confirmButtonText: 'Invite Now',
        }).then((result) => {
          if (result.isConfirmed) {
            setShowInviteModal(true); // Or navigate to your invite screen
          }
        });
      } else {
        // Handle other unexpected errors
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: message || 'Something went wrong while starting the chat.',
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
    

    ``
  useEffect(() => {
    const fetchPoolData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/pool/${wishId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (response.data.success) {
          setPool(response.data.data);
          setPoolId(response.data.data._id);
          setpoolCreator(response.data.data.userId)
          seteventId(response.data.data.eventId)
        }
      } catch (err) {
        console.error("Error fetching pool data:", err);
      }
    };

    fetchPoolData();
    const interval = setInterval(fetchPoolData, 5000); // Real-time updates every 5 seconds
    return () => clearInterval(interval);
  }, [wishId]);
  
  if (!pool) return <div className="text-center mt-5">Loading pool data...</div>;

  const { totalAmount, collectedAmount, status, contributors, ownerId } = pool;
  const percentage = (collectedAmount / totalAmount) * 100;
  const isPoolCompleted = collectedAmount >= totalAmount;

  const isOwner = String(poolCreator) === String(userId);
 // Check if the current user is the pool owner

  // Filter contributors
  const aggregatedContributors = contributors.reduce((acc, contributor) => {
    const existingContributor = acc.find(c => c.userId === contributor.userId);
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
    <div className="container mt-3" style={{background:'#fff'}}>
      {/* Back Button */}
      <div className="d-flex align-items-center mb-3 gap-3">
        {/* <span
          className="me-2"
          onClick={() => navigate(-1)}
          style={{ cursor: "pointer" }}
        >
          &larr;
        </span> */}

         <FontAwesomeIcon icon={faArrowLeft}  onClick={() => navigate(`/invitation-detail/${pool.eventId}`)}/>
        <h5 className="mb-0">Pooling Wish</h5>
      </div>

      {/* Image Section */}
      <div  style={{ height:'300px',width:'100%'}}>
 
  
      <img
  src={
    pool?.Image
      ? `${process.env.REACT_APP_BASE_URL}/${pool.Image}`
      : `${process.env.PUBLIC_URL}/img/defaultproduct.jpg`
  }
  alt={pool?.wishName || "Default Gift"}
  className="img-fluid rounded"
  style={{ width: "100%", maxHeight: "308px" }}
  onError={(e) => {
    e.target.onerror = null; // Prevent infinite loop
    e.target.src = `${process.env.PUBLIC_URL}/img/defaultproduct.jpg`;
  }}
/>

   
 

      <div className="d-flex align-items-center mt-4" style={{position:'absolute', top:'210px',backgroundColor:'#fff',borderRadius:'20px', opacity:'0.8',gap:'10px',margin:'12px',width:'90%',height:'14%'}}>
        {/* Circular Progress Bar */}
        <div className="d-flex justify-content-center my-4">
          
          <div style={{ width: "50px", height: "70px",marginLeft: "5px"}}>
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
          <h6 className="text-muted" >Collected: &#8377;{collectedAmount}</h6>
          <h6 className="text-danger">
            Pending: <strong>&#8377;{pendingAmount}</strong>
          </h6>
    

   </div>
   
      </div>

      <div className="d-flex justify-content-between align-items-center mt-2" style={{width:'100%'}}>
    <img
      />
      <div className="d-flex " style={{width:'100%' }}>
        <div className="d-flex align-items-center" style={{gap:'10px'}}>
         <div><h6>{pool.giftName}</h6></div>
         <div></div>

      </div>
     </div> 
    
   
    </div>

      {/* If pool is completed, show message and don't allow further contributions */}
      {isPoolCompleted ? (
        <div className="text-center my-4">
          <h4>Pool is Completed</h4>
          {myContribution && (
            <div>
              <h6>My Contribution: &#8377;{myContribution.amount}</h6>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Contribution Input */}
          <div
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
          >
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
                // disabled={userStatus === "pending" || userStatus === "declined"} // Disable input if status is pending or declined
              />
            </Form.Group>
          </div>

          {/* Save Contribution Button */}
          <div className="mt-4 text-center">
            <Button
              variant="danger"
              className="w-100 py-2 d-flex align-items-center justify-content-center"
              onClick={handleSaveContribution}
              // disabled={userStatus === "pending" || userStatus === "declined"} // Disable button if status is pending or declined
            >
              {loading ? "Processing..." : "Save Amount"} <FaArrowRight className="ms-2" />
            </Button>
          </div>
          </>
        )}

      {/* Show My Contribution separately */}
      {myContribution && !isPoolCompleted && (
        <div className="mt-4">
          <h6 className="fw-bold d-flex justify-content-between" >My Contribution: &#8377;{myContribution.amount}</h6>
        </div>
      )}

      {/* Contributors List */}
      <div className="mt-4">
        <h2 style={{textAlign:'left'}}>Contributors</h2>
        {otherContributors.length > 0 ? (
          <>
            <ul>
              {otherContributors.map((contributor) => (
                <li key={contributor.userId}>
                  <span>
                    <img
                      src={
                        contributor.profileImage && contributor.profileImage !== "null" && 
                        contributor.image !== `${process.env.REACT_APP_BASE_URL}/null`
                          ? `${process.env.REACT_APP_BASE_URL}/${contributor.profileImage}`
                          : `${process.env.PUBLIC_URL}/img/eventdefault.png`
                      }
                      alt="image"
                      style={{ width: "30px", height: "30px", borderRadius: "50%", marginRight: "10px" }}
                    />
                  </span>
                  <span>{contributor.name}</span>: <span>&#8377;{contributor.amount}</span>
                </li>
              ))}
            </ul>      
            {/* Buttons for contributors */}
            {isOwner && (
              <div className="d-flex gap-2 mt-3">
                <button
                  style={{ padding: "6px", background: "#dc3545", borderRadius: "8px",color:'#ffffff' , border:"none",padding:'15px'}}
                  onClick={() => setShowInviteModal(true)}
                >
                  invite more member
                </button>
                <button variant="danger"
                  style={{ padding: "6px", background: "#dc3545", borderRadius: "8px", color: "#ffffff" ,border:'none',padding:'15px'}}
             onClick={handleStartChat}   >
                  Start Chat
                </button>
              </div>
            )}
          </>
        ) : (
          isOwner  &&(
            <div className='d-flex justify-content-center '>
            <button variant="danger"
              style={{ padding: "9px", background: "#dc3545", borderRadius: "20px",color: "white",
  marginBottom:'22px'
    ,right: "46px",
    width: '78%',
    border: "none" ,
    bottom:'50px'}}
              onClick={() => setShowInviteModal(true)}
            >
              Invite Member
            </button>
            </div>
          )
        )}
        <InviteModal wishId={wishId} show={showInviteModal} poolId={poolId} setShow={setShowInviteModal} />
      </div>
      <button variant="danger"
                  style={{ padding: "6px", background: "#dc3545", borderRadius: "8px", color: "#ffffff" ,border:'none',padding:'15px'}}
             onClick={handleStartChat}   >
                  Start Chat
                </button>
    </div>
    </div>
  );
}

export default PoolingWish;