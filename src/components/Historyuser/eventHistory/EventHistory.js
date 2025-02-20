import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./EventHistory.module.css";
import { FiCalendar } from "react-icons/fi";

const EventHistory = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setHistoryData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching history data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading history events...</div>;
  }

  if (!historyData.length) {
    return <div className={styles.noData}>No past events found.</div>;
  }

  return (
    <div className={styles.historyContainer}>
      {historyData.map((event, index) => (
        <div key={index} className={styles.eventCard}>
          <div className={styles.eventHeader}>
            <span className={styles.eventTitle}>{event.name}</span>
            <span className={styles.eventDate}>
              <FiCalendar className={styles.calendarIcon} />{" "}
              {new Date(event.date).toLocaleDateString()}
            </span>
          </div>
          <div className={styles.eventContent}>
            <img
              src={event.image ? `${process.env.REACT_APP_BASE_URL}/${event.image}` : "/assets/sample-event.jpg"}
              alt="Event"
              className={styles.eventImage}
            />
            <div className={styles.wishlist}>
              {event.wishlist?.slice(0, 3).map((item, i) => (
                <img key={i} src={item} alt="Wishlist Item" className={styles.wishlistItem} />
              ))}
              <button className={styles.viewWishlist}>View Full Wishlist →</button>
            </div>
          </div>
          <div className={styles.guests}>
            <span className={styles.guestCount}>👥 {event.guests || 0} guests</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventHistory;
