import React, { useState, useEffect } from 'react';
import './Portfolio.css';
import InfiniteScroll from 'react-infinite-scroll-component';
import ConceptListCard from '../conceptListScreen/ConceptListCard';
import ConceptModal from '../conceptListScreen/ConceptModal';
import LoadingIcon from '../conceptListScreen/LoadingIcon';
import { useQuery } from '@apollo/client';
import { STUDIO_PHOTOS_QUERY } from '../../../gql/queries/StudioPhotosQuery';

const Portfolio = ({ studioSlug, studioName }) => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPhotoNum, setSelectedPhotoNum] = useState(0);

  const { data, loading, fetchMore } = useQuery(STUDIO_PHOTOS_QUERY, {
    variables: { page: 1, studioSlug },
    onCompleted: data => {
      if (!data.studioPhotos.ok || data.studioPhotos.totalPages <= 1) {
        setHasMore(false);
      }
    },
    onError: () => setHasMore(false),
  });

  const fetchMoreData = () => {
    if (!data || !hasMore) {
      return;
    }

    if (page >= data.studioPhotos.totalPages) {
      setHasMore(false);
      return;
    }

    fetchMore({
      variables: { page: page + 1 },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult?.studioPhotos.photos) return prev;
        return Object.assign({}, prev, {
          ...prev,
          studioPhotos: {
            ...prev.studioPhotos,
            photos: [
              ...prev.studioPhotos.photos,
              ...fetchMoreResult.studioPhotos.photos,
            ],
          },
        });
      },
    });

    setPage(page + 1);
  };

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : 'auto';
  }, [isModalOpen]);

  return (
    <div className="portfolio">
      <InfiniteScroll
        dataLength={
          data === undefined
            ? 0
            : data.studioPhotos.photos === null
            ? 0
            : data.studioPhotos.photos.length
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
          {(data?.studioPhotos.photos || []).map((concept, idx) => (
            <ConceptListCard
              key={`concept-list-${concept.id}-${idx}`}
              conceptNum={idx}
              src={concept.thumbnailUrl}
              setThisPhoto={() => setSelectedPhotoNum(idx)}
              openModal={() => setIsModalOpen(true)}
            />
          ))}
          {!data?.studioPhotos.photos
            ? null
            : data.studioPhotos.photos.length % 3 === 0
            ? null
            : [
                ...Array(3 - (data.studioPhotos.photos.length % 3)),
              ].map((_, idx) => (
                <div
                  key={`concept-blank-${idx}`}
                  className="concepListCardContainer"
                />
              ))}
        </div>
      </InfiniteScroll>
      {isModalOpen && selectedPhotoNum < data.studioPhotos.photos.length ? (
        <ConceptModal
          close={() => setIsModalOpen(false)}
          open={() => setIsModalOpen(true)}
          id={data.studioPhotos.photos[selectedPhotoNum].id}
          setThisPhoto={setSelectedPhotoNum}
          selectedPhotoNum={selectedPhotoNum}
          isFinalPhoto={selectedPhotoNum >= data.studioPhotos.photos.length - 1}
          whileFetching={loading}
          studioPhoto={data.studioPhotos.photos[selectedPhotoNum]}
          studioSlug={studioSlug}
          studioName={studioName}
        />
      ) : null}
    </div>
  );
};
export default Portfolio;
