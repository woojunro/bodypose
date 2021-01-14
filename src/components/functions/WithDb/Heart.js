import DbUser from '../../../virtualDB/items/DbUser';

export const GetHeartedStudio = () => {
  let userInfo = DbUser;
  return userInfo[0].likeStudio;
};

export const GetHeartedConceptPhotos = (i) => {
  return DbUser[0].likePhotos.slice(i, i + 24);
};

export const GetMoreHeartedData = (i, currentData) => {
  return currentData.concat(DbUser[0].likePhotos.slice(i + 24, i + 48));
};
