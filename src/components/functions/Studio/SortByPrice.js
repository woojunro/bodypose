const SortByPrice = (studios) => {
  studios.sort(function (a, b) {
    return a.price < b.price ? -1 : a.price > b.price ? 1 : 0;
  });
  return studios;
};

export default SortByPrice;
