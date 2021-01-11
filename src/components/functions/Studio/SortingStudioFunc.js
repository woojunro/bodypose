import {
  SortByHearts,
  SortByLocation,
  SortByName,
  SortByPrice,
  SortByRating,
} from './SortingFunctions';
import { MakingStudioList } from './MakingStudioList';

const SortingStudioFunction = ({
  sortBy,
  locationBy,
  setStudios,
  studioList,
}) => {
  if (sortBy.name === 'byName') {
    setStudios(SortByName(studioList));
  } else if (sortBy.name === 'default') {
    setStudios(MakingStudioList(studioList));
  } else if (sortBy.name === 'byPrice') {
    setStudios(SortByPrice(studioList));
  } else if (sortBy.name === 'byHearts') {
    setStudios(SortByHearts(studioList));
  } else if (sortBy.name === 'byRating') {
    setStudios(SortByRating(studioList));
  }
  if (locationBy.name === 'default') {
  } else {
    setStudios(SortByLocation(studioList, locationBy.name));
  }
};

export default SortingStudioFunction;
