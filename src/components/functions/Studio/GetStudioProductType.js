import {
  PeopleCountTypes,
  ConceptCountTypes,
  PriceTypes,
} from '../../../constants/studioProductTypes';

export const getPeopleCountType = (peopleCount, maxPeopleCount) => {
  return peopleCount === maxPeopleCount
    ? PeopleCountTypes.SINGLE_VALUE
    : PeopleCountTypes.MULTI_VALUES;
};

export const getConceptCountType = (conceptCount, maxConceptCount) => {
  if (conceptCount === 0) return ConceptCountTypes.INFINITE;
  else if (conceptCount === null) return ConceptCountTypes.NO_EXPOSURE;
  else if (conceptCount === maxConceptCount)
    return ConceptCountTypes.SINGLE_VALUE;
  else return ConceptCountTypes.MULTI_VALUES;
};

export const getPriceType = price => {
  if (price === null) return PriceTypes.NO_EXPOSURE;
  else if (price === -1) return PriceTypes.CONTACT;
  else return PriceTypes.VALUE;
};
