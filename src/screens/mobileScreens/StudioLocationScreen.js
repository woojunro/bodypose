import React from 'react';
import './StudioLocationScreen.css';

import LocationSelect from '../../components/mobileComponents/studioListScreen/LocationSelect';
import BottomNavigation from '../../components/mobileComponents/BottomNavigation';

const StudioLocationScreen = ({ setLocation }) => {
  return (
    <div className="studioLocationScreen">
      <div>
        <div className="header">
          <span className="headerTitle">스튜디오</span>
        </div>
        <div style={{ height: '50px' }} />
      </div>

      <LocationSelect setStudiosLocation={setLocation} />

      <BottomNavigation pageName="studios" />
    </div>
  );
};

export default StudioLocationScreen;
