import {
  SortByHearts,
  SortByLocation,
  SortByName,
  SortByPrice,
  SortByRating,
} from './SortingFunctions';
import { MakingStudioList } from './MakingStudioList';

const SortingStudioFunction = (sortBy, locationBy, searchTerm, allStudios) => {
  var sortedStudio = [];
  var returnStudio = [];
  if (searchTerm === '') {
    if (locationBy.name === 'default') {
      sortedStudio = allStudios;
    } else {
      sortedStudio = SortByLocation(allStudios, locationBy.name);
    }

    if (sortBy.name === 'default') {
      returnStudio = MakingStudioList(sortedStudio);
    } else if (sortBy.name === 'byName') {
      returnStudio = SortByName(sortedStudio);
    } else if (sortBy.name === 'byPrice') {
      returnStudio = SortByPrice(sortedStudio);
    } else if (sortBy.name === 'byHearts') {
      returnStudio = SortByHearts(sortedStudio);
    } else if (sortBy.name === 'byRating') {
      returnStudio = SortByRating(sortedStudio);
    }
  } else {
    for (var num in allStudios) {
      if (allStudios[num].title.includes(searchTerm)) {
        returnStudio.push(allStudios[num]);
      }
    }
    if (locationBy.name === 'default') {
      sortedStudio = returnStudio;
    } else {
      sortedStudio = SortByLocation(returnStudio, locationBy.name);
    }

    if (sortBy.name === 'default') {
      returnStudio = MakingStudioList(sortedStudio);
    } else if (sortBy.name === 'byName') {
      returnStudio = SortByName(sortedStudio);
    } else if (sortBy.name === 'byPrice') {
      returnStudio = SortByPrice(sortedStudio);
    } else if (sortBy.name === 'byHearts') {
      returnStudio = SortByHearts(sortedStudio);
    } else if (sortBy.name === 'byRating') {
      returnStudio = SortByRating(sortedStudio);
    }
  }
  return returnStudio;
};

export default SortingStudioFunction;
