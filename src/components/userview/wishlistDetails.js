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

 
  return (
    <section className="page-controls">
  <div className='d-flex align-items-baseline gap-4' style={{marginTop:'20px'}}>
  <FontAwesomeIcon icon={faArrowLeft}  onClick={() => navigate(-1)} style={{marginLeft:'6px'}}/>
  <h2>Wishlist Details</h2>
  </div>
      
      <div className="container " style={{borderColor:'white',padding:"7px"}}>
        {!wishlistItem ? (
          <div style={{ display: "flex", justifyContent: "center",alignItems:'center', marginTop: "200px" }}>
            <Spinner animation="border" role="status" style={{ width: "7rem", height: "7rem" }} />
          </div>
        ) : (
          <div className="card mb-3 mx-auto m-2" style={{ maxWidth: "720px",borderColor:'white' }}>
          <div style={{width: "100%",
height: 240,
top: "20px",
left: "15px",
borderRadius: "5px",
boxShadow:'   0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
}} className="imagediv">
  <img 
    src={wishlistItem.imageUrl ? `${process.env.REACT_APP_BASE_URL}/${wishlistItem.imageUrl}` : `${process.env.PUBLIC_URL}/img/image.png`} 
    alt="image" 
    style={{ width: "100%",maxHeight:'240px' ,border:"1px solid #ffffff,border-radius:'5px"}} 
  />
</div>

            <div className="card-body">
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
                     <h5 className="card-title mb-0">{wishlistItem.giftName || "No Gift Name"}</h5>
                     <div className="dropdown">
                  <select
                    style={{ borderColor: "#ff3366", color: "#ff3366" }}
                    onChange={handlePurchase}
                    value={wishlistItem.status || "Unmark"}
                  >
                    <option value="Unmark">Unmark</option>
                    <option value="Mark">Mark</option>
                    <option value="Purchased">Purchased</option>
                    <option value="CreatePool">Create Pool</option>
                  </select>
                </div>
              </div>
              <p className="mb-3" style={{ color: "#EE4266" }}>
                {wishlistItem.createdAt ? new Date(wishlistItem.createdAt).toLocaleString() : "Date not available"}
              </p>
              {wishlistItem.status === "CreatePool" && (
                <button
                  className="btn mb-4 createpoolbtn"
                  style={{ backgroundColor: "#EE4266", color: "white" }}
                  onClick={handleCreatePool}
                >
                  CREATE POOL
                </button>
              )}
              <div>
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


</div>

              <div>
                <h6 className="fs-1">About</h6>
                <p className="card-text text-muted">{wishlistItem.description || "No description available"}</p>
              </div>
              
              <div className="d-flex justify-content-center">
                <button className="btn w-30 m-2 p-1" style={{ backgroundColor: "#EE4266", width: "180px" }}>
                  SEE ALL WISHES
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
