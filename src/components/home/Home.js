import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FooterNavBar from "../Floating Plus/TabFooter";
import FloatingActionButton from "../Floating Plus/FloatingTab";
import Eventlst from "./Eventlst";
import Invitationlst from "./Invitationlst";
import "./Home.css";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import moment from "moment";
import { Filter } from "lucide-react";
import EventsFilter from "./filterModal";

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMonth, setSearchMonth] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [value, setValue] = useState("1");

  const navigate = useNavigate();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim() !== "" || searchMonth.value !== "") {
        fetchSearchResults();
      } else {
        setResults([]);
      }
    }, 500); // 500ms debounce time

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, searchMonth]);

  const fetchSearchResults = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/search?query=${searchQuery}&date=${searchMonth.value}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setResults(res.data.results);
    } catch (error) {
      console.error("Search error:", error);
    }
    setLoading(false);
  };

  const handleResultClick = (item) => {
    const eventId = item.id;
    if (item.type === "Event") {
      window.location.href = `/plandetails/${eventId}`;
    } else if (item.type === "Invitation") {
      window.location.href = `/invitation-detail/${eventId}`;
    }
  };

  const handleFilter = () => {
    setShowFilterModal(true);
  };

  const closeFilter = () => {
    setShowFilterModal(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <section className="page-controls">
        <Navbar />

        <div className="mobileMode">
          <div className="d-flex">
            <div className="SearLast p-1" style={{ width: "100%" }}>
              <div className="d-flex searchbarw justify-content-between">
                <input
                  type="text"
                  value={searchQuery}
                  placeholder="  Find amazing events  "
                  className="text-mute inputhome"
                  style={{
                    width: "100%",
                    height: "42%",
                    padding: "10px",
                    borderRadius: "31px",
                    border: "2px solid #ff3366",
                  }}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="filter-contain">
                  <button className="filter-button" onClick={handleFilter}>
                    <Filter size={18} />
                    <span>Filters</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SEARCH RESULTS */}
          {searchQuery && (
            <div
              className="search-results"
              style={{
                position: "absolute",
                top: "130px",
                width: "96%",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                margin: "0px 5px -2px 6px",
                backgroundColor: "#FFEFF3",
                borderRadius: "30px",
                maxHeight: "200px",
                overflowY: results.length > 5 ? "auto" : "unset",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                zIndex: 1000,
                padding: "10px",
              }}
            >
              {loading ? (
                <p>Loading...</p>
              ) : results.length === 0 ? (
                <p>No results found</p>
              ) : (
                results.map((item, index) => (
                  <div
                    key={index}
                    className="search-result-item"
                    onClick={() => handleResultClick(item)}
                    style={{
                      padding: "10px",
                      borderBottom: "1px solid #ddd",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <p>
                      {item.name}{" "}
                      <span style={{ fontSize: "0.8rem", color: "#888" }}>
                        ({item.type})
                      </span>
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TABS */}
          <div style={{ position: "relative" }}>
            <Box sx={{ width: "100%", typography: "body1" }}>
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList
                    onChange={handleChange}
                    aria-label=" "
                    style={{
                      backgroundColor: "#FFEFF3",
                      borderRadius: "40px",
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "10px",
                    }}
                  >
                    <Tab className="btn1" label="My events" value="1" />
                    <Tab className="btn1" label="Invitation" value="2" />
                  </TabList>
                </Box>
                <TabPanel value="1">
                  <Eventlst searchQuery={searchQuery} />
                </TabPanel>
                <TabPanel value="2">
                  <Invitationlst searchQuery={searchQuery} />
                </TabPanel>
              </TabContext>
            </Box>
          </div>
        </div>

        <div className="tabnav">
          <FooterNavBar />
        </div>
        <div className="floating-action">
          <FloatingActionButton />
        </div>
      </section>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="filter-modal-overlay">
          <EventsFilter closeFilter={closeFilter} />
        </div>
      )}
    </>
  );
};

export default HomePage;
