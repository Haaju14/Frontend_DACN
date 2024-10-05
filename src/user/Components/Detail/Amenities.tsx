import React, { useState } from "react";
import "../../../css/Amenities.css";

const Amenities: React.FC = () => {
  const [showMore, setShowMore] = useState(false);

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  return (
    <div className="amenities">
      <h3 className="mb-4">Amenities included</h3>
      <div className="amenities-list">
        <div className="amenity-item">
          <span className="icon">📶</span>
          <span>Wifi</span>
        </div>
        <div className="amenity-item">
          <span className="icon">🅿️</span>
          <span>Parking</span>
        </div>
        <div className="amenity-item">
          <span className="icon">🏊‍♂️</span>
          <span>Pool</span>
        </div>
        {showMore && (
          <>
            <div className="amenity-item">
              <span className="icon">📺</span>
              <span>Tivi</span>
            </div>
            <div className="amenity-item">
              <span className="icon">🧹</span>
              <span>Iron</span>
            </div>
            <div className="amenity-item">
              <span className="icon">🧺</span>
              <span>Washing machine</span>
            </div>
          </>
        )}
      </div>
      <button onClick={toggleShowMore}>
        {showMore ? "Hide amenities" : "Show more amenities"}
      </button>
    </div>
  );
};

export default Amenities;
