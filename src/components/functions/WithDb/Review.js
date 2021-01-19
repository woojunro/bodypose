import { DbReviews } from '../../../virtualDB/items/DbReviews';

//소팅 방법 별로 초기 리뷰 5개 불러오기.
export const GetReviews = (sortByOption) => {
  if (sortByOption === 'byDate') {
    console.log('byDate');
  } else if (sortByOption === 'byRating') {
    console.log('byRating');
  } else console.log('byReverseRating');

  return DbReviews.slice(0, 5);
};

//리뷰 더보기 누르면 리뷰 5개 더 불러오기.
export const GetMoreReview = () => {
  return DbReviews.slice(10, 15);
};

//리뷰 자세히 보기 화면의 리뷰 번호와 db의 리뷰 번호를 비교해서 리뷰 정보 불러오기.
export const GetFullReview = (reviewNumber) => {
  for (var i = 0; i < 8; i++) {
    if (DbReviews[i].number === reviewNumber) {
      return DbReviews[i];
    }
  }
};
