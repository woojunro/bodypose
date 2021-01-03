const SortByName = (studios) => {
  studios.sort(function (a, b) {
    return a.title < b.title ? -1 : a.title > b.title ? 1 : 0;
  });
  return studios;
};

export default SortByName;
