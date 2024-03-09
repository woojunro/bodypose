import React from 'react';
import { gql, useQuery } from '@apollo/client';
import './PhotoCard.css';

const GET_STUDIO_PHOTO = gql`
  query GetStudioPhoto($id: Int!) {
    studioPhoto(input: { id: $id }) {
      photo {
        id
        originalUrl
      }
    }
  }
`;

const PhotoCard = ({ title, photoId, description, click }) => {
  const { data, loading } = useQuery(GET_STUDIO_PHOTO, {
    variables: { id: Number(photoId) },
  });

  return (
    <div className="photoStatBox">
      <div className="photoStatBoxTitlecontainer">
        {title ? <div className="photoStatBoxTitle">{title}</div> : null}
        {description ? (
          <div className="photoStatBoxDescription">{description}</div>
        ) : null}
      </div>
      <div className="cardContainer">
        <div className="statCard">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <img alt="사진" src={data?.studioPhoto?.photo?.originalUrl} />
          )}
        </div>
      </div>
      <div className="photoClicks">
        {click ? (
          <>
            클릭 <div className="clickNumber">{click} </div> 회
          </>
        ) : null}
      </div>
    </div>
  );
};

export default PhotoCard;
