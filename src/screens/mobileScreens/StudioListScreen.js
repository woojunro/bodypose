import React, { useState, useEffect } from 'react';
import { MakingStudioList } from '../../components/functions/MakingStudioList';
import SortByHearts from '../../components/functions/SortByHearts';
import SortByLocation from '../../components/functions/sortByLocation';
import SortByName from '../../components/functions/SortByName';
import SortByPrice from '../../components/functions/SortByPrice';
import SortByRating from '../../components/functions/SortByRating';
import BottomNavigation from '../../components/mobileComponents/BottomNavigation';
import Header from '../../components/mobileComponents/HeaderM';
import SortButton from '../../components/mobileComponents/studioListScreen/SortButton';
import {
  SortByOptions,
  LocationOptions,
} from '../../components/mobileComponents/studioListScreen/SortingOptions';
import StudioListView from '../../components/mobileComponents/studioListScreen/StudioListView';
import { DbStudios } from '../../virtualDB/items/DbStudios';
import './StudioListScreen.css';

const StudioListScreen = () => {
  let sortByOptions = SortByOptions;
  let locationOptions = LocationOptions;
  const studioList = DbStudios;
  const [isSortByOpen, setIsSortByOpen] = useState(false);
  const [isLocationByOpen, setIsLocationByOpen] = useState(false);
  const [sortBy, setSortBy] = useState(sortByOptions[0]);
  const [locationBy, setLocationBy] = useState(locationOptions[0]);
  const [studios, setStudios] = useState(MakingStudioList(studioList));

  useEffect(() => {
    if (sortBy.name === 'byName') {
      setStudios(SortByName(studioList));
    } else if (sortBy.name === 'default') {
      setStudios(MakingStudioList(studioList));
    } else if (sortBy.name === 'byPrice') {
      setStudios(SortByPrice(studioList));
    } else if (sortBy.name === 'byHearts') {
      setStudios(SortByHearts(studioList));
    } else if (sortBy.name === 'byRating') {
      setStudios(SortByRating(studioList));
    }
    if (locationBy.name === 'default') {
    } else {
      setStudios(SortByLocation(studioList, locationBy.name));
    }

    return null;
  }, [sortBy, locationBy, studioList]);

  const handleStudioList = (list) => {
    setStudios(list);
  };
  const handleSortBy = (by) => {
    setSortBy(by);
  };
  const handleLocationBy = (location) => {
    setLocationBy(location);
  };
  const openSortBy = () => {
    setIsSortByOpen(true);
  };
  const closeSortBy = () => {
    setIsSortByOpen(false);
  };
  const openLocationBy = () => {
    setIsLocationByOpen(true);
  };
  const closeLocationBy = () => {
    setIsLocationByOpen(false);
  };
  return (
    <div className="studioListScreen">
      <Header pageName="studios" />
      <div className="contentsBox">
        <div className="buttonContainer">
          <SortButton
            change={handleStudioList}
            isOpen={isSortByOpen}
            open={openSortBy}
            close={closeSortBy}
            closeAnother={closeLocationBy}
            options={sortByOptions}
            setOption={handleSortBy}
            selectedOption={sortBy}
          />
          <SortButton
            isOpen={isLocationByOpen}
            open={openLocationBy}
            close={closeLocationBy}
            closeAnother={closeSortBy}
            options={locationOptions}
            setOption={handleLocationBy}
            selectedOption={locationBy}
          />
        </div>
      </div>
      <StudioListView studioList={studios} />

      <BottomNavigation pageName="studios" />
    </div>
  );
};

export default StudioListScreen;
