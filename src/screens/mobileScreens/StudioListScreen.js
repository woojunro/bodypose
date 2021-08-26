import { useQuery } from '@apollo/client';
import React, { useState, useEffect } from 'react';
import SortingStudioFunction from '../../components/functions/Studio/SortingStudioFunc';
import BottomNavigation from '../../components/mobileComponents/BottomNavigation';
import { SearchBar } from '../../components/mobileComponents/studioListScreen/SearchBar';
import SortButton from '../../components/mobileComponents/studioListScreen/SortButton';
import {
  STUDIO_SORT_OPTIONS,
  STUDIO_LOCATION_OPTIONS,
} from '../../components/mobileComponents/studioListScreen/SortingOptions';
import StudioListView from '../../components/mobileComponents/studioListScreen/StudioListView';
import AppLoadingScreen from '../../components/mobileComponents/AppLoadingScreen';
import { ALL_STUDIOS_QUERY } from '../../gql/queries/AllStudiosQuery';
import './StudioListScreen.css';
import {
  getLocation,
  getAdressByCoords,
} from '../../components/functions/GeoLocation';

const StudioListScreen = () => {
  const { data, loading, error } = useQuery(ALL_STUDIOS_QUERY, {
    onCompleted: data => {
      if (!data || !data.allStudios.studios) {
        return;
      }
      setStudios(
        SortingStudioFunction(
          sortBy,
          locationBy,
          searchTerm,
          data.allStudios.studios
        )
      );
    },
  });
  const [isSortByOpen, setIsSortByOpen] = useState(false);
  const [isLocationByOpen, setIsLocationByOpen] = useState(false);
  const [sortBy, setSortBy] = useState(STUDIO_SORT_OPTIONS[0]);
  const [locationBy, setLocationBy] = useState(STUDIO_LOCATION_OPTIONS[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [studios, setStudios] = useState([]);
  const [location, setLocation] = useState();

  //현재 좌표
  // getLocation(setLocation);

  useEffect(() => {
    getAdressByCoords(setLocation);
  }, []);

  useEffect(() => {
    //로케이션이 불려왔으면.
    if (location) {
      if (location.startsWith('서울')) {
        setLocationBy(STUDIO_LOCATION_OPTIONS[1]);
      } else if (location.startsWith('경기')) {
        setLocationBy(STUDIO_LOCATION_OPTIONS[2]);
      } else if (location.startsWith('부산')) {
        setLocationBy(STUDIO_LOCATION_OPTIONS[2]);
      } else if (location.startsWith('대구')) {
        setLocationBy(STUDIO_LOCATION_OPTIONS[3]);
      } else if (location.startsWith('천안')) {
        setLocationBy(STUDIO_LOCATION_OPTIONS[4]);
      }
    }
  }, [location]);
  useEffect(() => {
    if (data) {
      setStudios(
        SortingStudioFunction(
          sortBy,
          locationBy,
          searchTerm,
          data.allStudios.studios
        )
      );
    }
  }, [sortBy, locationBy, searchTerm]);

  useEffect(() => {
    document.body.style.overflow =
      isSortByOpen || isLocationByOpen ? 'hidden' : 'auto';
  }, [isSortByOpen, isLocationByOpen]);

  return (
    <div className="studioListScreen">
      <div>
        <div className="header">
          <span className="headerTitle">스튜디오</span>
          <SearchBar onSearchSubmit={setSearchTerm} />
        </div>
        <div style={{ height: '50px' }} />
      </div>

      {loading ? (
        <div className="appLoader">
          <AppLoadingScreen />
        </div>
      ) : error ? (
        <div className="appLoader">
          <p>오류가 발생하였습니다. 다시 시도해주세요.</p>
        </div>
      ) : (
        <>
          <div className="contentsBox">
            <div className="buttonContainer">
              <SortButton
                isOpen={isSortByOpen}
                open={() => setIsSortByOpen(true)}
                close={() => setIsSortByOpen(false)}
                closeAnother={() => setIsLocationByOpen(false)}
                options={STUDIO_SORT_OPTIONS}
                setOption={setSortBy}
                selectedOption={sortBy}
              />
              <SortButton
                isOpen={isLocationByOpen}
                open={() => setIsLocationByOpen(true)}
                close={() => setIsLocationByOpen(false)}
                closeAnother={() => setIsSortByOpen(false)}
                options={STUDIO_LOCATION_OPTIONS}
                setOption={setLocationBy}
                selectedOption={locationBy}
              />
            </div>
          </div>
          <StudioListView studioList={studios} />
        </>
      )}
      <BottomNavigation pageName="studios" />
    </div>
  );
};

export default StudioListScreen;
