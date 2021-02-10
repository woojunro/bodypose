import React, { useState, useEffect } from 'react';
import BottomNavigation from '../../components/mobileComponents/BottomNavigation';
import TopNavigator from '../../components/mobileComponents/conceptListScreen/TopNavigator';
import InfiniteScroll from 'react-infinite-scroll-component';
import shuffle from '../../components/functions/Shuffle';
import ConceptListCard from '../../components/mobileComponents/conceptListScreen/ConceptListCard';
import ConceptModal from '../../components/mobileComponents/conceptListScreen/ConceptModal';
import SelectionModal from '../../components/mobileComponents/conceptListScreen/SelectionModal';
import './ConceptListScreen.css';
import LoadingIcon from '../../components/mobileComponents/conceptListScreen/LoadingIcon';
import { FaSlidersH } from 'react-icons/fa';
import { GetConceptPhotos } from '../../components/functions/WithDb/ConceptList';
import { useQuery } from '@apollo/client';
import { ALL_STUDIO_PHOTOS_QUERY } from '../../gql/queries/StudioPhotoQuery';
import { randomPage } from '../../components/functions/Concept/randomPages';

const genderOptions = ['전체', '남성', '여성', '커플'];

const ConceptListScreen = () => {
  const [whileFetching, setWhileFetching] = useState(false);
  const [pageList, setPageList] = useState([1]);
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedConcepts, setSelectedConcepts] = useState({
    bgConcept: [],
    costumeConcept: [],
    objectConcept: [],
  });

  const { data, fetchMore } = useQuery(ALL_STUDIO_PHOTOS_QUERY, {
    variables: {
      page: 1,
      gender: selectedGender,
      backgroundConceptSlugs: selectedConcepts.bgConcept,
      costumeConceptSlugs: selectedConcepts.costumeConcept,
      objectConceptSlugs: selectedConcepts.objectConcept,
    },
    onError: () => alert('오류가 발생하였습니다. 다시 시도해주세요.'),
  });

  const [isSelectionOpen, setIsSelectionOpen] = useState(false);
  const [i, setI] = useState(0);

  const [hasMore, setHasMore] = useState(true);
  const [gender, setGender] = useState(genderOptions[0]);
  //초기에 Db에서 사진 불러와야하는 부분.
  const [conceptArray, setConceptArray] = useState(
    shuffle(GetConceptPhotos(i))
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPhotoNum, setSelectedPhotoNum] = useState(0);
  const [isFinalPhoto, setIsFinalPhoto] = useState(false);
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const openModal = () => {
    setIsModalOpen(true);
  };
  const handlePhotoNum = num => {
    setSelectedPhotoNum(num);
  };
  const cancleFinalPhoto = () => {
    setIsFinalPhoto(false);
  };
  const handleConcepts = object => {
    setSelectedConcepts(object);
  };
  useEffect(() => {
    document.body.style.overflow =
      isSelectionOpen || isModalOpen ? 'hidden' : 'auto';
  }, [isSelectionOpen, isModalOpen]);

  const fetchMoreData = () => {
    console.log(data.allStudioPhotos.totalPages);
    if (pageList.length === data.allStudioPhotos.totalPages) {
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
              ...fetchMoreResult.allStudioPhotos.photos,
            ],
          },
        });
      },
    });

    setPageList([...pageList, newPage]);
  };

  //큰 화면으로 볼 때 10개 이후 새로운 것이 필요하면 미리 불러두기.
  const needFetchMoreData = selectedPhotoNum => {
    if (selectedPhotoNum > conceptArray.length - 10 && hasMore) {
      setWhileFetching(true);
      fetchMoreData();
    }
    if (!hasMore && selectedPhotoNum === conceptArray.length - 1) {
      setIsFinalPhoto(true);
    }
  };
  //성별 및 컨셉 바꾸면 Db에서 사진 다시 불러와야하는 부분.
  const getDb = () => {
    setI(0);
    setHasMore(true);
    setConceptArray(shuffle(GetConceptPhotos(0)));
  };

  useEffect(() => {
    getDb();
  }, [gender, selectedConcepts]);

  return (
    <div>
      <div className="conceptListScreen">
        <div>
          <div className="header">
            <span className="headerTitle">컨셉북</span>
            <FaSlidersH
              className="sortIcon"
              onClick={() => setIsSelectionOpen(true)}
            />
          </div>
          <div style={{ height: '50px' }} />
        </div>
        <SelectionModal
          isOpen={isSelectionOpen}
          close={() => {
            setIsSelectionOpen(false);
          }}
          selectedBgConcepts={selectedConcepts.bgConcept}
          selectedCostumeConcepts={selectedConcepts.costumeConcept}
          selectedObjectConcepts={selectedConcepts.objectConcept}
          setSelection={handleConcepts}
        />
        <TopNavigator
          options={genderOptions}
          selectedGender={gender}
          setGender={setGender}
        />
        <InfiniteScroll
          dataLength={data?.allStudioPhotos.photos.length || 0}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<LoadingIcon />}
          endMessage={
            <div className="endMessageContainer">
              <div>모든 사진을 불러왔습니다</div>
            </div>
          }
        >
          <div className="totalConcept">
            {(data?.allStudioPhotos.photos || []).map((concept, idx) => (
              <ConceptListCard
                key={`concept-list-${concept.id}-${idx}`}
                conceptNum={idx}
                src={concept.thumbnailUrl}
                setThisPhoto={handlePhotoNum}
                openModal={openModal}
                needFetchMoreData={needFetchMoreData}
              />
            ))}
          </div>
        </InfiniteScroll>
        {isModalOpen ? (
          <ConceptModal
            whileFetching={whileFetching}
            isOpen={isModalOpen}
            close={closeModal}
            concept={conceptArray[selectedPhotoNum]}
            openModal={openModal}
            setThisPhoto={handlePhotoNum}
            needFetchMoreData={needFetchMoreData}
            photoNum={selectedPhotoNum}
            isFinalPhoto={isFinalPhoto}
            handleIsFinalPhoto={cancleFinalPhoto}
          />
        ) : null}
        <BottomNavigation pageName="concepts" />
      </div>
    </div>
  );
};

export default ConceptListScreen;
