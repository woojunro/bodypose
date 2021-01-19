import DbUser from '../../../virtualDB/items/DbUser';

//찜한 스튜디오 목록 불러오기.
export const GetHeartedStudio = () => {
  let userInfo = DbUser;
  return userInfo[0].likeStudio;
};

//찜한 컨셉 사진 초기 24개 불러오기.
export const GetHeartedConceptPhotos = (i) => {
  return DbUser[0].likePhotos.slice(i, i + 24);
};

//찜한 컨셉 사진 추가적으로 24개 불러오기.
export const GetMoreHeartedData = (i, currentData) => {
  return currentData.concat(DbUser[0].likePhotos.slice(i + 24, i + 48));
};
