import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../Header";
import Navbar from "../navbar";
import Footer from "../Footer";
import Image1 from '../../img/userimage1.jpg';
import Image2 from '../../img/image.png';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";  // Import axios for API calls
import PoolingWish from "../Pooloptions/Createpool";



function WishlistCard() {
  const [selected, setSelected] = useState("");  // Track selected status
  const [wishlistItem, setWishlistItem] = useState("");  // For wishlist item
  const [user, setUser] = useState(null); // For user data
  const navigate = useNavigate();
  const emailOrphone = localStorage.getItem('user.emailOrphone');
  const { itemId } = useParams();

  // Fetch data when the component mounts
  useEffect(() => {
    const getData = async () => {
      try {
        // Get user profile
        const userResponse = await axios.get(`http://localhost:3001/auth/get-profile/${emailOrphone}`);
        setUser(userResponse.data);

        // Get wishlist item details
        const wishlistResponse = await axios.get(`http://localhost:3001/api/wishlist/${itemId}`);
        setWishlistItem(wishlistResponse.data.data);  // Assuming single wishlist item
        console.log(wishlistItem.description)
        console.log(wishlistResponse.data.data)
        console.log(wishlistItem);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    getData();
  }, [emailOrphone, itemId]);

  // Function to handle purchase option change
  const handlePurchase = async (e, itemId) => {
    const value = e.target.value;
    setSelected(value);  // Update local state with the selected status

    try {
      const response = await axios.put(`http://localhost:3001/api/wishlist/${itemId}`, {
        status: value,  // Send updated status
      });

      // Success alert
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: `Wishlist item status updated to: ${value}`,
        confirmButtonColor: "#FF3366",
      });

      // Optionally, update local state to reflect changes immediately
      const updatedItem = response.data;
      setWishlistItem(updatedItem);
    } catch (err) {
      console.error("Error updating wishlist item:", err);
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Something went wrong while updating the status.',
      });
    }
  };

  const handlePool = () => {
    Swal.fire({
      title: 'Pool',
      text: 'You are about to create a pool.',
      icon: 'warning',
    }).then(() => {
      navigate('/createpool', { state: { wishlistItem: wishlistItem } });

      
    });
  };

  return (
    <section className="page-controls">
      <Header />
      <Navbar />
      <div className="container mt-4">
        {/* Check if wishlistItem and user data are loaded */}
        {wishlistItem && user ? (
          <div className="card mb-3 mx-auto m-2" style={{ maxWidth: "720px" }}>
            {/* Image Section */}
            <div className="position-relative">
              <img src={Image2} className="card-img-top mt-2" alt="Wishlist" />
              <div className="position-absolute top-0 start-0 p-3 d-flex align-items-center">
                <img
                  src={Image1}
                  className="rounded-circle border border-white mt-2"
                  alt="Organizer"
                  style={{ width: "50px", height: "50px" }}
                />
                <div className="ms-2 text-white">
                  <h6 className="mb-0">{user ? user.fullName : "Organizer"}</h6>
                  <small>Organizer</small>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="card-body">
              {/* Title and Dropdown */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">{wishlistItem.giftName}</h5>
                <div className="dropdown">
                  <select
                    style={{ borderColor: "#ff3366", color: "#ff3366" }}
                    onChange={(e) => handlePurchase(e, wishlistItem._id)}  // Pass item ID to update the correct item
                    value={wishlistItem.status}  // Set the current status in the dropdown
                  >
                    <option value="" disabled>Select an option</option>
                    <option value="Mark">Mark</option>
                    <option value="Unmark">Unmark</option>
                    <option value="Purchased">Purchased</option>
                  </select>
                </div>
              </div>

              {/* Date */}
              <p className="mb-3" style={{ color: "#EE4266" }}>
                {new Date(event).toLocaleString()}  {/* Format date if needed */}
              </p>

              {/* Create Pool Button */}
              <button className="btn  mb-4 createpoolbtn" style={{ backgroundColor: "#EE4266", color: "white" }} onClick={handlePool}>
                CREATE POOL
              </button>

              {/* About Section */}
              <div>
                <h6>About Wishlist</h6>
                <p className="card-text text-muted">{wishlistItem.description}</p>
              </div>
             
              <div className="d-flex justify-content-center">
                <button className="btn w-30 m-2 p-1" style={{ backgroundColor: "#EE4266", width: "180px" }}>
                  SEE ALL WISHES
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading data...</p>  // Show loading message if data is not loaded yet
        )}
      </div>
      <Footer />
    </section>
  );
}

export default WishlistCard;
