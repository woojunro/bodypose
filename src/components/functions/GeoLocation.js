import React from 'react';

export const getAdressByCoords = (setAddr, setDeclineGPS, setIsLoadingGPS) => {
  const { kakao } = window;
  let geocoder = new kakao.maps.services.Geocoder();
  let positionOptions = {
    frequency: 10000,
    enableHighAccuracy: false,
    timeout: Infinity,
    maximumAge: 0,
  };

  if (navigator.geolocation) {
    // GeoLocation을 이용해서 접속 위치를 얻어옵니다
    navigator.geolocation.getCurrentPosition(
      position => {
        let lat = position.coords.latitude; // 위도
        let lon = position.coords.longitude; // 경도
        let coord = new kakao.maps.LatLng(lat, lon);

        searchAddrFromCoords(coord, function (result, status) {
          if (status === kakao.maps.services.Status.OK) {
            setAddr(result[0].region_1depth_name);
            setDeclineGPS(false);
          }
        });
      },
      err => {
        console.log(err);
        setDeclineGPS(true);
      },
      positionOptions
    );
  } else {
    // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
  }

  const searchAddrFromCoords = (coords, callback) => {
    geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);
  };
};
