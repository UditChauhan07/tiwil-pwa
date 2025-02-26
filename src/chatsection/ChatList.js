import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styles from "./Chatlist.module.css";
import { FiArrowLeft } from "react-icons/fi";

const Chatlist = () => {
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // ✅ Fetch Group Chats with Event Details in One Call
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/chats`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.success) {
          setGroups(response.data.data);
        }
      } catch (error) {
        console.error("❌ Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, [token]);

  // ✅ Filter groups based on search input
  const filteredGroups = groups.filter((group) =>
    group.eventName?.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Navigate to the chat page on click
  const handleGroupClick = (groupId) => {
    navigate(`/chats/${groupId}`);
  };

  return (
    <div className={styles.container}>
      {/* 🔍 Search Bar */}
      <FiArrowLeft
            className={styles.backIcon}
            onClick={() => navigate("/dashboard")}
          />
      <div className={styles.searchContainer}>
        <FaSearch className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* 🔖 Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tabButton} ${
            activeTab === "all" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("all")}
        >
          All
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === "groups" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("groups")}
        >
          Groups
        </button>
      </div>

      {/* 💬 Dynamic Group List */}
      <div className={styles.groupList}>
        {filteredGroups.length === 0 ? (
          <p className={styles.noDataText}>Loading...</p>
        ) : (
          filteredGroups.map((group) => (
            <div
              key={group._id}
              className={styles.groupItem}
              onClick={() => handleGroupClick(group.groupId)} // ✅ Navigate on click
            >
              <img
                src={
                  group.eventImage
                    ? `${process.env.REACT_APP_BASE_URL}/${group.eventImage}`
                    : "/assets/default-event.jpg"
                }
                alt={group.eventName}
                className={styles.profileImage}
              />
              <div className={styles.groupInfo}>
                {/* ✅ Event Name */}
                <h4 className={styles.groupName}>{group.eventName}</h4>

                {/* ✅ Total participants */}
                <p className={styles.lastMessage}>
                  Participants: {group.participants.length}
                </p>
              </div>
              {/* 🕒 Static time placeholder */}
              <span className={styles.time}>12:08 PM</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Chatlist;
