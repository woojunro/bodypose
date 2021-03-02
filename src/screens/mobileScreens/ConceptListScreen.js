import React, { useState, useEffect } from 'react';
import BottomNavigation from '../../components/mobileComponents/BottomNavigation';
import TopNavigator from '../../components/mobileComponents/conceptListScreen/TopNavigator';
import InfiniteScroll from 'react-infinite-scroll-component';
import ConceptListCard from '../../components/mobileComponents/conceptListScreen/ConceptListCard';
import ConceptModal from '../../components/mobileComponents/conceptListScreen/ConceptModal';
import SelectionModal from '../../components/mobileComponents/conceptListScreen/SelectionModal';
import './ConceptListScreen.css';
import LoadingIcon from '../../components/mobileComponents/conceptListScreen/LoadingIcon';
import { FaSlidersH } from 'react-icons/fa';
import { useQuery } from '@apollo/client';
import { ALL_STUDIO_PHOTOS_QUERY } from '../../gql/queries/StudioPhotoQuery';
import { randomPage } from '../../components/functions/Concept/randomPages';
import shuffle from '../../components/functions/Shuffle';
import ReactGA from 'react-ga';
const genderOptions = [null, 'MALE', 'FEMALE', 'COUPLE'];

const ConceptListScreen = () => {
  React.useEffect(() => {
    ReactGA.pageview(window.location.pathname);
  }, []);
  const [initialPage, setInitialPage] = useState(1);
  const [isPageInitialized, setIsPageInitialized] = useState(false);
  const [pageList, setPageList] = useState([]);
  const [selectedGender, setSelectedGender] = useState(genderOptions[0]);
  const [selectedConcepts, setSelectedConcepts] = useState({
    bgConcept: [],
    costumeConcept: [],
    objectConcept: [],
  });
  const [hasMore, setHasMore] = useState(true);

  const { data, loading, fetchMore } = useQuery(ALL_STUDIO_PHOTOS_QUERY, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    variables: {
      page: initialPage,
      gender: selectedGender,
      backgroundConceptSlugs: selectedConcepts.bgConcept,
      costumeConceptSlugs: selectedConcepts.costumeConcept,
      objectConceptSlugs: selectedConcepts.objectConcept,
    },
    onCompleted: data => {
      if (!data.allStudioPhotos.ok) {
        setHasMore(false);
      } else {
        if (data.allStudioPhotos.totalPages <= 1) {
          setHasMore(false);
        } else {
          if (!isPageInitialized) {
            const newPage = randomPage(data.allStudioPhotos.totalPages - 1);
            setInitialPage(newPage);
            setPageList([newPage]);
            setIsPageInitialized(true);
          }
        }
      }
    },
    onError: () => setHasMore(false),
  });

  const [isSelectionOpen, setIsSelectionOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPhotoNum, setSelectedPhotoNum] = useState(0);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const handlePhotoNum = num => {
    setSelectedPhotoNum(num);
  };

  const handleConcepts = object => {
    setSelectedConcepts(object);
  };

  useEffect(() => {
    document.body.style.overflow =
      isSelectionOpen || isModalOpen ? 'hidden' : 'auto';
  }, [isSelectionOpen, isModalOpen]);

  useEffect(() => {
    setInitialPage(1);
    setIsPageInitialized(false);
  }, [selectedConcepts, selectedGender]);

  const fetchMoreData = () => {
    if (!data || !hasMore) {
      return;
    }
    if (!data.allStudioPhotos) return;

    if (pageList.length >= data.allStudioPhotos.totalPages) {
      setHasMore(false);
      return;
    }

    let newPage;
    for (;;) {
      newPage = randomPage(data.allStudioPhotos.totalPages);
      if (!pageList.includes(newPage)) break;
    }

    fetchMore({
      variables: {
        page: newPage,
        gender: selectedGender,
        backgroundConceptSlugs: selectedConcepts.bgConcept,
        costumeConceptSlugs: selectedConcepts.costumeConcept,
        objectConceptSlugs: selectedConcepts.objectConcept,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult?.allStudioPhotos.photos) return prev;
        return Object.assign({}, prev, {
          ...prev,
          allStudioPhotos: {
            ...prev.allStudioPhotos,
            photos: [
              ...prev.allStudioPhotos.photos,
              ...shuffle(fetchMoreResult.allStudioPhotos.photos),
            ],
          },
        });
      },
    });

    setPageList([...pageList, newPage]);
  };

  useEffect(() => {
    if (!data || !data.allStudioPhotos || !data.allStudioPhotos.photos) {
      return;
    }

    if (selectedPhotoNum >= data.allStudioPhotos.photos.length - 3) {
      fetchMoreData();
    }
  }, [selectedPhotoNum]);

  return (
    <div>
      <div className="conceptListScreen">
        <div>
          <div className="header">
            <span className="headerTitle">컨셉북</span>
            <FaSlidersH
              className="sortIcon"
              onClick={() => setIsSelectionOpen(!isSelectionOpen)}
            />
          </div>
          <div style={{ height: '50px' }} />
        </div>
        {isSelectionOpen ? (
          <SelectionModal
            close={() => {
              setIsSelectionOpen(false);
            }}
            selectedBgConcepts={selectedConcepts.bgConcept}
            selectedCostumeConcepts={selectedConcepts.costumeConcept}
            selectedObjectConcepts={selectedConcepts.objectConcept}
            setSelection={handleConcepts}
            setPageList={setPageList}
            setHasMore={setHasMore}
          />
        ) : null}
        <TopNavigator
          options={genderOptions}
          selectedGender={selectedGender}
          setGender={setSelectedGender}
          setHasMore={setHasMore}
        />
        <InfiniteScroll
          dataLength={data?.allStudioPhotos?.photos?.length || 0}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<LoadingIcon />}
          endMessage={
            <div className="endMessageContainer">
              <div>모든 사진을 불러왔습니다.</div>
            </div>
          }
        >
          <div className="totalConcept">
            {(data?.allStudioPhotos?.photos || []).map((concept, idx) => (
              <ConceptListCard
                key={`concept-list-${concept.id}-${idx}`}
                conceptNum={idx}
                src={concept.thumbnailUrl}
                setThisPhoto={() => handlePhotoNum(idx)}
                openModal={openModal}
              />
            ))}
            {!data?.allStudioPhotos?.photos
              ? null
              : data.allStudioPhotos.photos.length % 3 === 0
              ? null
              : [
                  ...Array(3 - (data.allStudioPhotos.photos.length % 3)),
                ].map((_, idx) => (
                  <div
                    key={`concept-blank-${idx}`}
                    className="concepListCardContainer"
                  />
                ))}
          </div>
        </InfiniteScroll>
        {isModalOpen ? (
          <ConceptModal
            close={closeModal}
            id={data.allStudioPhotos.photos[selectedPhotoNum].id}
            setThisPhoto={handlePhotoNum}
            selectedPhotoNum={selectedPhotoNum}
            isFinalPhoto={
              selectedPhotoNum >= data.allStudioPhotos.photos.length - 1
            }
            whileFetching={loading}
          />
        ) : null}
        <BottomNavigation pageName="concepts" />
      </div>
    </div>
  );
};

export default ConceptListScreen;
