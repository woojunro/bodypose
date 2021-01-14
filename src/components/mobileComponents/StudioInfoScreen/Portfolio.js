import React, { useState } from 'react';
import './Portfolio.css';
import InfiniteScroll from 'react-infinite-scroll-component';

import ConceptListCard from '../conceptListScreen/ConceptListCard';

import ConceptModal from '../conceptListScreen/ConceptModal';
import {
  GetStudioPhoto,
  GetMorePhoto,
} from '../../functions/WithDb/StudioInfo';
import LoadingIcon from '../conceptListScreen/LoadingIcon';
var conceptNum = -24;

const Portfolio = ({ studioName }) => {
  //fetching 중인가?
  const [whileFetching, setWhileFetching] = useState(false);

  const [i, setI] = useState(0);
  //초기에 Db에서 사진 불러와야하는 부분.
  const [conceptArray, setConceptArray] = useState(GetStudioPhoto(studioName));

  const [isMore, setIsMore] = useState(true);
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
      const moreData = GetMorePhoto(studioName, i, currentData);

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
  return (
    <div className="portfolio">
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
export default Portfolio;
