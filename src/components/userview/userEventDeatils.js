import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { FaEllipsisV, FaShareAlt, FaArrowRight } from "react-icons/fa";

import "../Eventdetails.css";
import Footer from "../Footer";
import Header from "../Header";
import Navbar from "../navbar";
import img1 from "../../img/SplashScreen3.png";
 // Import WishlistForm



const usereventsDtls = () => {
  const [activeTab, setActiveTab] = useState("details");


  return (
    <>
     <section className="page-controls">  
      <Header />
      <Navbar />
      <div  >
      <div className="container mt-4" >
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="fw-bold">Event Details</h4>
          <div className="d-flex align-items-center">
            <FaShareAlt className="me-3 fs-5" />
            <Dropdown>
              <Dropdown.Toggle as="button" className="btn btn-light border-0">
                <FaEllipsisV />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>Edit Event</Dropdown.Item>
                <Dropdown.Item className="text-danger">Cancel Event</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        {/* Event Image */}
        <div className="mt-3">
          <img src={img1} className="img-fluid rounded" alt="Event" height="100px" width="100px" />
        </div>

        {/* Event Title */}
        <h2 className="mt-3 fw-bold">
          Ayushi 5<span className="small">TH</span> Birthday
        </h2>

        {/* Tabs */}
        <ul className="nav nav-tabs mt-3">
          {["details", "wishlist", "guests", "history"].map((tab) => (
            <li className="nav-item" key={tab}>
              <button
                className={`nav-link ${activeTab === tab ? "active text-danger fw-bold" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            </li>
          ))}
        </ul>
        <div className="tab-content p-3 mt-3 border rounded shadow-sm bg-white">
          {activeTab === "details" && (
            <>
              <p className="d-flex align-items-center">
                <span className="bg-danger text-white p-2 rounded me-2">📅</span>
                25 July, 2024
              </p>
              <p className="d-flex align-items-center">
                <span className="bg-danger text-white p-2 rounded me-2">📍</span>
                Gala Convention Center, 36 Guild Street London, UK
              </p>
              <div className="text-center mt-4">
          <button className="btn btn-danger w-30 d-flex align-items-center justify-content-center">
            SAVE <FaArrowRight className="ms-2" />
          </button>
        </div>
            </>
          )}

          {activeTab === "wishlist" && (
            <div>
              <h5>🎁 Wishlist</h5>
              <p>Items the host would love to receive.</p>
              <div className="text-center mt-4">
          <button className="btn btn-danger w-30 d-flex align-items-center justify-content-center"  onClick={() => setShowWishlistModal(true)}>
            ADD WISHLIST <FaArrowRight className="ms-2" />
          </button>
        </div>
            </div>
          )}

          {activeTab === "guests" && (
            <div>
              <h5>👥 Guest List</h5>
              <p>List of guests attending the event.</p>
              <div className="text-center mt-4">
          <button className="btn btn-danger w-30 d-flex align-items-center justify-content-center"onClick={() => setGuestModal(true)} >
            INVITE <FaArrowRight className="ms-2" />
          </button>
        </div>
            </div>
          )}

          
        </div>

      </div>

      {/* Wishlist Modal */}
     
</div>
      <Footer />
      </section>
    </>
  );
};

export default usereventsDtls;
