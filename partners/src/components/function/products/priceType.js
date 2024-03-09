export const PriceTypes = {
  VALUE: '가격',
  CONTACT: '문의',
  NO_EXPOSURE: '표시안함',
};

export const getPriceType = price => {
  if (price === null) return PriceTypes.NO_EXPOSURE;
  else if (price === -1) return PriceTypes.CONTACT;
  else return PriceTypes.VALUE;
};

export const getPrice = (type, price) => {
  switch (type) {
    case PriceTypes.VALUE:
      return Number(price);
    case PriceTypes.CONTACT:
      return -1;
    case PriceTypes.NO_EXPOSURE:
      return null;
    default:
      throw new Error('Invalid type');
  }
};
