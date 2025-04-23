import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../Profile/FamilyInformation.module.css";
import EditFamilyModal from "../Profile/EditFamilyModal";
import Navbar from "../Navbar/navbar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

const FamilyInformation = () => {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [editModal, setEditModal] = useState({
    isOpen: false,
    relation: null,
    detail: null,
  });
  const navigate=useNavigate();

  useEffect(() => {
    fetchFamilyInfo(); // Fetch initial data
  }, []);

  const fetchFamilyInfo = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/family-info`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setFamilyMembers(response.data.data.familyMembers || []);
      }
    } catch (error) {
      console.error("Error fetching family information:", error);
    }
  };

  const handleOpenEditModal = (relation, detail) => {
    setEditModal({ isOpen: true, relation, detail });
  };

  const handleCloseEditModal = () => {
    setEditModal({ isOpen: false, relation: null, detail: null });
  };

  const handleUpdateFamilyInfo = () => {
    fetchFamilyInfo(); // ✅ Re-fetch updated family data
    handleCloseEditModal();
  };

  
  return (
    <div className={styles.container} >
    <div className="d-flex " style={{gap:"69px"}}>
        <FontAwesomeIcon icon={faArrowLeft} style={{fontSize:'x-large'}} onClick={() => navigate(-1)}/>
      <h1 className={styles.header}>View Detail</h1>
</div>
      {familyMembers.map((member, index) => (
        <FamilyCard
          key={index}
          relation={member.relationType}
          detail={member}
          onEdit={() => handleOpenEditModal(member.relationType, member)}
        />
      ))}

      {editModal.isOpen && (
        <EditFamilyModal
          relation={editModal.relation}
          detail={editModal.detail}
          onClose={handleCloseEditModal}
          onSave={handleUpdateFamilyInfo} // ✅ Updates UI
        />
      )}
    </div>
  );
};

const FamilyCard = ({ relation, detail, onEdit }) => {
  const formatDateWithCurrentYear = (dob) => {
    const eventDate = new Date(dob);
    if (isNaN(eventDate.getTime())) return "Invalid Date";
  
    const today = new Date();
    const currentYear = today.getFullYear();
  
    // Set eventDate's year to the current year
    eventDate.setFullYear(currentYear);
  
    // If today's date has already passed the eventDate, move it to next year
    if (today > eventDate) {
      eventDate.setFullYear(currentYear + 1);
    }
  
    return eventDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };
  
  return (
    <>
    <div className={`${styles.card} ${relation.includes("Anniversary") ? styles.anniversaryCard : ""}`}>

      <div className={styles.cardHeader}>
        <h2>{relation.toUpperCase()}</h2>
        <div className={styles.menuContainer}>
          {/* <button className={styles.menuButton} onClick={onEdit}>⋮</button> */}
          <div className={styles.menuOptions}>
            <button onClick={onEdit} style={{color:'#fff', border:'none',padding:'2px',top:'-20px',  fontSize:'20px',
    fontWeight:'800',background:'none'}}>...</button>
          </div>
        </div>
      </div>
      <div className={styles.cardBody}>
      <img
  src={
    detail.image
      ? `${process.env.REACT_APP_BASE_URL}/${detail.image}` // ✅ Corrected relative path
      : `${process.env.PUBLIC_URL}/assets/ProfilDefaulticon.png`
  }

  className={styles.image}
/>

        <div className={styles.info}>
          <p ><span style={{color:'#ff3366'}}><strong>Name:</strong></span> {detail.fullName}</p>
          {relation.includes("Anniversary") ? (
            <p><span style={{color:'#ff3366'}}><strong>Anniversary Date:</strong></span> {new Date(detail.anniversaryDate).toLocaleDateString()}</p>
          ) : (
            <p><strong>Date of Birth:</strong> {new Date(detail.dob).toLocaleDateString() || "Not Provided"}</p>
          )}
          <p ><span style={{color:'#ff3366'}}><strong>Birthday</strong></span> {formatDateWithCurrentYear(detail.dob)}</p>
        </div>
     

      </div>
      
    </div>
    <button
  style={{
    color: '#fff',
    background: 'none',
    width: '100%',
  
    padding: '10px',
    margin: '10px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  }}
  onClick={() => navigate('/home')}
>
  Let's Go
</button>

    </>
  )};

export default FamilyInformation;
