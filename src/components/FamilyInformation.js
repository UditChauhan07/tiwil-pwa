import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../components/FamilyInformation.module.css";
import EditFamilyModal from "../components/EditFamilyModal";
import Navbar from "../components/navbar";

const FamilyInformation = () => {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [editModal, setEditModal] = useState({
    isOpen: false,
    relation: null,
    detail: null,
  });

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
    <div className={styles.container}>
      <Navbar />
      <h1 className={styles.header}>View Detail</h1>

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
  return (
    <div className={`${styles.card} ${relation.includes("Anniversary") ? styles.anniversaryCard : ""}`}>
      <div className={styles.cardHeader}>
        <h2>{relation.toUpperCase()}</h2>
        <div className={styles.menuContainer}>
          <button className={styles.menuButton} onClick={onEdit}>⋮</button>
          <div className={styles.menuOptions}>
            <button onClick={onEdit}>Edit Details</button>
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
  alt={relation}
  className={styles.image}
/>

        <div className={styles.info}>
          <p><strong>Name:</strong> {detail.fullName}</p>
          {relation.includes("Anniversary") ? (
            <p><strong>Anniversary Date:</strong> {new Date(detail.anniversaryDate).toLocaleDateString()}</p>
          ) : (
            <p><strong>Date of Birth:</strong> {new Date(detail.dob).toLocaleDateString() || "Not Provided"}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FamilyInformation;
