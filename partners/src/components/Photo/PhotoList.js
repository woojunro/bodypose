import React, { useState } from 'react';
import './PhotoList.css';
import PhotoInfo from './PhotoInfo';
import { IoIosArrowBack } from 'react-icons/io';
import { IoIosArrowForward } from 'react-icons/io';
import PhotoGrid from './PhotoGrid';
import { gql, useQuery, useReactiveVar } from '@apollo/client';
import { MyStudioSlugVar } from '../../graphql/variables';

const GET_STUDIO_PHOTOS = gql`
  query GetStudioPhotos($page: Int!, $studioSlug: String!) {
    studioPhotos(input: { page: $page, studioSlug: $studioSlug, take: 12 }) {
      totalPages
      photos {
        id
        thumbnailUrl
      }
    }
  }
`;

const PhotoList = () => {
  const studioSlug = useReactiveVar(MyStudioSlugVar);

  const [page, setPage] = useState(1);
  const [selectedPhotoId, setSelectedPhotoId] = useState(0);

  const { data, loading, refetch } = useQuery(GET_STUDIO_PHOTOS, {
    variables: { page, studioSlug },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    onCompleted: data => {
      if (data.studioPhotos.totalPages < page) {
        setPage(data.studioPhotos.totalPages);
      }
    },
  });

  // 다음 사진 12장을 불러오는 함수.
  const getNextPhotos = () => setPage(page + 1);

  // 이전 사진 12장을 불러오는 함수.
  const getPrevPhotos = () => setPage(page - 1);

  //클릭된 사진을 선택하는 함수
  const selectPhoto = id => setSelectedPhotoId(id);

  return (
    <div className="fullSizeBox">
      <div className="boxTitle">사진 목록</div>
      <div className="photoListContainer">
        <div className="photoGridContainer">
          <PhotoGrid
            photos={data?.studioPhotos?.photos}
            loading={loading}
            selectPhoto={selectPhoto}
          />
          {!loading && (
            <div className="photoPage">
              {page === 1 ? (
                <div className="emptyBox" />
              ) : (
                <IoIosArrowBack
                  className="photoListMovePageButton"
                  onClick={getPrevPhotos}
                />
              )}
              {page}/{data?.studioPhotos?.totalPages}
              {page === data?.studioPhotos?.totalPages ? (
                <div className="emptyBox" />
              ) : (
                <IoIosArrowForward
                  className="photoListMovePageButton"
                  onClick={getNextPhotos}
                />
              )}
            </div>
          )}
        </div>
        <PhotoInfo
          selectedPhotoId={selectedPhotoId}
          setSelectedPhotoId={selectPhoto}
          refetch={refetch}
        />
      </div>
    </div>
  );
};

export default PhotoList;
