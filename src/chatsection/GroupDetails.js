import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./GroupDetails.module.css";
import { FiArrowLeft, FiSearch } from "react-icons/fi";

const GroupDetails = () => {
  const { groupId } = useParams();
  const eventId = groupId.replace("group_", "");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  console.log(groupId,'44444444444444444444444444')

  const [groupDetails, setGroupDetails] = useState(null);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/chats/${groupId}/details`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data.success) {
          setGroupDetails(response.data.data);
        }
      } catch (error) {
        console.error("❌ Error fetching group details:", error);
      }
    };

    fetchGroupDetails();
  }, [groupId, token]);

  return (
    <div className={styles.container}>
      {groupDetails ? (
        <>
          <div className={styles.header}>
            <FiArrowLeft onClick={() => navigate(-1)} className={styles.backIcon} />
            <img
              src={
                groupDetails.eventImage
                  ? `${process.env.REACT_APP_BASE_URL}/${groupDetails.eventImage}`
                  : "/assets/ProfilDefaulticon.png"
              }
              alt="Event"
              className={styles.eventImage}
            />
            <h2>{groupDetails.eventName}</h2>
            <button className={styles.wishlistButton} onClick={() => navigate(`/event/${eventId}`)}>
              See Wishlist
            </button>
          </div>

          <p className={styles.creationDate}>Group created on: {new Date(groupDetails.createdAt).toLocaleDateString()}</p>

          {/* ✅ Media Files Section */}
          <h3>Media, Links & Docs</h3>
          <div className={styles.mediaContainer}>
            {groupDetails.mediaFiles.map((media, index) => (
              <div key={index} className={styles.mediaItem}>
                {media.messageType === "image" ? (
                  <img src={`${process.env.REACT_APP_BASE_URL}${media.mediaUrl}`} alt="Media" />
                ) : media.messageType === "video" ? (
                  <video src={`${process.env.REACT_APP_BASE_URL}${media.mediaUrl}`} controls />
                ) : (
                  <audio src={`${process.env.REACT_APP_BASE_URL}${media.mediaUrl}`} controls />
                )}
              </div>
            ))}
          </div>

          {/* ✅ Members Section */}
          <h3>{groupDetails.participants.length} Members</h3>
          <div className={styles.memberList}>
            {groupDetails.participants.map((member) => (
              <div key={member._id} className={styles.memberItem}>
                <img
                  src={
                    member.profileImage
                      ? `${process.env.REACT_APP_BASE_URL}${member.profileImage}`
                      : "/assets/ProfilDefaulticon.png"
                  }
                  alt="Profile"
                  className={styles.profileImage}
                />
                <p>{member.fullName}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>Loading group details...</p>
      )}
    </div>
  );
};

export default GroupDetails;
