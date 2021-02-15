import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import ConceptListCard from '../../../components/mobileComponents/conceptListScreen/ConceptListCard';
import ConceptModal from '../../../components/mobileComponents/conceptListScreen/ConceptModal';
import './HeartConcepts.css';
import LoadingIcon from '../../../components/mobileComponents/conceptListScreen/LoadingIcon';
import { useQuery } from '@apollo/client';
import { MY_HEART_STUDIO_PHOTOS_QUERY } from '../../../gql/queries/MyHeartQuery';

const HeartConcepts = () => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPhotoNum, setSelectedPhotoNum] = useState(0);

  const { data, loading, fetchMore } = useQuery(MY_HEART_STUDIO_PHOTOS_QUERY, {
    fetchPolicy: 'network-only',
    variables: { page: 1 },
    onCompleted: data => {
      if (
        !data.myHeartStudioPhotos.ok ||
        data.myHeartStudioPhotos.totalPages <= 1
      ) {
        setHasMore(false);
      }
    },
    onError: () => setHasMore(false),
  });

  const fetchMoreData = () => {
    if (!data || !hasMore) {
      return;
    }

    if (page >= data.allStudioPhotos.totalPages) {
      setHasMore(false);
      return;
    }

    fetchMore({
      variables: { page: page + 1 },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult?.myHeartStudioPhotos.photos) return prev;
        return Object.assign({}, prev, {
          ...prev,
          allStudioPhotos: {
            ...prev.myHeartStudioPhotos,
            photos: [
              ...prev.myHeartStudioPhotos.photos,
              ...fetchMoreResult.myHeartStudioPhotos.photos,
            ],
          },
        });
      },
    });

    setPage(page + 1);
  };

  useEffect(() => {
    if (
      !data ||
      !data.myHeartStudioPhotos ||
      !data.myHeartStudioPhotos.photos
    ) {
      return;
    }

    if (selectedPhotoNum >= data.myHeartStudioPhotos.photos.length - 3) {
      fetchMoreData();
    }
  }, [selectedPhotoNum]);

  return (
    <div className="conceptListScreen">
      <InfiniteScroll
        dataLength={
          data === undefined
            ? 0
            : data.myHeartStudioPhotos.photos === null
            ? 0
            : data.myHeartStudioPhotos.photos.length
        }
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
          {(data?.myHeartStudioPhotos.photos || []).map((concept, idx) => (
            <ConceptListCard
              key={`concept-list-${concept.id}-${idx}`}
              conceptNum={idx}
              src={concept.thumbnailUrl}
              setThisPhoto={() => setSelectedPhotoNum(idx)}
              openModal={() => setIsModalOpen(true)}
            />
          ))}
          {!data?.myHeartStudioPhotos.photos
            ? null
            : data.myHeartStudioPhotos.photos.length % 3 === 0
            ? null
            : [
                ...Array(3 - (data.myHeartStudioPhotos.photos.length % 3)),
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
          close={() => setIsModalOpen(false)}
          open={() => setIsModalOpen(true)}
          id={data.myHeartStudioPhotos.photos[selectedPhotoNum].id}
          setThisPhoto={setSelectedPhotoNum}
          selectedPhotoNum={selectedPhotoNum}
          isFinalPhoto={
            selectedPhotoNum >= data.myHeartStudioPhotos.photos.length - 1
          }
          whileFetching={loading}
          isForHeart={true}
        />
      ) : null}
    </div>
  );
};

export default HeartConcepts;
