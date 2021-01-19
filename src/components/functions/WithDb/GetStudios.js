import '../../../virtualDB/items/DbStudios';
import { DbStudios } from '../../../virtualDB/items/DbStudios';

//모든 스튜디오 목록 불러오기.
export const GetStudios = () => {
  return DbStudios;
};

//스튜디오의 하트 db 바꿔주기.
export const SetHeartDb = () => {
  return console.log('디비에 바꼈다잇');
};
