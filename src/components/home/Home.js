import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FooterNavBar from "../Floating Plus/TabFooter";
import FloatingActionButton from "../Floating Plus/FloatingTab";
import Eventlst from "./Eventlst";
import Invitationlst from "./Invitationlst";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Filter } from "lucide-react";
import EventsFilter from "./filterModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDotCircle } from "@fortawesome/free-solid-svg-icons";
import { faCircle } from '@fortawesome/free-solid-svg-icons';
const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [value, setValue] = useState("1");
  const [filterData, setFilterData] = useState({
    months: [],
    relations: [],
    eventTypes: [],
    favoritesOnly: false,
  });
  const [selectedFilterCount, setSelectedFilterCount] = useState(0); // Store the count of selected filters

  const navigate = useNavigate();

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      fetchSearchResults();
    } else {
      setResults([]);
    }
  }, [searchQuery, value, filterData]);

  const fetchSearchResults = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/search?query=${searchQuery}`,
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
    setValue(newValue); // Change tab and fetch relevant results
  };
  useEffect(() => {
    const savedFilters = localStorage.getItem("filters");
    if (savedFilters) {
      const parsedFilters = JSON.parse(savedFilters);
      setFilterData(parsedFilters);
      setSelectedFilterCount(getSelectedFilterCount(parsedFilters));
    }
  }, []);


  const handleApplyFilters = (filters, selectedCount) => {
    setFilterData(filters); // Update filter data
    setSelectedFilterCount(selectedCount); // Set the count of selected filters
    setShowFilterModal(false); // Close the modal
  };
 const getSelectedFilterCount = (filters) => {
    const { months, relations, eventTypes, favoritesOnly } = filters;
    const selectedCount =
      months.length + relations.length + eventTypes.length + (favoritesOnly ? 1 : 0);
    return selectedCount;
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
                  placeholder="Find amazing events"
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
                <div className="filter-contain d-flex">
                  <button className="filter-button" onClick={handleFilter} >
                    <Filter size={32} />
                    <span className="d-flex">{selectedFilterCount > 0 && (
        <div className="active-filters-count" style={{marginBottom:'2px'}}>
          {/* <button onClick={() => setFilterData({ months: [], relations: [], eventTypes: [], favoritesOnly: false })}> */}
          <FontAwesomeIcon icon={faCircle} style={{fill:'#000',color:'#000',accentColor:'fill', height:'10px',width:'10px'}} />
          {/* </button> */}
        </div>
      )}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SEARCH RESULTS */}
          {/* {searchQuery && (
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
          )} */}

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
                  <Eventlst searchQuery={searchQuery} filterData={filterData} />
                </TabPanel>
                <TabPanel value="2">
                  <Invitationlst searchQuery={searchQuery} filterData={filterData} />
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
          <EventsFilter
            closeFilter={closeFilter}
            isOpen={showFilterModal}
            onApplyFilters={handleApplyFilters}
            filterValues={filterData}
          />
        </div>
      )}

      {/* Display active filters count */}
      
    </>
  );
};

export default HomePage;
