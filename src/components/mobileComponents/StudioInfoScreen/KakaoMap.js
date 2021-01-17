import React from 'react';

/*global kakao*/

class KakaoMap extends React.Component {
  componentDidMount() {
    const { currentStudio } = this.props;

    const lat = currentStudio.lat;
    const long = currentStudio.long;
    const script = document.createElement('script');
    script.async = true;
    script.src =
      'https://dapi.kakao.com/v2/maps/sdk.js?appkey=5c06d664dacc5a982b64b8e10bc8f9bb&libraries=LIBRARY';
    document.head.appendChild(script);

    script.onload = () => {
      kakao.maps.load(() => {
        let container = document.getElementById('map');
        //위도,경도, 줌 정도
        let options = {
          center: new kakao.maps.LatLng(lat, long),
          level: 5,
        };

        const map = new window.kakao.maps.Map(container, options);
        // 주소-좌표 변환 객체를 생성합니다
        var geocoder = new kakao.maps.services.Geocoder();

        // 주소로 좌표를 검색합니다
        geocoder.addressSearch(
          currentStudio.location,
          function (result, status) {
            // 정상적으로 검색이 완료됐으면
            if (status === kakao.maps.services.Status.OK) {
              var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

              // 결과값으로 받은 위치를 마커로 표시합니다
              new kakao.maps.Marker({
                map: map,
                position: coords,
              });

              // 인포윈도우로 장소에 대한 설명을 표시합니다
              // var infowindow = new kakao.maps.InfoWindow({
              //   content: `<div style="width:150px;text-align:center;padding:2px 0;">${currentStudio.title}</div>`,
              // });
              // infowindow.open(map, marker);
              // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
              map.setCenter(coords);
            }
          }
        );
      });
    };
  }
  render() {
    return (
      <>
        <div
          id="map"
          style={{ width: '100%', height: '220px', marginTop: '10px' }}
        ></div>
      </>
    );
  }
}

export default KakaoMap;
