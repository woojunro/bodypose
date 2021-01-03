import SortByHearts from '../../components/functions/SortByHearts';
import SortByLocation from '../../components/functions/sortByLocation';
import SortByName from '../../components/functions/SortByName';
import SortByPrice from '../../components/functions/SortByPrice';
import SortByRating from '../../components/functions/SortByRating';
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
