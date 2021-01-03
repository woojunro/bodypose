const SortByRating = (studios) => {
  studios.sort(function (a, b) {
    return a.rating > b.rating ? -1 : a.rating < b.rating ? 1 : 0;
  });
  return studios;
};

export default SortByRating;
