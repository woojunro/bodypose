const SortByHearts = (studios) => {
  studios.sort(function (a, b) {
    return a.hearts > b.hearts ? -1 : a.hearts < b.hearts ? 1 : 0;
  });
  return studios;
};

export default SortByHearts;
