//찜 순으로 소팅하기.
export const SortByHearts = studios => {
  const copiedStudios = [...studios];
  copiedStudios.sort(function (a, b) {
    return a.heartCount > b.heartCount
      ? -1
      : a.heartCount < b.heartCount
      ? 1
      : 0;
  });
  return copiedStudios;
};

//지역별로 소팅하기.
export const SortByLocation = (studios, location) => {
  return studios.filter(studio => {
    if (!studio.branches.length) return false;
    return studio.branches.some(branch => branch.address.startsWith(location));
  });
};

//이름순으로 소팅하기.
export const SortByName = studios => {
  const copiedStudios = [...studios];
  copiedStudios.sort(function (a, b) {
    return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
  });
  return copiedStudios;
};

//기갹순으로 소팅하기.
export const SortByPrice = studios => {
  const copiedStudios = [...studios];
  copiedStudios.sort(function (a, b) {
    return a.lowestPrice < b.lowestPrice
      ? -1
      : a.lowestPrice > b.lowestPrice
      ? 1
      : 0;
  });
  return copiedStudios;
};

//평점순으로 소팅하기.
export const SortByRating = studios => {
  const copiedStudios = [...studios];
  copiedStudios.sort(function (a, b) {
    const a_rating = a.reviewCount === 0 ? 0 : a.totalRating / a.reviewCount;
    const b_rating = b.reviewCount === 0 ? 0 : b.totalRating / b.reviewCount;
    // 평점 우선, 리뷰 갯수도 정렬
    return b_rating - a_rating || b.reviewCount - a.reviewCount;
  });
  return copiedStudios;
};

const isPremiumStudio = studio => studio.tier > 0;

//노멀 스튜디오만 소팅하는 함수.
export const SortNormal = studios => {
  return studios.filter(studio => !isPremiumStudio(studio));
};

//프리미엄 스튜디오만 소팅하는 함수.
export const SortPremium = studios => {
  return studios.filter(studio => isPremiumStudio(studio));
};

//프리미엄 스튜디오중 현재 스튜디오 빼고 소팅하는 함수.
export const SortSeeMore = (studios, currentStudioName) => {
  const premiumStudioList = studios.filter(studio => isPremiumStudio(studio));
  const filteredList = studios.filter(
    studio => studio.name !== currentStudioName
  );
  return filteredList;
};
