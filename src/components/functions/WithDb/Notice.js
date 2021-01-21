import DbNotices from '../../../virtualDB/items/DbNotices';

//홈페이지 하단 공지사항에 띄울 최근 공지 3개 불러오기.
export const GetHomePageNotices = () => {
  return DbNotices.slice(0, 3);
};
//전체 공지사항 array로 다 불러오기.
export const GetNotices = () => {
  return DbNotices;
};
//해당하는 번호의 공지사항 불러오기.
export const GetFullNotice = (num) => {
  for (var i = 0; i < DbNotices.length; i++) {
    if (DbNotices[i].noticeNumber === Number(num)) {
      return DbNotices[i];
    }
  }
};
