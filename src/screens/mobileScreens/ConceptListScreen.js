import React, { useState, useEffect } from 'react';
import BottomNavigation from '../../components/mobileComponents/BottomNavigation';
import TopNavigator from '../../components/mobileComponents/conceptListScreen/TopNavigator';
import Header from '../../components/mobileComponents/HeaderM';
import InfiniteScroll from 'react-infinite-scroll-component';
import { DbPhotos } from '../../virtualDB/items/DbPhotos';
import shuffle from '../../components/functions/Shuffle';
import ConceptListCard from '../../components/mobileComponents/conceptListScreen/ConceptListCard';
import ConceptModal from '../../components/mobileComponents/conceptListScreen/ConceptModal';
import SelectionModal from '../../components/mobileComponents/conceptListScreen/SelectionModal';
import './ConceptListScreen.css';
import LoadingIcon from '../../components/mobileComponents/conceptListScreen/LoadingIcon';
import { FaSlidersH } from 'react-icons/fa';

const genderOptions = ['전체', '남성', '여성', '커플'];
var conceptNum = -24;

const ConceptListScreen = () => {
  //fetching 중인가?
  const [whileFetching, setWhileFetching] = useState(false);
  //선택된 컨셉 목록.
  const [selectedConcepts, setSelectedConcepts] = useState({
    bgConcept: ['total'],
    costumeConcept: ['total'],
    objectConcept: ['total'],
  });

  const [isSelectionOpen, setIsSelectionOpen] = useState(false);
  const [i, setI] = useState(0);

  const [isMore, setIsMore] = useState(true);
  const [gender, setGender] = useState(genderOptions[0]);
  //초기에 Db에서 사진 불러와야하는 부분.
  const [conceptArray, setConceptArray] = useState(
    shuffle(DbPhotos.slice(i, i + 24))
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
  const handlePhotoNum = (num) => {
    setSelectedPhotoNum(num);
  };
  const cancleFinalPhoto = () => {
    setIsFinalPhoto(false);
  };
  const handleConcepts = (object) => {
    setSelectedConcepts(object);
  };
  conceptNum = 0;

  const fetchMoreData = () => {
    setI(i + 24);

    setTimeout(() => {
      const currentData = conceptArray;
      //Db에서 사진 더 불러와야 하는 부분.
      const moreData = currentData.concat(
        shuffle(DbPhotos.slice(i + 24, i + 48))
      );
      setConceptArray(moreData);

      currentData.length === moreData.length
        ? setIsMore(false)
        : setIsMore(true);
      //다 불러오고 fetching 상태 바꿔주기.
      setWhileFetching(false);
    }, 1000);
  };

  //큰 화면으로 볼 때 10개 이후 새로운 것이 필요하면 미리 불러두기.
  const needFetchMoreData = (selectedPhotoNum) => {
    if (selectedPhotoNum > conceptArray.length - 10 && isMore) {
      setWhileFetching(true);
      fetchMoreData();
    }
    if (!isMore && selectedPhotoNum === conceptArray.length - 1) {
      setIsFinalPhoto(true);
    }
  };
  //성별 및 컨셉 바꾸면 Db에서 사진 다시 불러와야하는 부분.
  const getDb = () => {
    setI(0);
    setIsMore(true);
    setConceptArray(shuffle(DbPhotos.slice(0, 24)));
  };

  useEffect(() => {
    getDb();
  }, [gender, selectedConcepts]);

  return (
    <div className="conceptListScreen">
      <FaSlidersH
        className="sortIcon"
        onClick={() => setIsSelectionOpen(true)}
      />
      <Header pageName="concepts" />
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
        dataLength={conceptArray.length}
        next={fetchMoreData}
        hasMore={isMore}
        loader={<LoadingIcon />}
        endMessage={
          <div className="endMessageContainer">
            <div>모든 사진을 불러왔습니다</div>
          </div>
        }
      >
        <div className="totalConcept">
          {conceptArray.map((concept) => (
            <ConceptListCard
              key={concept.photoName}
              conceptNum={conceptNum++}
              photo={concept}
              isModalOpen={isModalOpen}
              setThisPhoto={handlePhotoNum}
              openModal={openModal}
              needFetchMoreData={needFetchMoreData}
            />
          ))}
        </div>
      </InfiniteScroll>
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
      <BottomNavigation pageName="concepts" />
    </div>
  );
};

export default ConceptListScreen;
