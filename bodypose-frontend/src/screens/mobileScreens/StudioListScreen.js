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
import {
  ALL_PREMIUM_STUDIOS_QUERY,
  ALL_SPECIAL_STUDIOS_QUERY,
} from '../../gql/queries/AllStudiosQuery';
import LocationSelect from '../../components/mobileComponents/studioListScreen/LocationSelect';
import {
  PremiumStudioListVar,
  SpecialStudioListVar,
  StudioLocationVar,
  StudioSortByVar,
} from '../../apollo';
import SortingStudioFunction from '../../components/functions/Studio/SortingStudioFunction';
import PullToRefresh from '../../components/mobileComponents/PullToRefresh';

const StudioListScreen = () => {
  const {
    data: premiumData,
    loading: premiumLoading,
    error: premiumError,
    refetch: premiumRefetch,
  } = useQuery(ALL_PREMIUM_STUDIOS_QUERY);
  const {
    data: specialData,
    loading: specialLoading,
    error: specialError,
    refetch: specialRefetch,
  } = useQuery(ALL_SPECIAL_STUDIOS_QUERY);
  const [isSortByOpen, setIsSortByOpen] = useState(false);
  const [isLocationByOpen, setIsLocationByOpen] = useState(false);
  const sortBy = useReactiveVar(StudioSortByVar);
  const locationBy = useReactiveVar(StudioLocationVar);
  const [searchKeyword, setSearchKeyword] = useState('');
  const premiumStudios = useReactiveVar(PremiumStudioListVar);
  const specialStudios = useReactiveVar(SpecialStudioListVar);

  useEffect(() => {
    if (premiumStudios.length === 0) {
      PremiumStudioListVar(
        MakingStudioList(premiumData?.allPremiumStudios?.studios || [])
      );
    }
    if (specialStudios.length === 0) {
      SpecialStudioListVar(
        MakingStudioList(specialData?.allSpecialStudios?.studios || [])
      );
    }
  }, [premiumStudios, premiumData, specialStudios, specialData]);

  useEffect(() => {
    document.body.style.overflow =
      isSortByOpen || isLocationByOpen ? 'hidden' : 'auto';
  }, [isSortByOpen, isLocationByOpen]);

  const premiumStudioList = locationBy
    ? SortingStudioFunction(premiumStudios, sortBy, locationBy, searchKeyword)
    : [];

  const specialStudioList = locationBy
    ? SortingStudioFunction(specialStudios, sortBy, locationBy, searchKeyword)
    : [];

  const handleRefresh = async () => {
    const { data: premiumData } = await premiumRefetch();
    if (premiumData?.allPremiumStudios?.ok) {
      PremiumStudioListVar(
        MakingStudioList(premiumData?.allPremiumStudios?.studios || [])
      );
    }
    const { data: specialData } = await premiumRefetch();
    if (specialData?.allStudios?.ok) {
      PremiumStudioListVar(
        MakingStudioList(specialData?.allSpecialStudios?.studios || [])
      );
    }
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

      {premiumLoading || specialLoading ? (
        <div className="appLoader">
          <AppLoadingScreen />
        </div>
      ) : premiumError || specialError ? (
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
            {premiumStudioList.length > 0 && (
              <>
                <div className="studio-list-premium-studio-container">
                  <div className="studio-list-premium-studio">
                    프리미엄 스튜디오
                  </div>
                  <div className="studio-list-sponsored">Sponsored </div>
                </div>

                <StudioListView
                  studioList={premiumStudioList}
                  selectedLocation={locationBy}
                />
              </>
            )}
            <div className="studio-list-premium-studio-container">
              <div className="studio-list-premium-studio">스페셜 스튜디오</div>
              <div className="studio-list-sponsored">Sponsored </div>
            </div>

            <StudioListView
              studioList={specialStudioList}
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
