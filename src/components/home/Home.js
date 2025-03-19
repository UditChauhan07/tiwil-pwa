import React from "react";
import Navbar from "../Navbar/navbar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
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

const HomePage = () => {

  const [searchQuery, setSearchQuery] = useState("");
  const [searchMonth, setSearchMonth] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);


  const [error, setError] = useState(null);
  const [value, setValue] = React.useState("1");
  console.log(results, "results of the result current state");
  const navigate = useNavigate();

  const monthOptions = moment.months().map((month, index) => ({
    value: (index + 1).toString().padStart(2, "0"), // "01", "02", ..., "12"
    label: month,
  }));

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim() !== "" || searchMonth.value !== "") {
        console.log(searchMonth.value);
        fetchSearchResults();
        console.log("Search query:", searchMonth.value);
        console.log(results, "dtrwtr");
      } else {
        setResults([]); // Clear results if input is empty
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
          headers: { Authorization: `Bearer ${token}` }, // ✅ Headers inside config object
        }
      );
      console.log(res.data.results, "res.data.results");
      setResults(res.data.results);
      console.log("Search results:", res.data.results);
    } catch (error) {
      console.error("Search error:", error);
    }
    setLoading(false);
  };

  const handleResultClick = (item) => {
    const eventId = item.id;
    if (item.type === "Event") {
      window.location.href = `/plandetails/${eventId}`; // Redirect to event details
    } else if (item.type === "Invitation") {
      window.location.href = `/invitation-detail/${eventId}`; // Redirect to invitation details
    }
  };


  const handlefavourite = () => {
    
  };

  // const filterItem = (toSearch) => {
  //   if(value == 1){
  //     const filtered = events.filter(
  //       (event) =>
  //         event.name.toLowerCase().includes(toSearch) || event.date.includes(toSearch)
  //     );
  //     setFilteredEvents(filtered);
  //   }
  //   if(value == 2){
  //     const filtered = innvitations.filter(
  //       (event) =>
  //         event.name.toLowerCase().includes(toSearch) || event.date.includes(toSearch)
  //     );
  //     setFilteredEvents(filtered);
  //   }
  // }

  // const filterItem = (data) => {
  //   const filtered = data.filter(
  //           (event) =>
  //             event.name.toLowerCase().includes(searchQuery) || event.date.includes(searchQuery)
  //         );
  // }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterItem(searchQuery);
  };
  console.log(results, "der");
  const resetMonth = () => {
    setSelectedMonth(""); // ✅ Reset frontend state
    setMonthQuery(""); // ✅ Reset backend filter
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
                  placeholder= "  Find amazing events  "
                  className="text-mute inputhome"
                  style={{ width: "100%", height: "42%",padding:'10px',borderRadius:'31px' ,border:'2px solid #ff3366' }}
                  onChange={(e) => setSearchQuery(e.target.value)}
                /> 
              </div>
              {/* <Select
 
        options={[
            { value: "", label: "ALL" },
            ...monthOptions
        ]}
        value={searchMonth}
        onChange={setSearchMonth}
        placeholder="Month"
        style={{border:'#ff3366'}}
      /> */}
            </div>
          </div>

          {/* SEARCH RESULTS */}
          {searchQuery && (
            <div
              className="search-results"
              style={{
                position: "absolute", // Position above the tabs
                top: "113px", // Adjust as per your design
                width: "90%",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                margin: "0px 5px -2px 6px",
                backgroundColor: "#FFEFF3",
                borderRadius: "30px",
                maxHeight: "200px", // Set a max height for the search results container
                overflowY: results.length > 5 ? "auto" : "unset", // Enable scrolling if more than 5 results
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                zIndex: 1000, // Ensure it's on top of other elements
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
      {/* Render the result item here */}
  

  
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
                <Box
                  sx={{
                    borderBottom: 1,
                    borderColor: "divider",
                    backgroundColor: "",
                  }}
                >
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
        {/* <Footer /> */}
      </section>
    </>
  );
};

export default HomePage;
