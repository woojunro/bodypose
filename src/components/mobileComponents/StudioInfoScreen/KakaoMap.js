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

        //마커가 표시 될 위치
        let markerPosition = new kakao.maps.LatLng(lat, long);

        // 마커를 생성
        let marker = new kakao.maps.Marker({
          position: markerPosition,
        });

        // 마커를 지도 위에 표시
        marker.setMap(map);
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
