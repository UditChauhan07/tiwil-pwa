import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../Navbar/navbar";
import Swal from "sweetalert2";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { Spinner } from "react-bootstrap";
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';


function WishlistCard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { itemId } = useParams();
  const [wishlistItem, setWishlistItem] = useState(null);
   const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");
  const { item } = location.state || {};

  useEffect(() => {
    const getData = async () => {
      try {
        const wishlistResponse = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/wishlist/item/${itemId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWishlistItem(wishlistResponse.data.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    if (!wishlistItem) {
      getData();
    }
  }, [itemId, token]);

  const handlePurchase = async (e) => {
    const value = e.target.value;
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/update-status/${itemId}`,
        { status: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWishlistItem(response.data.data);
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: `Wishlist item status updated to: ${value}`,
        confirmButtonColor: "#FF3366",
      });

      
    } catch (err) {
      console.error("Error updating wishlist item:", err);
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Something went wrong while updating the status.",
      });
    }
  };

  const handleCreatePool = async () => {
   

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/pool/create`,
        { wishId: itemId, totalAmount: wishlistItem?.price },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const wishId=itemId
      if (response.data.success) {
        navigate(`/createpool/${wishId}`, { state: { item } });
      }
    } catch (error) {
      console.error("❌ Error creating pool:", error);
    } finally {
      setIsLoading(false);
    }
  };

 const handleClick=()=>{
  navigate('/invitation-detail/${wishlistItem.eventId}?tab=wishlist')
 }
  return (
    <section className="page-controls">
  <div className='d-flex align-items-baseline gap-4' style={{marginTop:'20px'}}>
  <FontAwesomeIcon icon={faArrowLeft}  onClick={() => navigate(-1)} style={{marginLeft:'6px',fontSize:'27px'}}/>
  <h2>Wishlist</h2>
  </div>
     
      <div className="container " style={{borderColor:'white',padding:"7px"}}>
      
        {!wishlistItem ? (
          <div style={{ display: "flex", justifyContent: "center",alignItems:'center', marginTop: "200px" }}>
            {/* <Spinner animation="border" role="status" style={{ width: "7rem", height: "7rem" }} /> */}
            <div class="spinner-border text-danger custom-spinner" role="status" style={{width: '5rem', height: '5rem',color:'#ff3366'}}>
  <span class="visually-hidden">Loading...</span>
</div>
          </div>
        ) : (
          <div>
          <div className="card mb-3 mx-auto m-2" style={{ maxWidth: "720px",borderColor:'white' }}>
          <div style={{width: "100%",
height: "250px",
top: "20px",
left: "15px",
borderRadius: "5px",

}} className="imagediv">
  <img 
    src={wishlistItem.imageUrl ? `${process.env.REACT_APP_BASE_URL}/${wishlistItem.imageUrl}` : `${process.env.PUBLIC_URL}/img/wishlistdefault.png`} 
    alt="image" 
    style={{ width: "100%",maxHeight:'250px' ,border:"1px solid #ffffff,border-radius:'5px"}} 
  />
</div>

            <div className="card-body p-0">
            <div>
            {/* <img
  src={wishlistItem.eventImage ? `${process.env.REACT_APP_BASE_URL}/${wishlistItem.eventImage}` : "/path/to/fallback/image.png"}
  alt="Product"
  onError={(e) => e.target.src = "/path/to/fallback/image.png"} // If image fails to load, show fallback
  style={{
    width: "20px",  // Example width
    height: "20px", // Example height
    objectFit: "cover", // Ensures the image covers the area without distortion
  }}
/> */}
   
            {/* <div>
            
              <h5 className="card-title mb-0">{wishlistItem.eventName || "No  Name"}</h5>
              <h5 className="card-title mb-0">{wishlistItem.eventType || "No  Name"}</h5>
              </div> */}
              
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center gap-3">
                  <div>
                  <img
  src={`${process.env.REACT_APP_BASE_URL}/${wishlistItem.eventImage}`} 
  alt="Event"
  style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '10px' }}
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = `${process.env.PUBLIC_URL}/img/eventdefault1.png`; 
  }}
/>

                  </div>
                  <div>
                  <p style={{fontFamily: 'Poppins',
fontWeight: "400",
fontSize: '15px',
lineHeight: '25px',
letterSpacing: '0px',
verticalAlign: 'middle'
}}>{wishlistItem.eventName}</p>
                  <p className="text-muted">Owner</p>
                  </div>
                  </div>
                     <div className="dropdown">
                  <select
                    style={{ borderColor: "#ff3366", color: "#ff3366" }}
                    onChange={handlePurchase}
                    value={wishlistItem.status || "Unmark"}
                  >
                    <option value="Unmark"><FontAwesomeIcon icon={faCircleCheck} size="lg" color="#28a745" />
                    Unmark</option>
                    <option value="Mark"><FontAwesomeIcon icon={faCircleCheck} size="lg" color="#28a745" />
                      Mark</option>
                    <option value="Purchased"><FontAwesomeIcon icon={faCircleCheck} size="lg" color="#28a745" />
                    Purchase</option>
                    <option value="CreatePool"><FontAwesomeIcon icon={faCircleCheck} size="lg"  />
                    Create Pool</option>
                  </select>
                   <FontAwesomeIcon
                                    icon={faChevronDown}
                                   style={{  position: "absolute",
  right: "10px",
  top: "50%",
  transform: "translateY(-50%)" ,
  fontSize: "18px",
  color: "#ff3366",
  pointerEvents: "none"}}
                                  />
                </div>
              </div>
              <div>
              <h5 className="card-title mb-0">{wishlistItem.giftName || "No Gift Name"}</h5>
              <p className="mb-3" style={{ color: "#EE4266",fontFamily: "Poppins",
fontWeight: "400",
fontSize: "12px",
lineHeight: "100%",
letterSpacing: "0%"
}}>{wishlistItem.createdAt
  ? new Date(wishlistItem.createdAt).toLocaleString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).replace(":", ".")
  : "Date not available"}

              </p>
              </div>
              {wishlistItem.status === "CreatePool" && (
                <button
                  className="btn mb-4 createpoolbtn"
                  style={{ backgroundColor: "#EE4266", color: "white" ,width:'50%'}}
                  onClick={handleCreatePool}
                >
                  CREATE POOL
                </button>
              )}
              {/* <div>
                <h6 className="fs-2">Desire rate:{wishlistItem.desireRate  || "just description"}%</h6>
                
              </div>
              <div  style={{display:'ruby-text'  }}>
                <h6 className="d-flex align-item-center">Product Link :</h6>
                <a 
  href={/^https?:\/\//.test(wishlistItem.productLink) ? wishlistItem.productLink : `https://${wishlistItem.productLink}`} 
  target="_blank" 
  rel="noopener noreferrer"
>
  <p className="p-1">{wishlistItem.productLink || "Link available soon"}</p>
</a>


</div> */}

              <div>
                <p  style={{fontFamily: "Poppins",
fontWeight: "400",
fontSize: "18px",
lineHeight: "34px",
letterSpacing: "0px",
verticalAlign: "middle"
        }}>About Wishlist</p>
                <p className="card-text text-muted" style={{fontFamily: "Poppins",
fontWeight: "300",
fontSize: "16px",
lineHeight: "24px",
letterSpacing: "0px"
}}>{wishlistItem.description || "No description available"}</p>
              </div>
              </div>
              <br/>
              <p style={{fontFamily: "Poppins",
fontWeight: "500",
fontSize: "17px",
lineHeight: "100%",
letterSpacing: "0%",
color:" #EE4266",

}}> Help To Complete This Wish</p>
              <div className="d-flex justify-content-center " style={{marginTop:'30px'}} >
                <button className="btn w-30 m-2 p-1 d-flex align-items-center gap-2 justify-content-center" style={{ backgroundColor: "#EE4266", width: "180px",color:'#fff' }} onClick={() => navigate(`/invitation-detail/${wishlistItem.eventId}?tab=wishlist`)}>
                  SEE ALL WISHES <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 6.5C0 6.05127 0.363769 5.6875 0.8125 5.6875H9.87179L5.91095 1.72666C5.58722 1.40293 5.59186 0.876646 5.92125 0.558678C6.24252 0.248547 6.75305 0.253051 7.0688 0.568802L12.9356 6.43565C12.9712 6.47119 12.9712 6.52881 12.9356 6.56435L7.07001 12.43C6.75521 12.7448 6.2448 12.7448 5.93001 12.43C5.61623 12.1162 5.61509 11.6078 5.92746 11.2926L9.87179 7.3125H0.8125C0.363769 7.3125 0 6.94873 0 6.5Z" fill="white"/>
</svg>

                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    
    </section>
  );
}

export default WishlistCard;
