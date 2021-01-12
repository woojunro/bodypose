import React, { useState, useEffect } from 'react';
import { MakingStudioList } from '../../components/functions/Studio/MakingStudioList';

import SortingStudioFunction from '../../components/functions/Studio/SortingStudioFunc';
import { GetStudios } from '../../components/functions/WithDb/GetStudios';
import BottomNavigation from '../../components/mobileComponents/BottomNavigation';
import Header from '../../components/mobileComponents/HeaderM';
import { SearchBar } from '../../components/mobileComponents/studioListScreen/SearchBar';
import SortButton from '../../components/mobileComponents/studioListScreen/SortButton';
import {
  SortByOptions,
  LocationOptions,
} from '../../components/mobileComponents/studioListScreen/SortingOptions';
import StudioListView from '../../components/mobileComponents/studioListScreen/StudioListView';
import './StudioListScreen.css';

const StudioListScreen = () => {
  const allStudios = GetStudios();

  let sortByOptions = SortByOptions;
  let locationOptions = LocationOptions;
  const [isSortByOpen, setIsSortByOpen] = useState(false);
  const [isLocationByOpen, setIsLocationByOpen] = useState(false);
  const [sortBy, setSortBy] = useState(sortByOptions[0]);
  const [locationBy, setLocationBy] = useState(locationOptions[0]);
  const [studios, setStudios] = useState(MakingStudioList(allStudios));
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
    document.body.style.overflow =
      isSortByOpen || isLocationByOpen ? 'hidden' : 'auto';
  }, [isSortByOpen, isLocationByOpen]);
  useEffect(() => {
    const returnStudio = SortingStudioFunction(
      sortBy,
      locationBy,
      searchTerm,
      allStudios
    );
    setStudios(returnStudio);
  }, [sortBy, locationBy, searchTerm]);

  return (
    <div className="studioListScreen">
      <SearchBar onSearchSubmit={setSearchTerm} />
      <Header pageName="studios" />
      <div className="contentsBox">
        <div className="buttonContainer">
          <SortButton
            change={setStudios}
            isOpen={isSortByOpen}
            open={() => setIsSortByOpen(true)}
            close={() => setIsSortByOpen(false)}
            closeAnother={() => setIsLocationByOpen(false)}
            options={sortByOptions}
            setOption={setSortBy}
            selectedOption={sortBy}
          />
          <SortButton
            isOpen={isLocationByOpen}
            open={() => setIsLocationByOpen(true)}
            close={() => setIsLocationByOpen(false)}
            closeAnother={() => setIsSortByOpen(false)}
            options={locationOptions}
            setOption={setLocationBy}
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
