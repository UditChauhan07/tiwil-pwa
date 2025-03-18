import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./GroupDetails.module.css";
import { FiArrowLeft } from "react-icons/fi";

const GroupDetails = () => {
  const { groupId } = useParams();
  const eventId = groupId.replace("group_", "");
  const token = localStorage.getItem("token");
  const loggedInUserId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [groupDetails, setGroupDetails] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroupAndEventDetails = async () => {
      try {
        // Fetch Group Details
        const groupResponse = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/chats/${groupId}/details`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (groupResponse.data.success) {
          setGroupDetails(groupResponse.data.data);
        }

        // Fetch Event Details
        const eventResponse = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/events/${eventId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (eventResponse.data.success) {
          setEventDetails(eventResponse.data.data);
        }
      } catch (error) {
        console.error("❌ Error fetching details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupAndEventDetails();
  }, [groupId, eventId, token]);

  const handleWishlistNavigation = () => {
    if (!eventDetails) return;

    if (eventDetails.userId === loggedInUserId) {
      navigate(`/plandetails/${eventId}`);
    } else {
      navigate(`/invitation-detail/${eventId}`);
    }
  };

  if (loading) return <p>Loading group details...</p>;

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
                  : `${PUBLIC_URL}/DefaultUser.png`
              }
              alt="Event"
              className={styles.eventImage}
            />
            <h2>{groupDetails.eventName}</h2>
            <button className={styles.wishlistButton} onClick={handleWishlistNavigation}>
              See Wishlist
            </button>
          </div>

          <p className={styles.creationDate}>
            Group created on: {new Date(groupDetails.createdAt).toLocaleDateString()}
          </p>

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
                      : `${PUBLIC_URL}/DefaultUser.png`
                  }
                  alt="Profile"
                  className={styles.profileImage}
                />
                <p>{member._id === loggedInUserId ? "Me" : member.fullName}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>Group details not available.</p>
      )}
    </div>
  );
};

export default GroupDetails;
