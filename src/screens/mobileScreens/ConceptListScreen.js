import React, { useState, useEffect } from 'react';
import BottomNavigation from '../../components/mobileComponents/BottomNavigation';
import TopNavigator from '../../components/mobileComponents/conceptListScreen/TopNavigator';
import Header from '../../components/mobileComponents/HeaderM';
import InfiniteScroll from 'react-infinite-scroll-component';
import { DbPhotos } from '../../virtualDB/items/DbPhotos';
import shuffle from '../../components/functions/Shuffle';
import ConceptListCard from '../../components/mobileComponents/conceptListScreen/ConceptListCard';
import './ConceptListScreen.css';
import LoadingIcon from '../../components/mobileComponents/conceptListScreen/LoadingIcon';

const genderOptions = ['전체', '남성', '여성', '커플'];
var i = 0;

const ConceptListScreen = () => {
  //초기에 불러올 사진 24개.
  const [gender, setGender] = useState(genderOptions[0]);
  const [conceptArray, setConceptArray] = useState(
    shuffle(DbPhotos.slice(i, i + 24))
  );

  const fetchMoreData = () => {
    i = i + 24;

    // 데이터 더 불러오는 함수
    // 1.5초 안에 24개 더 불러오기
    setTimeout(() => {
      const currentData = conceptArray;
      const moreData = currentData.concat(shuffle(DbPhotos.slice(i, i + 24)));
      setConceptArray(moreData);
    }, 1500);
  };
  return (
    <div className="conceptListScreen">
      <Header pageName="concepts" />
      <TopNavigator
        options={genderOptions}
        selectedGender={gender}
        setGender={setGender}
      />
      <InfiniteScroll
        dataLength={conceptArray.length}
        next={fetchMoreData}
        hasMore={true}
        loader={<LoadingIcon />}
        endMessage={'모든 사진을 불러왔습니다.'}
      >
        <div className="totalConcept">
          {conceptArray.map((concept) => (
            <ConceptListCard
              studio={concept.studio}
              photoName={concept.photoName}
              thumb={concept.thumb}
              horizontal={concept.horizontal}
              pic={concept.pic}
            />
          ))}
        </div>
      </InfiniteScroll>

      <BottomNavigation pageName="concepts" />
    </div>
  );
};

export default ConceptListScreen;
