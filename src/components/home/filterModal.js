import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import "./filterModal.css";

export default function EventsFilter({ closeFilter, isOpen, onApplyFilters, filterValues }) {
  const [monthsExpanded, setMonthsExpanded] = useState(true);
  const [relationExpanded, setRelationExpanded] = useState(false);
  const [eventTypeExpanded, setEventTypeExpanded] = useState(false);

  // Initialize filter state from localStorage if available, otherwise use the passed values
  const [localFilterValues, setLocalFilterValues] = useState(() => {
    const savedFilters = localStorage.getItem("filters");
    return savedFilters ? JSON.parse(savedFilters) : filterValues;
  });

  // Update localStorage whenever localFilterValues change
  useEffect(() => {
    localStorage.setItem("filters", JSON.stringify(localFilterValues));
  }, [localFilterValues]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    // Special case for favoritesOnly, which is a boolean
    if (name === "favoritesOnly") {
      setLocalFilterValues({
        ...localFilterValues,
        [name]: checked,
      });
      return;
    }
  
    // Handle checkbox fields with array values
    if (type === "checkbox") {
      const currentValues = Array.isArray(localFilterValues[name])
        ? [...localFilterValues[name]]
        : [];
  
      const updatedValues = checked
        ? [...currentValues, value]
        : currentValues.filter((item) => item !== value);
  
      setLocalFilterValues({
        ...localFilterValues,
        [name]: updatedValues,
      });
    } else {
      setLocalFilterValues({
        ...localFilterValues,
        [name]: value,
      });
    }
  };
  

  const getSelectedFilterCount = () => {
    const { months, relations, eventTypes, favoritesOnly } = localFilterValues;
    const selectedCount = months.length + relations.length + eventTypes.length + (favoritesOnly ? 1 : 0);
    return selectedCount;
  };

  const handleApplyFilters = () => {
    onApplyFilters(localFilterValues, getSelectedFilterCount()); // Pass updated filter values to the parent
  };

  const handleClearFilters = () => {
    // Clear localStorage and reset the filter values
    localStorage.removeItem("filters");
    setLocalFilterValues({
      months: [],
      relations: [],
      eventTypes: [],
      favoritesOnly: false,
    });
  };

  return (
    <div className={`events-filter-container ${isOpen ? "open" : ""}`}>
      <div className="filters-panel">
        <div className="filters-header">
          <h2>Filters</h2>
          <div className="d-flex">
            <button className="clear-button" onClick={handleClearFilters}>Clear All</button>
          
          </div>
        </div>

        {/* Months Section */}
        <div className="filter-section">
          <button
            className="section-header"
            onClick={() => setMonthsExpanded(!monthsExpanded)}
          >
            <span>Months</span>
            {monthsExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {monthsExpanded && (
            <div className="section-content">
              {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(
                (month, index) => (
                  <div key={index} className="checkbox-row">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="months"
                        value={month}
                        checked={localFilterValues.months.includes(month)}
                        onChange={handleChange}
                      />
                      {month}
                    </label>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* Event Types Section */}
        <div className="filter-section">
          <button
            className="section-header"
            onClick={() => setEventTypeExpanded(!eventTypeExpanded)}
          >
            <span>Event Type</span>
            {eventTypeExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {eventTypeExpanded && (
            <div className="section-content">
              {["Birthday", "Anniversary", "Wedding", "Graduation", "Custom"].map((eventType) => (
                <div key={eventType} className="checkbox-row">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="eventTypes"
                      value={eventType}
                      checked={localFilterValues.eventTypes.includes(eventType)}
                      onChange={handleChange}
                    />
                    {eventType}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Relation Section */}
        <div className="filter-section">
          <button
            className="section-header"
            onClick={() => setRelationExpanded(!relationExpanded)}
          >
            <span>Relation</span>
            {relationExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {relationExpanded && (
            <div className="section-content">
              {["Father", "Mother", "Son", "Daughter", "Wife", "Husband"].map((relation) => (
                <div key={relation} className="checkbox-row">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="relations"
                      value={relation}
                      checked={localFilterValues.relations.includes(relation)}
                      onChange={handleChange}
                    />
                    {relation}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Favorites Section */}
        <div className="favorites-section">
          <label className="checkbox-label favorites-label d-flex align-items-normal">
            <input
              type="checkbox"
              name="favoritesOnly"
              checked={localFilterValues.favoritesOnly}
              onChange={handleChange}
            />
            <span>Favorites Only</span>
          </label>
        </div>

        <button className="apply-filter-button" onClick={handleApplyFilters}>
          Apply
        </button>
        <button className="apply-filter-button" onClick={closeFilter}>
           Close
            </button>
      </div>
      <br/>
      <br/>
      <br/>
    </div>
  );
}
