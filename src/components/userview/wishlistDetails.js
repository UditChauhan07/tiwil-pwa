import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../Header";
import Navbar from "../navbar";
import Footer from "../Footer";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function WishlistCard() {
  const [selected, setSelected] = useState(""); // Track selected status
  const [wishlistItem, setWishlistItem] = useState(null); // Wishlist item data
  const navigate = useNavigate();
  const { itemId } = useParams();
  const token = localStorage.getItem("token");

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

  // Handle purchase status change
  const handlePurchase = async (e) => {
    const value = e.target.value;
    setSelected(value);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/wishlist/${itemId}`,
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

  // Handle Pool Button Click
  const handleCreatePool = async () => {
    if (status === "Pooling" || status === "Completed") return;

    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/pool/create`,
        { wishId: item._id, totalAmount: item.price },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      if (response.data.success) {
        navigate("/pooling", { state: { item } });
      }
    } catch (error) {
      console.error("❌ Error creating pool:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-controls">
      <Header />
      <Navbar />
      <div className="container mt-4">
        {!wishlistItem ? (
          <p>Loading data...</p>
        ) : (
          <div className="card mb-3 mx-auto m-2" style={{ maxWidth: "720px" }}>
            <div>
              <img src={`${process.env.PUBLIC_URL}/img/image.png`} alt="image" style={{ width: "-webkit-fill-available" }} />
            </div>
            <div className="card-body">
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
                  </select>
                </div>
              </div>
              <p className="mb-3" style={{ color: "#EE4266" }}>
                {wishlistItem.createdAt ? new Date(wishlistItem.createdAt).toLocaleString() : "Date not available"}
              </p>
              {wishlistItem.status === "Unmark" && (
                <button
                  className="btn mb-4 createpoolbtn"
                  style={{ backgroundColor: "#EE4266", color: "white" }}
                  onClick={handleCreatePool}
                >
                  CREATE POOL
                </button>
              )}
              <div>
                <h6>About Wishlist</h6>
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
      <Footer />
    </section>
  );
}

export default WishlistCard;
