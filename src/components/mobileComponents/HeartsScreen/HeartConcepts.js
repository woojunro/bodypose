import React, { useState, useEffect } from 'react';
import TopNavigator from '../../../components/mobileComponents/conceptListScreen/TopNavigator';
import InfiniteScroll from 'react-infinite-scroll-component';
import shuffle from '../../../components/functions/Shuffle';
import ConceptListCard from '../../../components/mobileComponents/conceptListScreen/ConceptListCard';
import ConceptModal from '../../../components/mobileComponents/conceptListScreen/ConceptModal';
import './HeartConcepts.css';
import LoadingIcon from '../../../components/mobileComponents/conceptListScreen/LoadingIcon';
import {
  GetMoreHeartedData,
  GetHeartedConceptPhotos,
} from '../../../components/functions/WithDb/Heart';

const genderOptions = ['전체', '남성', '여성', '커플'];
var conceptNum = -24;

const HeartConcepts = () => {
  //fetching 중인가?
  const [whileFetching, setWhileFetching] = useState(false);

  const [i, setI] = useState(0);

  const [isMore, setIsMore] = useState(true);
  const [gender, setGender] = useState(genderOptions[0]);
  //초기에 Db에서 사진 불러와야하는 부분.
  const [conceptArray, setConceptArray] = useState(GetHeartedConceptPhotos(i));
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
  conceptNum = 0;

  const fetchMoreData = () => {
    setI(i + 24);

    setTimeout(() => {
      const currentData = conceptArray;
      //Db에서 사진 더 불러와야 하는 부분.
      const moreData = GetMoreHeartedData(i, currentData);

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
    setConceptArray(GetHeartedConceptPhotos(0));
  };

  useEffect(() => {
    getDb();
  }, [gender]);

  return (
    <div className="conceptListScreen">
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
    </div>
  );
};

export default HeartConcepts;
