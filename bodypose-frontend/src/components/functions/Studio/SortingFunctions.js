// 찜 순으로 소팅하기 (내림차순)
export const sortStudiosByHeartCount = studios => {
  const copiedStudios = [...studios];
  copiedStudios.sort((a, b) => b.heartCount - a.heartCount);
  return copiedStudios;
};

// 지역 필터링
export const filterStudiosByLocation = (studios, location) => {
  return studios.filter(studio => {
    if (!studio.branches.length) return false;
    return studio.branches.some(branch => branch.address.startsWith(location));
  });
};

// 이름 순으로 소팅하기 (오름차순)
export const sortStudiosByName = studios => {
  const copiedStudios = [...studios];
  copiedStudios.sort(function (a, b) {
    return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
  });
  return copiedStudios;
};

// 가격 순으로 소팅하기 (오름차순)
export const sortStudiosByPrice = studios => {
  const copiedStudios = [...studios];
  copiedStudios.sort((a, b) => a.lowestPrice - b.lowestPrice);
  return copiedStudios;
};

// 평점 순으로 소팅하기 (내림차순)
export const sortStudiosByRating = studios => {
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

// 노멀 스튜디오만 추출하는 함수
export const getNormalStudios = studios => {
  return studios.filter(studio => !isPremiumStudio(studio));
};

// 프리미엄 스튜디오만 추출하는 함수
export const getPremiumStudios = studios => {
  return studios.filter(studio => isPremiumStudio(studio));
};

/*
// 프리미엄 스튜디오 중 현재 스튜디오 빼고 소팅하는 함수
export const SortSeeMore = (studios, currentStudioName) => {
  const premiumStudioList = studios.filter(studio => isPremiumStudio(studio));
  const filteredList = studios.filter(
    studio => studio.name !== currentStudioName
  );
  return filteredList;
};
*/
