import React, { useEffect, useState } from 'react';
import { Button, Card, Row, Col } from 'react-bootstrap';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';
import Header from '../Header';
import Footer from '../Footer';
import Navbar from '../navbar';
import './notification.css';
import axios from 'axios';


const NotificationList = () => {
 const[notifications,setNotification]=useState([])
const token =localStorage.getItem('token')
useEffect(() => {
  const fetchNotification = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/notification`, {
        headers: { Authorization: `Bearer ${token}` }, // ✅ Properly closed headers object
      });
  
      setNotification(response.data); // ✅ Call setNotification after response is received
    } catch (error) {
      console.log(error, "error");
    }
  };
  
  fetchNotification();
}, []); // Dependency array to fetch once when the component mounts


  return (
    <>
     <section className="page-controls">  
    <Header/>
    <Navbar/>
    <div className="container mt-4" style={{maxWidth:"800px",margin:"auto" }}>
      <h4 className="fw-bold mb-1">Notification</h4>
<div className="notification-list">
{notifications.length === 0 ? (
  <p>No notifications</p>
) : (
  notifications.map((notification, index) => (
    <div key={index} className="notiControlb">
      <div className="headingimage">
        <div className="mainimage">
          <img src={`${process.env.PUBLIC_URL}/img/userimage2.jpg`}  alt="image1" />
        </div>
        <div>
          <h5 className="mb-0">{notification.fullName}</h5>
          <p className="mb-0 text-muted">{notification.fullName}</p>
          <small className="text-muted"></small>
          <p>{notification.message}</p>
 
        </div>
      </div>

      <div className="acceptBtn">
        <Button variant="danger" className="me-2">
          <FaCheckCircle /> Accept
        </Button>
        <Button variant="outline-danger" className="me-2">
          <FaTimes />
        </Button>
      </div>
   </div>
    
  ))
)}

</div>

</div>




    <Footer/>
    </section>
    </>
  );
};

export default NotificationList;
