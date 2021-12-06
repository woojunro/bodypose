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
import { useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { STUDIO_QUERY } from '../../gql/queries/StudioQuery';
import AppLoadingScreen from '../../components/mobileComponents/AppLoadingScreen';
import { ALL_PREMIUM_STUDIOS_QUERY } from '../../gql/queries/AllStudiosQuery';
import ScrollToTopButton from '../../components/mobileComponents/ScrollToTopButton';
import {
  CONTACT_STUDIO_MUTATION,
  VIEW_STUDIO_INFO_MUTATION,
} from '../../gql/mutations/LogMutation';

const StudioInfoScreen = () => {
  const { slug } = useParams();

  const { data, loading, refetch } = useQuery(STUDIO_QUERY, {
    variables: { slug },
    onCompleted: data => {
      if (!data.studio.ok) {
        history.push('/error');
        return;
      }
      const studioId = data.studio.studio.id;
      let source = 'ETC';
      switch (history.location.state?.previousPath) {
        case '/':
          source = 'HOME';
          break;
        case '/studios':
          source = 'STUDIO_LIST';
          break;
        case '/concepts':
          source = 'STUDIO_PHOTO';
          break;
        case '/reviews':
          source = 'STUDIO_REVIEW';
          break;
        default:
          source = 'ETC';
          break;
      }
      viewStudioInfo({
        variables: {
          input: {
            source,
            studioId,
          },
        },
      });
    },
    onError: () => history.push('/error'),
  });

  const history = useHistory();

  const { data: studioData, loading: studioLoading } = useQuery(
    ALL_PREMIUM_STUDIOS_QUERY
  );

  const [viewStudioInfo] = useMutation(VIEW_STUDIO_INFO_MUTATION);

  const [contactStudio] = useMutation(CONTACT_STUDIO_MUTATION);

  const onContactClick = contactType => {
    contactStudio({
      variables: {
        input: {
          studioId: data.studio.studio.id,
          contactType,
        },
      },
    });
  };

  const [navigator, setNavigator] = useState('portfolio');
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [offsetY, setOffsetY] = useState(0);

  const copyTextToClipboard = () => {
    const dummy = document.createElement('input');
    const text = window.location.href;
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand('copy');
    dummy.remove();
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setNavigator('portfolio');
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => setOffsetY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading || studioLoading) {
    return (
      <div className="appFullScreenCenter">
        <AppLoadingScreen />
      </div>
    );
  }

  const studio = data?.studio?.studio;
  const products = data?.products;

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

  //이전이 스튜디오였다면 string으로 저장
  let prevPath;
  if (history.location.state?.previousPath) {
    prevPath = history.location.state?.previousPath;
  }

  return (
    <div>
      {offsetY > 200 && <ScrollToTopButton />}
      <BottomAlertDialog
        isOpen={isAlertOpen}
        setIsOpen={setIsAlertOpen}
        dialog="주소가 복사되었습니다."
      />
      <HeaderBar
        previousPath={prevPath}
        currentStudio={studio}
        copyTextToClipboard={copyTextToClipboard}
        setIsAlertOpen={setIsAlertOpen}
      />
      <TitlePart currentStudio={studio} />
      <StudioLinks currentStudio={studio} onContactClick={onContactClick} />
      <TopNavigator
        navigator={navigator}
        setNavigator={setNavigator}
        reviews={studio.reviewCount}
      />
      {renderedItem()}
      <SeeMoreStudio
        currentStudioName={studio.name}
        studioList={studioData.allPremiumStudios.studios}
      />
    </div>
  );
};

export default StudioInfoScreen;
