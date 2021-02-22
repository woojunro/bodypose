import React, { useState, useEffect } from 'react';
import HeaderBar from '../../components/mobileComponents/StudioInfoScreen/HeaderBar';
import TitlePart from '../../components/mobileComponents/StudioInfoScreen/TitlePart';
import StudioLinks from '../../components/mobileComponents/StudioInfoScreen/StudioLinks';
import TopNavigator from '../../components/mobileComponents/StudioInfoScreen/TopNavigator';
import Portfolio from '../../components/mobileComponents/StudioInfoScreen/Portfolio';
import ItemTab from '../../components/mobileComponents/StudioInfoScreen/ItemTab';
import InfoTab from '../../components/mobileComponents/StudioInfoScreen/InfoTab';
import ReviewTab from '../../components/mobileComponents/StudioInfoScreen/ReviewTab';
import BottomAlertDialog from '../../components/mobileComponents/BottomAlertDialog';

import SeeMoreStudio from '../../components/mobileComponents/StudioInfoScreen/SeeMoreStudio';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { STUDIO_QUERY } from '../../gql/queries/StudioQuery';
import AppLoadingScreen from '../../components/mobileComponents/AppLoadingScreen';
import { ALL_STUDIOS_QUERY } from '../../gql/queries/AllStudiosQuery';
import ScrollToTopButton from '../../components/mobileComponents/ScrollToTopButton';

const StudioInfoScreen = () => {
  const { slug } = useParams();
  const { data, loading, refetch } = useQuery(STUDIO_QUERY, {
    variables: { slug },
  });
  const { data: studioData, loading: studioLoading } = useQuery(
    ALL_STUDIOS_QUERY,
    {
      fetchPolicy: 'cache-and-network',
    }
  );
  const [navigator, setNavigator] = useState('portfolio');
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [offsetY, setOffsetY] = useState(0);

  const copyTextToClipboard = () => {
    var dummy = document.createElement('input'),
      text = window.location.href;

    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
  };

  useEffect(() => {
    window.onscroll = () => {
      setOffsetY(window.pageYOffset);
    };
    const cleanup = () => {
      window.onscroll = () => {};
    };
    return cleanup;
  }, []);

  if (loading || studioLoading) {
    return (
      <div className="appFullScreenCenter">
        <AppLoadingScreen />
      </div>
    );
  }

  const studio = data ? data.studio.studio : null;
  const products = data ? data.products : null;

  const renderedItem = () => {
    if (navigator === 'portfolio') {
      return <Portfolio studioSlug={studio.slug} studioName={studio.name} />;
    } else if (navigator === 'item') {
      return <ItemTab currentStudio={studio} products={products} />;
    } else if (navigator === 'info') {
      return <InfoTab currentStudio={studio} />;
    } else {
      return <ReviewTab currentStudio={studio} refetchStudio={refetch} />;
    }
  };

  return (
    <div>
      {offsetY > 200 && <ScrollToTopButton />}

      <BottomAlertDialog
        isOpen={isAlertOpen}
        setIsOpen={setIsAlertOpen}
        dialog="주소가 복사되었습니다."
      />
      <HeaderBar
        currentStudio={studio}
        copyTextToClipboard={copyTextToClipboard}
        setIsAlertOpen={setIsAlertOpen}
      />
      <TitlePart currentStudio={studio} />
      <StudioLinks currentStudio={studio} />
      <TopNavigator
        navigator={navigator}
        setNavigator={setNavigator}
        reviews={studio.reviewCount}
      />
      {renderedItem()}
      <SeeMoreStudio
        currentStudioName={studio.name}
        studioList={studioData.allStudios.studios}
      />
    </div>
  );
};

export default StudioInfoScreen;
