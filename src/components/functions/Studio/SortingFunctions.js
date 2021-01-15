//찜 순으로 소팅하기.
export const SortByHearts = (studios) => {
  studios.sort(function (a, b) {
    return a.hearts > b.hearts ? -1 : a.hearts < b.hearts ? 1 : 0;
  });
  return studios;
};
//지역별로 소팅하기.
export const SortByLocation = (studios, location) => {
  var newStudios = [];

  for (var num in studios) {
    let studioLocation = studios[num].location;
    if (studioLocation.startsWith(location)) newStudios.push(studios[num]);
  }

  return newStudios;
};

//이름순으로 소팅하기.
export const SortByName = (studios) => {
  studios.sort(function (a, b) {
    return a.title < b.title ? -1 : a.title > b.title ? 1 : 0;
  });
  return studios;
};

//기갹순으로 소팅하기.
export const SortByPrice = (studios) => {
  studios.sort(function (a, b) {
    return a.price < b.price ? -1 : a.price > b.price ? 1 : 0;
  });
  return studios;
};

//평점순으로 소팅하기.
export const SortByRating = (studios) => {
  studios.sort(function (a, b) {
    return a.rating > b.rating ? -1 : a.rating < b.rating ? 1 : 0;
  });
  return studios;
};

//노멀 스튜디오만 소팅하는 함수.
export const SortNormal = (studios) => {
  var normalStudioList = [];
  studios.map((studio) => {
    if (studio.premium === '0') normalStudioList.push(studio);
    return null;
  });
  return normalStudioList;
};

//프리미엄 스튜디오만 소팅하는 함수.
export const SortPremium = (studios) => {
  var premiumStudioList = [];
  studios.map((studio) => {
    if (studio.premium === '1') premiumStudioList.push(studio);
    return null;
  });
  return premiumStudioList;
};

//프리미엄 스튜디오중 현재 스튜디오 빼고 소팅하는 함수.
export const SortSeeMore = (studios, currentStudioName) => {
  var premiumStudioList = [];
  studios.map((studio) => {
    if (
      studio.premium === '1' &&
      studio.studioName !== currentStudioName.currentStudioName
    )
      premiumStudioList.push(studio);
    return null;
  });
  return premiumStudioList;
};
