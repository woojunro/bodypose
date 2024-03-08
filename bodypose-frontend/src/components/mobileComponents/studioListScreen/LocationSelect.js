import React from 'react';
import './LocationSelect.css';
import { STUDIO_LOCATION_OPTIONS } from './SortingOptions';
import { IoMdArrowDropright } from 'react-icons/io';

const LocationSelect = ({ setStudiosLocation }) => {
  const locations = STUDIO_LOCATION_OPTIONS;
  const RenderedLocations = locations.map(location => {
    return (
      <div
        className="locationselection"
        key={location.name}
        onClick={() => setStudiosLocation(location)}
      >
        <div> {location.title}</div>
        <IoMdArrowDropright />
      </div>
    );
  });

  return (
    <div className="locationSelectContainer">
      <div className="locationSelectTitle">지역 선택</div>
      <div className="locationBox"> {RenderedLocations}</div>
    </div>
  );
};

export default LocationSelect;
