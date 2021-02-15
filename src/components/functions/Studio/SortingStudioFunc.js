import {
  SortByHearts,
  SortByLocation,
  SortByName,
  SortByPrice,
  SortByRating,
} from './SortingFunctions';
import { MakingStudioList } from './MakingStudioList';

const SortingStudioFunction = (sortBy, locationBy, searchTerm, allStudios) => {
  let sortedStudio = [];
  let returnStudio = [];
  if (searchTerm === '') {
    if (locationBy.name === 'default') {
      sortedStudio = [...allStudios];
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
    returnStudio = allStudios.filter(studio =>
      studio.name.includes(searchTerm)
    );

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
