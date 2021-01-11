import React, { useState, useEffect } from 'react';
import { MakingStudioList } from '../../components/functions/Studio/MakingStudioList';
import {
  SortByHearts,
  SortByLocation,
  SortByName,
  SortByPrice,
  SortByRating,
} from '../../components/functions/Studio/SortingFunctions';
import BottomNavigation from '../../components/mobileComponents/BottomNavigation';
import Header from '../../components/mobileComponents/HeaderM';
import { SearchBar } from '../../components/mobileComponents/studioListScreen/SearchBar';
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
  const [isSortByOpen, setIsSortByOpen] = useState(false);
  const [isLocationByOpen, setIsLocationByOpen] = useState(false);
  const [sortBy, setSortBy] = useState(sortByOptions[0]);
  const [locationBy, setLocationBy] = useState(locationOptions[0]);
  const [studios, setStudios] = useState(MakingStudioList(DbStudios));
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
    var sortedStudio = [];
    var returnStudio = [];
    if (searchTerm === '') {
      if (locationBy.name === 'default') {
        sortedStudio = DbStudios;
      } else {
        sortedStudio = SortByLocation(DbStudios, locationBy.name);
      }

      if (sortBy.name === 'default') {
        returnStudio = MakingStudioList(sortedStudio);
      } else if (sortBy.name === 'byName') {
        returnStudio = SortByName(sortedStudio);
      } else if (sortBy.name === 'byPrice') {
        returnStudio = SortByPrice(sortedStudio);
      } else if (sortBy.name === 'byHearts') {
        returnStudio = SortByHearts(sortedStudio);
      } else if (sortBy.name === 'byRating') {
        returnStudio = SortByRating(sortedStudio);
      }
    } else {
      for (var num in DbStudios) {
        if (DbStudios[num].title.includes(searchTerm)) {
          returnStudio.push(DbStudios[num]);
        }
      }
      if (locationBy.name === 'default') {
        sortedStudio = returnStudio;
      } else {
        sortedStudio = SortByLocation(returnStudio, locationBy.name);
      }

      if (sortBy.name === 'default') {
        returnStudio = MakingStudioList(sortedStudio);
      } else if (sortBy.name === 'byName') {
        returnStudio = SortByName(sortedStudio);
      } else if (sortBy.name === 'byPrice') {
        returnStudio = SortByPrice(sortedStudio);
      } else if (sortBy.name === 'byHearts') {
        returnStudio = SortByHearts(sortedStudio);
      } else if (sortBy.name === 'byRating') {
        returnStudio = SortByRating(sortedStudio);
      }
    }

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
