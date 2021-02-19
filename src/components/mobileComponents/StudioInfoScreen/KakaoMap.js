import React from 'react';

/*global kakao*/

class KakaoMap extends React.Component {
  componentDidMount() {
    const { currentLocation } = this.props;
    const { kakao } = window;

    kakao.maps.load(() => {
      let container = document.getElementById('map');
      //위도,경도, 줌 정도
      let options = {
        center: new kakao.maps.LatLng(0, 0),
        level: 5,
      };

      const map = new window.kakao.maps.Map(container, options);
      var bounds = new kakao.maps.LatLngBounds();

      // 주소-좌표 변환 객체를 생성합니다
      var geocoder = new kakao.maps.services.Geocoder();

      currentLocation.forEach(adr => {
        // 주소로 좌표를 검색합니다
        geocoder.addressSearch(adr.address, function (result, status) {
          // 정상적으로 검색이 완료됐으면
          if (status === kakao.maps.services.Status.OK) {
            var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

            // 결과값으로 받은 위치를 마커로 표시합니다
            var marker = new kakao.maps.Marker({
              map: map,
              position: coords,
            });

            // 인포윈도우로 장소에 대한 설명을 표시합니다
            if (adr.title) {
              var infowindow = new kakao.maps.InfoWindow({
                content: `<div style="width:150px;text-align:center;padding:2px 0;">${adr.title}</div>`,
              });
              infowindow.open(map, marker);
            }
            bounds.extend(coords);
            map.setBounds(bounds);
          }
        });
      });
    });
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
