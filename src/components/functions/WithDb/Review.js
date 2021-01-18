import { DbReviews } from '../../../virtualDB/items/DbReviews';

export const GetReviews = (sortByOption) => {
  if (sortByOption === 'byDate') {
    console.log('byDate');
  } else if (sortByOption === 'byRating') {
    console.log('byRating');
  } else console.log('byReverseRating');

  return DbReviews.slice(0, 5);
};

export const GetMoreReview = () => {
  return DbReviews.slice(10, 15);
};

export const GetFullReview = (reviewNumber) => {
  for (var i = 0; i < 8; i++) {
    if (DbReviews[i].number === reviewNumber) {
      return DbReviews[i];
    }
  }
};
