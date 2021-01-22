import Shuffle from '../Shuffle';
import { DbPhotos } from '../../../virtualDB/items/DbPhotos';

//더 필요한 사진 불러오기.
const GetMoreData = (i, currentData) => {
  return currentData.concat(Shuffle(DbPhotos.slice(i + 24, i + 48)));
};

export default GetMoreData;

//컨셉 모달에 띄울 사진.
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
  }, 200);
};

//초기 사진 불러오기.
export const GetConceptPhotos = (i) => {
  return DbPhotos.slice(i, i + 24);
};
