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
import { FaSearch } from "react-icons/fa";
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
                <div style={{
                    width: "100%",
                    height: "38%",
                    padding: "6px",
                    borderRadius: "31px",
                    border: "0.5px solid #FFCBD8",
                    display:'flex',
                    alignItems:'center',
                    gap:'5px'
                    
                  }}><FaSearch style={{
  color: '#919191',
  fontSize:'17px'

}} />
                <input   
                  type="text"
                  value={searchQuery}
                  placeholder="Find amazing events"
                  className="text-mute inputhome"
                  
                  style={{
                    width: "100%",
                    height: "42%",
                    marginTop:'0px',
                    padding:'0px',
                  
                   outline:'none',
                    border: "none"
                    
                  }}
                  onChange={(e) => setSearchQuery(e.target.value)}
                 />
                 </div>
                <div className="filter-contain d-flex">
                  <button className="filter-button" onClick={handleFilter} >
                  <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.44435 4.0186H11.1987C11.3805 4.68701 11.7772 5.27705 12.3275 5.6977C12.8778 6.11836 13.5513 6.34626 14.244 6.34626C14.9367 6.34626 15.6102 6.11836 16.1605 5.6977C16.7109 5.27705 17.1075 4.68701 17.2893 4.0186H19.1456C19.2567 4.0186 19.3666 3.99673 19.4692 3.95424C19.5718 3.91175 19.665 3.84948 19.7435 3.77097C19.822 3.69246 19.8843 3.59925 19.9267 3.49668C19.9692 3.3941 19.9911 3.28416 19.9911 3.17313C19.9911 3.0621 19.9692 2.95216 19.9267 2.84958C19.8843 2.74701 19.822 2.6538 19.7435 2.57529C19.665 2.49678 19.5718 2.43451 19.4692 2.39202C19.3666 2.34953 19.2567 2.32766 19.1456 2.32766H17.2823C17.1005 1.65924 16.7039 1.06921 16.1535 0.648555C15.6032 0.227902 14.9297 0 14.237 0C13.5443 0 12.8709 0.227902 12.3205 0.648555C11.7702 1.06921 11.3735 1.65924 11.1917 2.32766H1.44435C1.33332 2.32766 1.22338 2.34953 1.1208 2.39202C1.01822 2.43451 0.925018 2.49678 0.846509 2.57529C0.768 2.6538 0.705723 2.74701 0.663235 2.84958C0.620746 2.95216 0.598877 3.0621 0.598877 3.17313C0.598877 3.28416 0.620746 3.3941 0.663235 3.49668C0.705723 3.59925 0.768 3.69246 0.846509 3.77097C0.925018 3.84948 1.01822 3.91175 1.1208 3.95424C1.22338 3.99673 1.33332 4.0186 1.44435 4.0186ZM14.2545 1.69181C14.5473 1.69366 14.8329 1.78221 15.0754 1.94631C15.3179 2.1104 15.5063 2.34266 15.6168 2.61376C15.7274 2.88487 15.7551 3.18265 15.6965 3.4695C15.6379 3.75636 15.4957 4.01942 15.2877 4.22547C15.0797 4.43152 14.8153 4.57131 14.5279 4.62719C14.2405 4.68307 13.943 4.65253 13.6729 4.53943C13.4029 4.42633 13.1724 4.23574 13.0106 3.99173C12.8488 3.74773 12.7629 3.46125 12.7639 3.16847C12.7648 2.97364 12.804 2.78089 12.8795 2.60123C12.9549 2.42158 13.0649 2.25854 13.2033 2.12142C13.3418 1.9843 13.5058 1.87578 13.6862 1.80207C13.8665 1.72836 14.0597 1.69089 14.2545 1.69181Z" fill="#EE4266"/>
<path d="M19.1456 9.3104H9.38896C9.20799 8.64156 8.81177 8.05094 8.26154 7.6298C7.71131 7.20867 7.0377 6.98047 6.34481 6.98047C5.65191 6.98047 4.9783 7.20867 4.42807 7.6298C3.87784 8.05094 3.48163 8.64156 3.30065 9.3104H1.44435C1.22011 9.3104 1.00507 9.39948 0.846509 9.55804C0.687953 9.71659 0.598877 9.93164 0.598877 10.1559C0.598877 10.3801 0.687953 10.5952 0.846509 10.7537C1.00507 10.9123 1.22011 11.0013 1.44435 11.0013H3.30764C3.48862 11.6702 3.88483 12.2608 4.43506 12.6819C4.98529 13.1031 5.6589 13.3313 6.35179 13.3313C7.04469 13.3313 7.7183 13.1031 8.26853 12.6819C8.81876 12.2608 9.21497 11.6702 9.39595 11.0013H19.1456C19.3699 11.0013 19.5849 10.9123 19.7435 10.7537C19.902 10.5952 19.9911 10.3801 19.9911 10.1559C19.9911 9.93164 19.902 9.71659 19.7435 9.55804C19.5849 9.39948 19.3699 9.3104 19.1456 9.3104ZM6.33549 11.6372C6.04292 11.6354 5.75744 11.5469 5.51507 11.383C5.2727 11.2191 5.08428 10.9872 4.97359 10.7163C4.8629 10.4455 4.83489 10.1479 4.8931 9.86121C4.9513 9.57448 5.09311 9.31141 5.30065 9.10517C5.50818 8.89894 5.77213 8.75878 6.05923 8.70237C6.34632 8.64597 6.64368 8.67584 6.91381 8.78823C7.18395 8.90061 7.41475 9.09048 7.57711 9.33387C7.73947 9.57727 7.82612 9.86329 7.82613 10.1559C7.82582 10.3511 7.78699 10.5444 7.71185 10.7245C7.63672 10.9047 7.52676 11.0683 7.38828 11.2059C7.2498 11.3436 7.08553 11.4525 6.90487 11.5265C6.72421 11.6005 6.53072 11.6381 6.33549 11.6372Z" fill="#EE4266"/>
<path d="M19.1456 16.293H17.2823C17.1005 15.6246 16.7039 15.0345 16.1535 14.6139C15.6032 14.1932 14.9297 13.9653 14.237 13.9653C13.5443 13.9653 12.8709 14.1932 12.3205 14.6139C11.7702 15.0345 11.3735 15.6246 11.1917 16.293H1.44435C1.22011 16.293 1.00507 16.3821 0.846509 16.5406C0.687953 16.6992 0.598877 16.9142 0.598877 17.1385C0.598877 17.3627 0.687953 17.5777 0.846509 17.7363C1.00507 17.8949 1.22011 17.9839 1.44435 17.9839H11.1987C11.3805 18.6523 11.7772 19.2424 12.3275 19.663C12.8778 20.0837 13.5513 20.3116 14.244 20.3116C14.9367 20.3116 15.6102 20.0837 16.1605 19.663C16.7109 19.2424 17.1075 18.6523 17.2893 17.9839H19.1456C19.3699 17.9839 19.5849 17.8949 19.7435 17.7363C19.902 17.5777 19.9911 17.3627 19.9911 17.1385C19.9911 16.9142 19.902 16.6992 19.7435 16.5406C19.5849 16.3821 19.3699 16.293 19.1456 16.293ZM14.2545 18.6221C13.961 18.624 13.6736 18.5386 13.4287 18.3768C13.1839 18.2151 12.9926 17.9843 12.8791 17.7136C12.7656 17.443 12.7351 17.1447 12.7914 16.8567C12.8476 16.5687 12.9882 16.3039 13.1952 16.0959C13.4023 15.8878 13.6664 15.746 13.9542 15.6884C14.2419 15.6307 14.5403 15.6598 14.8115 15.772C15.0827 15.8842 15.3144 16.0744 15.4773 16.3185C15.6402 16.5627 15.7269 16.8496 15.7265 17.1431C15.7241 17.5332 15.5683 17.9067 15.2929 18.183C15.0175 18.4592 14.6446 18.6161 14.2545 18.6198V18.6221Z" fill="#EE4266"/>
</svg>

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
                      height: "33px",
                      justifyContent: "space-between",
                      marginBottom: "10px",
                    }}
                  >
                    <Tab className="btn1" label="My Events" value="1" />
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
