import './StudioListScreen.css';
import { useQuery, useReactiveVar } from '@apollo/client';
import React, { useState, useEffect } from 'react';
import { MakingStudioList } from '../../components/functions/Studio/MakingStudioList';
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
import LocationSelect from '../../components/mobileComponents/studioListScreen/LocationSelect';
import {
  StudioListVar,
  StudioLocationVar,
  StudioSortByVar,
} from '../../apollo';
import SortingStudioFunction from '../../components/functions/Studio/SortingStudioFunction';
import PullToRefresh from 'react-simple-pull-to-refresh';

const StudioListScreen = () => {
  const { data, loading, error } = useQuery(ALL_STUDIOS_QUERY);
  const [isSortByOpen, setIsSortByOpen] = useState(false);
  const [isLocationByOpen, setIsLocationByOpen] = useState(false);
  const sortBy = useReactiveVar(StudioSortByVar);
  const locationBy = useReactiveVar(StudioLocationVar);
  const [searchKeyword, setSearchKeyword] = useState('');
  const studios = useReactiveVar(StudioListVar);

  useEffect(() => {
    if (studios.length === 0) {
      StudioListVar(MakingStudioList(data?.allStudios?.studios || []));
    }
  }, [studios, data]);

  useEffect(() => {
    document.body.style.overflow =
      isSortByOpen || isLocationByOpen ? 'hidden' : 'auto';
  }, [isSortByOpen, isLocationByOpen]);

  const studioList = locationBy
    ? SortingStudioFunction(studios, sortBy, locationBy, searchKeyword)
    : [];

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="studioListScreen">
      <div>
        <div className="header">
          <span className="headerTitle">스튜디오</span>
          <SearchBar onSearchSubmit={setSearchKeyword} />
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
      ) : locationBy ? (
        <>
          <div className="contentsBox">
            <div className="buttonContainer">
              <SortButton
                isOpen={isSortByOpen}
                open={() => setIsSortByOpen(true)}
                close={() => setIsSortByOpen(false)}
                closeAnother={() => setIsLocationByOpen(false)}
                options={STUDIO_SORT_OPTIONS}
                setOption={StudioSortByVar}
                selectedOption={sortBy}
              />
              <SortButton
                isOpen={isLocationByOpen}
                open={() => setIsLocationByOpen(true)}
                close={() => setIsLocationByOpen(false)}
                closeAnother={() => setIsSortByOpen(false)}
                options={STUDIO_LOCATION_OPTIONS}
                setOption={StudioLocationVar}
                selectedOption={locationBy}
              />
            </div>
          </div>
          <PullToRefresh onRefresh={handleRefresh}>
            <StudioListView
              studioList={studioList}
              selectedLocation={locationBy}
            />
          </PullToRefresh>
        </>
      ) : (
        <LocationSelect setStudiosLocation={StudioLocationVar} />
      )}
      <BottomNavigation pageName="studios" />
    </div>
  );
};

export default StudioListScreen;
