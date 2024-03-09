import React from 'react';
import './PhotoInfo.css';
import { gql, useQuery, useMutation } from '@apollo/client';
import gender from '../../constants/gender';
import { ERROR_MESSAGE } from '../../constants/errorMessages';
import { CONFIRM_PHOTO_DELETION } from '../../constants/messages';

const GET_STUDIO_PHOTO = gql`
  query GetStudioPhoto($id: Int!) {
    studioPhoto(input: { id: $id }) {
      ok
      error
      photo {
        id
        originalUrl
        gender
        backgroundConcepts {
          name
        }
        costumeConcepts {
          name
        }
        objectConcepts {
          name
        }
      }
    }
  }
`;

const DELETE_STUDIO_PHOTO = gql`
  mutation DeleteStudioPhoto($id: Int!) {
    deleteStudioPhoto(input: { id: $id }) {
      ok
    }
  }
`;

const PhotoInfo = ({
  selectedPhotoId = 0,
  setSelectedPhotoId = () => {},
  refetch = () => {},
}) => {
  const isPhotoSelected = Boolean(selectedPhotoId);

  const { data, loading } = useQuery(GET_STUDIO_PHOTO, {
    skip: !isPhotoSelected,
    variables: { id: selectedPhotoId },
  });

  const [deleteStudioPhoto, { loading: deleteLoading }] = useMutation(
    DELETE_STUDIO_PHOTO,
    {
      onCompleted: data => {
        if (data.deleteStudioPhoto.ok) {
          setSelectedPhotoId(0);
          refetch();
        } else {
          alert(ERROR_MESSAGE);
        }
      },
      onError: () => alert(ERROR_MESSAGE),
    }
  );

  const onDelete = () => {
    const ok = window.confirm(CONFIRM_PHOTO_DELETION);
    if (!ok) return;

    deleteStudioPhoto({
      variables: {
        id: selectedPhotoId,
      },
    });
  };

  const photo = data?.studioPhoto?.photo;

  return isPhotoSelected ? (
    loading || deleteLoading ? (
      <div className="photoInfo">
        <h3>Loading...</h3>
      </div>
    ) : (
      <div className="photoInfo">
        미리보기
        <div className="photoInfoThumb">
          <img src={photo?.originalUrl} alt="미리보기" />
        </div>
        <div className="photoInfoLine">
          <div className="photoInfoTitle">성별</div>
          <div className="photoInfoData">{gender[photo?.gender]}</div>
        </div>
        <div className="photoInfoLine">
          <div className="photoInfoTitle">배경</div>
          <div className="photoInfoData">
            {(photo?.backgroundConcepts || []).map(concept => (
              <span
                className="optionInfo"
                key={`${selectedPhotoId}-bg-${concept.name}`}
              >
                {concept.name}
              </span>
            ))}
          </div>
        </div>
        <div className="photoInfoLine">
          <div className="photoInfoTitle">의상</div>
          <div className="photoInfoData">
            {(photo?.costumeConcepts || []).map(concept => (
              <span
                className="optionInfo"
                key={`${selectedPhotoId}-cos-${concept.name}`}
              >
                {concept.name}
              </span>
            ))}
          </div>
        </div>
        <div className="photoInfoLine">
          <div className="photoInfoTitle">도구</div>
          <div className="photoInfoData">
            {(photo?.objectConcepts || []).map(concept => (
              <span
                className="optionInfo"
                key={`${selectedPhotoId}-obj-${concept.name}`}
              >
                {concept.name}
              </span>
            ))}
          </div>
        </div>
        <div className="deleteButton">
          <div className="deleteTitle" onClick={onDelete}>
            사진 삭제
          </div>
        </div>
      </div>
    )
  ) : (
    <div className="photoInfo">
      사진을 클릭하시면 세부정보를 볼 수 있습니다.
    </div>
  );
};

export default PhotoInfo;
