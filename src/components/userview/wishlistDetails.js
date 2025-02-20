import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../Header";
import Navbar from "../navbar";
import Footer from "../Footer";
import Image1 from "../../img/userimage1.jpg";
import Image2 from "../../img/image.png";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function WishlistCard() {
  const [selected, setSelected] = useState(""); // Track selected status
  const [wishlistItem, setWishlistItem] = useState(null); // Wishlist item data
  const [user, setUser] = useState(null); // User data
  const navigate = useNavigate();
  const emailOrphone = localStorage.getItem("user.emailOrphone");
  const { itemId } = useParams();
  const token = localStorage.getItem("token");
 
  // Fetch user and wishlist item
  useEffect(() => {
    const getData = async () => {
      try {
        // Fetch user profile
        // const userResponse = await axios.get(
        //   `${process.env.REACT_APP_BASE_URL}/auth/get-profile/${emailOrphone}`,
        //   { headers: { Authorization: `Bearer ${token}` } }
        // );
        // setUser(userResponse.data);

        // Fetch wishlist item
        const wishlistResponse = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/wishlist/item/${itemId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWishlistItem(wishlistResponse.data.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    getData();
  }, [itemId]);

  // Handle purchase status change
  const handlePurchase = async (e, itemId) => {
    const value = e.target.value;
    setSelected(value); // Update local state with the selected status

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/wishlist/${itemId}`,
        { status: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWishlistItem(response.data);
      // Success alert
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: `Wishlist item status updated to: ${value}`,
        confirmButtonColor: "#FF3366",
      });

      // Update local state
      setWishlistItem(response.data);
    } catch (err) {
      console.error("Error updating wishlist item:", err);
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Something went wrong while updating the status.",
      });
    }
  };

  // Handle Pool Button Click
  const handlePool = () => {
    Swal.fire({
      title: "Pool",
      text: "You are about to create a pool.",
      icon: "warning",
    }).then(() => {
      navigate("/createpool", { state: { wishlistItem } });
    });
  };

  return (
    <section className="page-controls">
      <Header />
      <Navbar />
      <div className="container mt-4">
        {/* Show loading message until data is fetched */}
        {!wishlistItem ? (
          <p>Loading data...</p>
        ) : (
          <div>
          <div className="card mb-3 mx-auto m-2" style={{ maxWidth: "720px" }}>
            {/* Image Section */}
            {/* <div className="position-relative">
              <img
                src={ Image2}
                className="card-img-top mt-2"
                alt="Wishlist"
              />
              <div className=" p-3 d-flex align-items-center">
                <img
                  src={Image1}
                  className="rounded-circle border border-white mt-2"
                  alt="Organizer"
                  style={{ width: "50px", height: "50px" }}
                />
                <div className="ms-2 text-white">
                  <h6 className="mb-0">
                    {user ? user.fullName : "Organizer"}
                  </h6>
                  <small>Organizer</small>
                </div>
              </div>
            </div> */}
<div >
<img src={Image2} alt="image" style={{width:'-webkit-fill-available'}}/>
</div>
            {/* Card Body */}
            <div className="card-body">
              {/* Title and Dropdown */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">
                  {wishlistItem.giftName || "No Gift Name"}
                </h5>
                <div className="dropdown">
                  <select
                    style={{ borderColor: "#ff3366", color: "#ff3366" }}
                    onChange={(e) => handlePurchase(e, wishlistItem._id)}
                    value={wishlistItem.status || "Unmark"}
                  >
                    <option value="Unmark">Unmark</option>
                    <option value="Mark">Mark</option>
                    <option value="Purchased">Purchased</option>
                  </select>
                </div>
              </div>

              {/* Date */}
              <p className="mb-3" style={{ color: "#EE4266" }}>
                {wishlistItem.createdAt
                  ? new Date(wishlistItem.createdAt).toLocaleString()
                  : "Date not available"}
              </p>

              {/* Create Pool Button - Only shows if status is "Unmark" */}
              {wishlistItem.status === "Unmark" && (
                <button
                  className="btn mb-4 createpoolbtn"
                  style={{ backgroundColor: "#EE4266", color: "white" }}
                  onClick={handlePool}
                >
                  CREATE POOL
                </button>
              )}

              {/* About Section */}
              <div>
                <h6>About Wishlist</h6>
                <p className="card-text text-muted">
                  {wishlistItem.description || "No description available"}
                </p>
              </div>

              {/* See All Wishes Button */}
              <div className="d-flex justify-content-center">
                <button
                  className="btn w-30 m-2 p-1"
                  style={{ backgroundColor: "#EE4266", width: "180px" }}
                >
                  SEE ALL WISHES
                </button>
              </div>
            </div>
          </div>
          </div>
        )}
      </div>
      <Footer />
    </section>
  );
}

export default WishlistCard;
