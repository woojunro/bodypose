export const ConceptCountTypes = {
  SINGLE_VALUE: '갯수',
  MULTI_VALUES: '범위',
  INFINITE: '무제한',
  NO_EXPOSURE: '표시안함',
};

export const getConceptCountType = (conceptCount, maxConceptCount) => {
  if (conceptCount === 0) return ConceptCountTypes.INFINITE;
  else if (conceptCount === null) return ConceptCountTypes.NO_EXPOSURE;
  else if (conceptCount === maxConceptCount)
    return ConceptCountTypes.SINGLE_VALUE;
  else return ConceptCountTypes.MULTI_VALUES;
};

export const getConceptCounts = (type, conceptCount, maxConceptCount) => {
  switch (type) {
    case ConceptCountTypes.SINGLE_VALUE:
      return {
        conceptCount: Number(conceptCount),
        maxConceptCount: Number(conceptCount),
      };
    case ConceptCountTypes.MULTI_VALUES:
      return {
        conceptCount: Number(conceptCount),
        maxConceptCount: maxConceptCount ? Number(maxConceptCount) : null,
      };
    case ConceptCountTypes.NO_EXPOSURE:
      return {
        conceptCount: null,
        maxConceptCount: null,
      };
    case ConceptCountTypes.INFINITE:
      return {
        conceptCount: 0,
        maxConceptCount: null,
      };
    default:
      throw new Error('Invalid type');
  }
};
