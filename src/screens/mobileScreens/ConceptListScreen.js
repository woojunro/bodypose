import React, { useState, useEffect } from 'react';
import BottomNavigation from '../../components/mobileComponents/BottomNavigation';
import TopNavigator from '../../components/mobileComponents/conceptListScreen/TopNavigator';
import PullToRefresh from '../../components/mobileComponents/PullToRefresh';
import InfiniteScroll from 'react-infinite-scroll-component';
import ConceptListCard from '../../components/mobileComponents/conceptListScreen/ConceptListCard';
import ConceptModal from '../../components/mobileComponents/conceptListScreen/ConceptModal';
import SelectionModal from '../../components/mobileComponents/conceptListScreen/SelectionModal';
import './ConceptListScreen.css';
import LoadingIcon from '../../components/mobileComponents/conceptListScreen/LoadingIcon';
import { FaSlidersH } from 'react-icons/fa';
import { useQuery, useReactiveVar } from '@apollo/client';
import {
  GET_ALL_CONCEPT_BOOK_PHOTOS,
  GET_PREMIUM_CONCEPT_BOOK_PHOTOS,
} from '../../gql/queries/StudioPhotoQuery';
import shuffle from '../../components/functions/Shuffle';
import {
  ConceptBookConceptsVar,
  ConceptBookGenderVar,
  ConceptBookInitialPageVar,
  ConceptBookPageListVar,
  ConceptBookRandomSeedVar,
} from '../../apollo';
import { normalRandom } from '../../components/functions/Concept/normalRandom';
import { PREMIUM_PHOTOS_NUM } from '../../constants/numOfPhotos';

const genderOptions = [null, 'MALE', 'FEMALE', 'COUPLE'];

const ConceptListScreen = () => {
  const randomSeed = useReactiveVar(ConceptBookRandomSeedVar);
  const initialPage = useReactiveVar(ConceptBookInitialPageVar);
  const pageList = useReactiveVar(ConceptBookPageListVar);
  const selectedGender = useReactiveVar(ConceptBookGenderVar);
  const selectedConcepts = useReactiveVar(ConceptBookConceptsVar);
  const [hasMore, setHasMore] = useState(true);

  const {
    data: specialData,
    error: specialError,
    loading: specialLoading,
    fetchMore,
  } = useQuery(GET_ALL_CONCEPT_BOOK_PHOTOS, {
    notifyOnNetworkStatusChange: true,
    variables: {
      input: {
        page: initialPage === -1 ? 1 : initialPage,
        gender: selectedGender,
        backgroundConceptSlugs: selectedConcepts.bgConcept,
        costumeConceptSlugs: selectedConcepts.costumeConcept,
        objectConceptSlugs: selectedConcepts.objectConcept,
        randomSeed,
      },
    },
    onCompleted: specialData => {
      const { ok, totalPages } = specialData.allConceptBookPhotos;
      if (!ok) {
        setHasMore(false);
      } else {
        if (totalPages <= 1) {
          setHasMore(false);
        } else {
          if (initialPage === -1) {
            let newPage = 0;
            while (newPage < 1 || newPage > totalPages) {
              newPage = normalRandom();
            }
            ConceptBookInitialPageVar(newPage);
            ConceptBookPageListVar(new Set([newPage]));
          }
        }
      }
    },
    onError: () => setHasMore(false),
  });
  const {
    data: premiumData,
    error: premiumError,
    loading: premiumLoading,
  } = useQuery(GET_PREMIUM_CONCEPT_BOOK_PHOTOS, {
    notifyOnNetworkStatusChange: true,
    variables: {
      input: {
        page: initialPage === -1 ? 1 : initialPage,
        take: PREMIUM_PHOTOS_NUM,
        gender: selectedGender,
        backgroundConceptSlugs: selectedConcepts.bgConcept,
        costumeConceptSlugs: selectedConcepts.costumeConcept,
        objectConceptSlugs: selectedConcepts.objectConcept,
        randomSeed,
      },
    },
    onCompleted: data => {},

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
    ConceptBookConceptsVar(object);
  };

  useEffect(() => {
    document.body.style.overflow =
      isSelectionOpen || isModalOpen ? 'hidden' : 'auto';
  }, [isSelectionOpen, isModalOpen]);

  useEffect(() => {
    ConceptBookInitialPageVar(-1);
    ConceptBookPageListVar(new Set());
  }, [selectedConcepts, selectedGender]);

  const fetchMoreData = () => {
    if (!hasMore || specialError || premiumError) {
      return;
    }

    const totalPages = specialData?.allConceptBookPhotos?.totalPages;
    if (!totalPages) return;

    if (pageList.size >= totalPages) {
      setHasMore(false);
      return;
    }

    let newPage;
    for (;;) {
      newPage = normalRandom();
      if (newPage > totalPages || pageList.has(newPage)) {
        // continue
      } else break;
    }

    fetchMore({
      variables: {
        input: {
          page: newPage,
          gender: selectedGender,
          backgroundConceptSlugs: selectedConcepts.bgConcept,
          costumeConceptSlugs: selectedConcepts.costumeConcept,
          objectConceptSlugs: selectedConcepts.objectConcept,
          randomSeed,
        },
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult?.allConceptBookPhotos.photos) return prev;
        return Object.assign({}, prev, {
          ...prev,
          allConceptBookPhotos: {
            ...prev.allConceptBookPhotos,
            photos: [
              ...prev.allConceptBookPhotos.photos,
              ...shuffle(fetchMoreResult.allConceptBookPhotos.photos),
            ],
          },
        });
      },
    });

    ConceptBookPageListVar(new Set([...Array.from(pageList), newPage]));
  };

  useEffect(() => {
    if (
      selectedPhotoNum - PREMIUM_PHOTOS_NUM >=
      (specialData?.allConceptBookPhotos?.photos?.length ||
        Number.POSITIVE_INFINITY) -
        3
    ) {
      fetchMoreData();
    }
  }, [selectedPhotoNum]);

  return (
    <div>
      <div className="conceptListScreen">
        <div>
          <div className="header">
            <span className="headerTitle">컨셉북</span>
            <span
              className="sortIcon"
              onClick={() => setIsSelectionOpen(!isSelectionOpen)}
            >
              <span className="sortIconText">필터</span>
              <FaSlidersH />
            </span>
          </div>
          <div style={{ height: '50px' }} />
        </div>
        {isSelectionOpen ? (
          <SelectionModal
            close={() => setIsSelectionOpen(false)}
            selectedBgConcepts={selectedConcepts.bgConcept}
            selectedCostumeConcepts={selectedConcepts.costumeConcept}
            selectedObjectConcepts={selectedConcepts.objectConcept}
            setSelection={handleConcepts}
            setHasMore={setHasMore}
          />
        ) : null}
        <TopNavigator
          options={genderOptions}
          selectedGender={selectedGender}
          setGender={ConceptBookGenderVar}
          setHasMore={setHasMore}
        />
        <PullToRefresh
          onRefresh={async () => {
            ConceptBookRandomSeedVar(Math.floor(Math.random() * 10001));
            ConceptBookInitialPageVar(-1);
            ConceptBookPageListVar(new Set());
            setHasMore(true);
          }}
        >
          <div className="totalConcept">
            {(premiumData?.premiumConceptBookPhotos?.photos || []).map(
              (concept, idx) => (
                <ConceptListCard
                  key={`concept-book-photo-${concept.id}-${idx}`}
                  conceptNum={idx}
                  src={concept.thumbnailUrl}
                  setThisPhoto={() => handlePhotoNum(idx)}
                  openModal={openModal}
                />
              )
            )}
            {premiumData?.premiumConceptBookPhotos?.photos &&
              premiumData.premiumConceptBookPhotos.photos.length % 3 !== 0 &&
              [
                ...Array(
                  3 - (premiumData.premiumConceptBookPhotos.photos.length % 3)
                ),
              ].map((_, idx) => (
                <div
                  key={`concept-blank-${idx}`}
                  className="concepListCardContainer"
                />
              ))}
          </div>

          <InfiniteScroll
            dataLength={specialData?.allConceptBookPhotos?.photos?.length || 0}
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
              {(specialData?.allConceptBookPhotos?.photos || []).map(
                (concept, idx) => (
                  <ConceptListCard
                    key={`concept-book-photo-${concept.id}-${idx}`}
                    conceptNum={idx + PREMIUM_PHOTOS_NUM}
                    src={concept.thumbnailUrl}
                    setThisPhoto={() =>
                      handlePhotoNum(idx + PREMIUM_PHOTOS_NUM)
                    }
                    openModal={openModal}
                  />
                )
              )}
              {specialData?.allConceptBookPhotos?.photos &&
                specialData.allConceptBookPhotos.photos.length % 3 !== 0 &&
                [
                  ...Array(
                    3 - (specialData.allConceptBookPhotos.photos.length % 3)
                  ),
                ].map((_, idx) => (
                  <div
                    key={`concept-blank-${idx}`}
                    className="concepListCardContainer"
                  />
                ))}
            </div>
          </InfiniteScroll>
        </PullToRefresh>
        {isModalOpen && (
          <ConceptModal
            close={closeModal}
            id={
              selectedPhotoNum < PREMIUM_PHOTOS_NUM
                ? premiumData.premiumConceptBookPhotos.photos[selectedPhotoNum]
                    .id
                : specialData.allConceptBookPhotos.photos[
                    selectedPhotoNum - PREMIUM_PHOTOS_NUM
                  ].id
            }
            setThisPhoto={handlePhotoNum}
            selectedPhotoNum={selectedPhotoNum}
            isFinalPhoto={
              selectedPhotoNum - PREMIUM_PHOTOS_NUM >=
              specialData.allConceptBookPhotos.photos.length - 1
            }
            whileFetching={specialLoading}
          />
        )}
        <BottomNavigation pageName="concepts" />
      </div>
    </div>
  );
};

export default ConceptListScreen;
