const SortByLocation = (studios, location) => {
  var newStudios = [];

  for (var num in studios) {
    var studioLocation = studios[num].location;
    if (studioLocation.startsWith(location)) newStudios.push(studios[num]);
  }
  return newStudios;
};

export default SortByLocation;
