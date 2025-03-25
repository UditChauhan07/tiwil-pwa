import { useState } from "react";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";
import "./filterModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function EventsFilter({ closeFilter, isOpen }) {
  const [monthsExpanded, setMonthsExpanded] = useState(true);
  const [relationExpanded, setRelationExpanded] = useState(true);
  const [eventTypeExpanded, setEventTypeExpanded] = useState(true);

  const relations = [
    ["Father"],
    ["Mother"],
    ["Son"],
    ["Daughter"],
    ["Wife"],
    ["Husband"],
    ["Brother"],
    ["Sister"],
    ["Grandfather"],
    ["Grandmother"],
    ["Friend"],
  ];

  const eventTypes = [["Birthday", "Anniversary"], ["Wedding", "Graduation"], ["Custom"]];

  return (
    <div className={`events-filter-container ${isOpen ? "open" : ""}`}>
  
   
      <div className="filters-panel">
        <div className="filters-header">
          <h2>Filters</h2>
          <div className="d-flex">
          <button className="clear-button">Clear All</button> 
          <button className="close-button" onClick={closeFilter}> <FontAwesomeIcon icon={faXmark} /></button>
          </div>
        </div>

        {/* Months Section */}
        <div className="filter-section">
          <button className="section-header" onClick={() => setMonthsExpanded(!monthsExpanded)}>
            <span>Months</span>
            {monthsExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {monthsExpanded && (
            <div className="section-content">
              {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month, index) => (
                <div key={index} className="checkbox-row">
                  <label className="checkbox-label">
                    <input type="checkbox" />
                    {month}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Relations Section */}
        <div className="filter-section">
          <button className="section-header" onClick={() => setRelationExpanded(!relationExpanded)}>
            <span>Relation Type</span>
            {relationExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {relationExpanded && (
            <div className="section-content">
              {relations.map((row, rowIndex) => (
                <div key={rowIndex} className="checkbox-row">
                  {row.map((relation) => (
                    <label key={relation} className="checkbox-label">
                      <input type="checkbox" />
                      <span>{relation}</span>
                    </label>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Event Types Section */}
        <div className="filter-section">
          <button className="section-header" onClick={() => setEventTypeExpanded(!eventTypeExpanded)}>
            <span>Event Type</span>
            {eventTypeExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {eventTypeExpanded && (
            <div className="section-content">
              {eventTypes.map((row, rowIndex) => (
                <div key={rowIndex} className="checkbox-row">
                  {row.map((eventType) => (
                    <label key={eventType} className="checkbox-label">
                      <input type="checkbox" />
                      <span>{eventType}</span>
                    </label>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Favorites Section */}
        <div className="favorites-section">
          <label className="checkbox-label favorites-label d-flex align-items-normal">
            <input type="checkbox" />
            <span>Favorites Only</span>
          </label>
        </div>

        <button className="apply-filter-button">Apply Filter</button>
      </div>
      <br/>
      <br/>

      <div className="bottom-indicator">
        <div className="indicator-line"></div>
      </div>
    </div>
  );
}
