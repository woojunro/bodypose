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
import { GET_CONCEPT_BOOK_PHOTOS } from '../../gql/queries/StudioPhotoQuery';
import shuffle from '../../components/functions/Shuffle';
import {
  ConceptBookConceptsVar,
  ConceptBookGenderVar,
  ConceptBookInitialPageVar,
  ConceptBookPageListVar,
  ConceptBookRandomSeedVar,
} from '../../apollo';
import { normalRandom } from '../../components/functions/Concept/normalRandom';

const genderOptions = [null, 'MALE', 'FEMALE', 'COUPLE'];

const ConceptListScreen = () => {
  const randomSeed = useReactiveVar(ConceptBookRandomSeedVar);
  const initialPage = useReactiveVar(ConceptBookInitialPageVar);
  const pageList = useReactiveVar(ConceptBookPageListVar);
  const selectedGender = useReactiveVar(ConceptBookGenderVar);
  const selectedConcepts = useReactiveVar(ConceptBookConceptsVar);
  const [hasMore, setHasMore] = useState(true);

  const { data, error, loading, fetchMore } = useQuery(
    GET_CONCEPT_BOOK_PHOTOS,
    {
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
      onCompleted: data => {
        const { ok, totalPages } = data.conceptBookPhotos;
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
    }
  );

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
    if (!hasMore || error) {
      return;
    }

    const totalPages = data?.conceptBookPhotos?.totalPages;
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
        if (!fetchMoreResult?.conceptBookPhotos.photos) return prev;
        return Object.assign({}, prev, {
          ...prev,
          conceptBookPhotos: {
            ...prev.conceptBookPhotos,
            photos: [
              ...prev.conceptBookPhotos.photos,
              ...shuffle(fetchMoreResult.conceptBookPhotos.photos),
            ],
          },
        });
      },
    });

    ConceptBookPageListVar(new Set([...Array.from(pageList), newPage]));
  };

  useEffect(() => {
    if (
      selectedPhotoNum >=
      (data?.conceptBookPhotos?.photos?.length || Number.POSITIVE_INFINITY) - 3
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
          <InfiniteScroll
            dataLength={data?.conceptBookPhotos?.photos?.length || 0}
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
              {(data?.conceptBookPhotos?.photos || []).map((concept, idx) => (
                <ConceptListCard
                  key={`concept-book-photo-${concept.id}-${idx}`}
                  conceptNum={idx}
                  src={concept.thumbnailUrl}
                  setThisPhoto={() => handlePhotoNum(idx)}
                  openModal={openModal}
                />
              ))}
              {data?.conceptBookPhotos?.photos &&
                data.conceptBookPhotos.photos.length % 3 !== 0 &&
                [...Array(3 - (data.conceptBookPhotos.photos.length % 3))].map(
                  (_, idx) => (
                    <div
                      key={`concept-blank-${idx}`}
                      className="concepListCardContainer"
                    />
                  )
                )}
            </div>
          </InfiniteScroll>
        </PullToRefresh>
        {isModalOpen && (
          <ConceptModal
            close={closeModal}
            id={data.conceptBookPhotos.photos[selectedPhotoNum].id}
            setThisPhoto={handlePhotoNum}
            selectedPhotoNum={selectedPhotoNum}
            isFinalPhoto={
              selectedPhotoNum >= data.conceptBookPhotos.photos.length - 1
            }
            whileFetching={loading}
          />
        )}
        <BottomNavigation pageName="concepts" />
      </div>
    </div>
  );
};

export default ConceptListScreen;
