import React from "react";
import { FaHome, FaComments, FaUsers, FaPlus } from "react-icons/fa";
import { useState,useEffect } from "react";
import FloatingActionButton from "./FloatingTab";
import { useNavigate } from "react-router-dom";
import './Tabfooter.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faCommentDots, faPlus } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons';
const FooterNavBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [active, setActive] = useState("home");
const navigate=useNavigate();
  // Toggle dropdown on button click
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);
  const handleGroup=()=>{
    navigate('/chats')
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "70px",
        backgroundColor: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
      }}
    >
      {/* Home Icon */}
      <div className="bottom-nav">
      <div className={`nav-item ${active === "home" ? "active" : ""}`} onClick={() => setActive("home")}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M24 10.5811V21.5458C24 22.7958 22.9875 23.8083 21.7396 23.8083H17.4396C17.1271 23.8062 16.8292 23.6812 16.6084 23.4583C16.3876 23.2375 16.2647 22.9375 16.2667 22.625V14.4314C16.2667 14.1169 16.1417 13.8148 15.9188 13.594C15.6959 13.371 15.3917 13.2461 15.0772 13.2481H8.93324C8.61658 13.244 8.31032 13.3669 8.08536 13.5898C7.86036 13.8127 7.73328 14.1148 7.73328 14.4314V22.625C7.73536 22.9395 7.61036 23.2395 7.38744 23.4624C7.16662 23.6854 6.86453 23.8103 6.54996 23.8083H2.2604C1.01252 23.8083 0 22.7958 0 21.5458V10.5811C0 10.2394 0.147913 9.91236 0.406246 9.68527L11.2205 0.287497C11.6684 -0.0958324 12.3309 -0.0958324 12.7789 0.287497L23.5894 9.68527C23.8498 9.91027 24 10.2374 24 10.5811Z" fill="#EE4266"/>
</svg>


      </div>
      <div className={`nav-item ${active === "search" ? "active" : ""}`} onClick={() => setActive("search")}>
      <svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21.4288 0H2.57145C1.15717 0 0 1.10373 0 2.4527V15.2229C0 16.5801 1.15717 17.6756 2.57145 17.6756H7.06292C7.29435 17.6756 7.50864 17.7656 7.67151 17.9209L11.3914 21.469C11.5543 21.6244 11.7686 21.7143 12 21.7143C12.2314 21.7143 12.4457 21.6244 12.6086 21.469L16.3285 17.9209C16.4913 17.7656 16.7056 17.6756 16.9371 17.6756H21.4285C22.8428 17.6756 24 16.5801 24 15.2229V2.4527C24 1.10373 22.8431 0 21.4288 0ZM16.2859 12.2062H7.71436C7.24291 12.2062 6.85721 11.8465 6.85721 11.3886C6.85721 10.939 7.24291 10.5711 7.71436 10.5711H16.2859C16.7573 10.5711 17.143 10.939 17.143 11.3886C17.143 11.8465 16.7573 12.2062 16.2859 12.2062ZM16.2859 7.00647H7.71436C7.24291 7.00647 6.85721 6.63858 6.85721 6.18891C6.85721 5.73923 7.24291 5.37134 7.71436 5.37134H16.2859C16.7573 5.37134 17.143 5.73923 17.143 6.18891C17.143 6.63858 16.7573 7.00647 16.2859 7.00647Z" fill="#D8D8D8"/>
</svg>

      </div>
      <div className={`nav-item ${active === "profile" ? "active" : ""}`} onClick={() => setActive("profile")}>
      <svg width="24" height="21" viewBox="0 0 24 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.09289 7.70191C5.91242 7.70191 6.73293 7.42905 7.37857 6.95637C7.30363 6.60856 7.25463 6.26078 7.25463 5.88798C7.25463 4.54675 7.80132 3.32954 8.69579 2.45983C8.09914 0.99371 6.65897 0.000265783 5.09375 0.000265783C2.957 -0.0247136 1.24207 1.71429 1.24207 3.84998C1.24207 5.98673 2.95705 7.70167 5.09277 7.70167L5.09289 7.70191Z" fill="#D8D8D8"/>
<path d="M6.0374 18.7075V15.7011C6.0374 13.4904 7.22973 11.5275 9.04373 10.4841C8.24917 9.46573 7.05591 8.77012 5.73955 8.62122C5.51569 8.6462 5.3168 8.67117 5.09391 8.67117C4.87005 8.67117 4.64716 8.6462 4.42329 8.62122C1.91379 8.91904 0 11.0798 0 13.6392V16.9683C0 17.1921 0.0989583 17.415 0.322818 17.6139C1.21825 18.4094 3.62801 18.8564 6.0374 18.7075Z" fill="#D8D8D8"/>
<path d="M23.6772 17.614C23.9011 17.4151 24 17.1912 24 16.9683V13.6393C24 11.0808 22.1121 8.94397 19.6026 8.62128C19.3787 8.64626 19.1798 8.67123 18.9569 8.67123C18.7331 8.67123 18.5102 8.64626 18.2863 8.62128C17.0191 8.7702 15.8267 9.4408 15.0072 10.4602C16.8461 11.5036 18.0635 13.4665 18.0635 15.702V18.7084C20.4971 18.8813 22.8319 18.4335 23.6772 17.614Z" fill="#D8D8D8"/>
<path d="M17.1181 15.7011C17.1181 13.1427 15.2052 10.981 12.6456 10.658C12.4467 10.683 12.2478 10.708 12.0489 10.708C11.8251 10.708 11.6262 10.683 11.4283 10.658V10.683C8.8937 10.9808 6.95581 13.1426 6.95581 15.7261V19.0551C6.95581 19.4029 7.20465 19.7257 7.70136 19.9995C9.68918 21.1179 14.4834 21.1179 16.3972 19.9746C16.8689 19.7017 17.0927 19.3779 17.0927 19.0551V15.701L17.1181 15.7011Z" fill="#D8D8D8"/>
<path d="M12.0748 2.01221C9.93807 2.01221 8.22412 3.7512 8.22412 5.86291C8.22412 7.97467 9.96311 9.71361 12.0748 9.71361C14.2116 9.71361 15.9255 7.97462 15.9255 5.86291C15.9255 3.75115 14.1865 2.01221 12.0748 2.01221Z" fill="#D8D8D8"/>
<path d="M16.8691 5.88802C16.8691 6.28578 16.8192 6.65855 16.7202 7.00636C17.3659 7.45311 18.1364 7.70195 18.931 7.70195C21.0677 7.70195 22.7817 5.96296 22.7817 3.85125C22.7817 1.73954 21.0427 0.000549316 18.931 0.000549316C17.3409 0.000549316 15.9497 0.944974 15.353 2.41016C16.2984 3.27967 16.8691 4.49674 16.8691 5.88802Z" fill="#D8D8D8"/>
<path d="M7.92538 8.32241C7.85044 8.17349 7.77646 8.04954 7.70152 7.89966C7.60256 7.9746 7.50264 8.0236 7.40369 8.07356C7.57759 8.1485 7.75148 8.22346 7.92538 8.32241Z" fill="#D8D8D8"/>
<path d="M16.6462 8.0736C16.5713 8.02364 16.4973 7.97464 16.3974 7.92468C16.3475 8.02364 16.2985 8.14854 16.2235 8.2475C16.3724 8.1985 16.4973 8.12356 16.6462 8.0736Z" fill="#D8D8D8"  onClick={handleGroup}/>
</svg>

      </div>
    </div>

      {/* Floating Add Icon */}
      

      {/* People Group Icon */}
    
      {/* <div
        style={{
          position: "",
          bottom: "35px",
          backgroundColor: "#FF3366",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
</div> */}
    
      {/* <div className="dropdown-button" onClick={toggleDropdown}>
        <FaPlus style={{ fontSize: "28px", color: "white" }} />
      </div>  */}

      {/* Dropdown Menu */}
      {/* <div className={`dropdown-menu ${isOpen ? "show" : ""}`}>
        <p className="dropdown-option">Add Event</p>
        <p className="dropdown-option">Add Member</p>
      </div> */}
      <div>
      <FloatingActionButton/>
    </div>
      </div>
    
  );
};

export default FooterNavBar;
