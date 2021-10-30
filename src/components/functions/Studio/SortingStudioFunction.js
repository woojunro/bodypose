import {
  sortStudiosByHeartCount,
  filterStudiosByLocation,
  sortStudiosByName,
  sortStudiosByPrice,
  sortStudiosByRating,
} from './SortingFunctions';

const SortingStudioFunction = (
  studioList = [],
  sortBy,
  locationBy,
  searchKeyword = ''
) => {
  let sortedStudio = [...studioList];

  if (locationBy.name !== 'default') {
    sortedStudio = filterStudiosByLocation(studioList, locationBy.name);
  }

  if (sortBy.name === 'default') {
    // continue (already shuffled)
  } else if (sortBy.name === 'byName') {
    sortedStudio = sortStudiosByName(sortedStudio);
  } else if (sortBy.name === 'byPrice') {
    sortedStudio = sortStudiosByPrice(sortedStudio);
  } else if (sortBy.name === 'byHearts') {
    sortedStudio = sortStudiosByHeartCount(sortedStudio);
  } else if (sortBy.name === 'byRating') {
    sortedStudio = sortStudiosByRating(sortedStudio);
  }

  if (searchKeyword.length > 0) {
    sortedStudio = sortedStudio.filter(studio =>
      studio.name.includes(searchKeyword.toLowerCase())
    );
  }

  return sortedStudio;
};

export default SortingStudioFunction;
