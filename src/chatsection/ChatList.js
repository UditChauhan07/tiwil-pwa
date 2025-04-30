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
  const [loading, setLoading] = useState(true); // new

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // ✅ Fetch Group Chats with Event Details in One Call
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true); // start loading
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
      } finally {
        setLoading(false); // stop loading
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
      <div className="d-flex gap-3 "style={{marginTop:"20px"}}>
      <FiArrowLeft
            className={styles.backIcon}
            onClick={() => navigate("/home")}
           style={{fontSize: "32px",
    marginBottom: "17px",
    marginTop: "0px"}}/>
    <h2 className={styles.title}>Group Chats</h2>
    </div>
      <div className={styles.searchContainer}>
        <FaSearch className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search here..."
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

 
      <div className={styles.groupList}>
  {loading ? (
    <p className={styles.noDataText}>Loading chats...</p> // You can style this or use a spinner
  ) : filteredGroups.length === 0 ? (
    <p className={styles.noDataText}>No chat Found</p>
  ) : (
    filteredGroups.map((group) => (
      <div
        key={group._id}
        className={styles.groupItem}
        onClick={() => handleGroupClick(group.groupId)}
      >
        <img
          src={
            group.eventImage
              ? `${process.env.REACT_APP_BASE_URL}/${group.eventImage}`
              : `${process.env.PUBLIC_URL}/defaultUser.png`
          }
          className={styles.profileImage} loading="lazy"
        />
        <div className={styles.groupInfo}>
          <h4 className={styles.groupName}>{group.eventName}</h4>
          <p className={styles.lastMessage}>
            Participants: {group.participants.length}
          </p>
        </div>
      </div>
    ))
  )}
</div>

    </div>
  );
};

export default Chatlist;
