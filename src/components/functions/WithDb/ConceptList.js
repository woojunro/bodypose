import Shuffle from '../Shuffle';
import { DbPhotos } from '../../../virtualDB/items/DbPhotos';

const GetMoreData = (i, currentData) => {
  return currentData.concat(Shuffle(DbPhotos.slice(i + 24, i + 48)));
};

export default GetMoreData;

export const GetPhotoInfo = (
  concept,
  setGettingPhotoInfo,
  setIsHearted,
  setPhoto
) => {
  setTimeout(() => {
    if (concept.ishearted) {
      setIsHearted(true);
    } else {
      setIsHearted(false);
    }
    setPhoto(concept.pic);

    setGettingPhotoInfo(false);
  }, 2000);
};

export const GetConceptPhotos = (i) => {
  return DbPhotos.slice(i, i + 24);
};
