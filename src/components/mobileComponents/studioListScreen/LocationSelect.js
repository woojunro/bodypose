import React from 'react';
import './LocationSelect.css';
import { STUDIO_LOCATION_OPTIONS } from './SortingOptions';
import { IoMdArrowDropright } from 'react-icons/io';
import { useHistory } from 'react-router-dom';

const LocationSelect = ({ setStudiosLocation }) => {
  const history = useHistory();
  const locations = STUDIO_LOCATION_OPTIONS;
  const RenderedLocations = locations.map(location => {
    return (
      <div
        className="locationselection"
        key={location.name}
        onClick={() => {
          setStudiosLocation(location);

          history.push({
            pathname: '/studios',
          });
        }}
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
