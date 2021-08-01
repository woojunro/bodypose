import React from 'react';
import './KakaoMap.css';
import KakaoMapLogo from '../../../materials/kakao_map.png';

class KakaoMap extends React.Component {
  constructor(props) {
    super(props);
    this.kakaoMapButtonRef = React.createRef();
  }

  componentDidMount() {
    const { currentLocation } = this.props;
    const { kakao } = window;
    kakao.maps.load(() => {
      const container = document.getElementById('map');
      //위도,경도, 줌 정도
      const options = {
        center: new kakao.maps.LatLng(0, 0),
        level: 3,
      };
      const map = new kakao.maps.Map(container, options);
      const bounds = new kakao.maps.LatLngBounds();

      // 주소-좌표 변환 객체를 생성합니다
      const geocoder = new kakao.maps.services.Geocoder();

      // 주소로 좌표를 검색합니다
      geocoder.addressSearch(currentLocation.address, (result, status) => {
        // 정상적으로 검색이 완료됐으면
        if (status === kakao.maps.services.Status.OK) {
          const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

          // Set onClick of kakao map button
          this.kakaoMapButtonRef.current.onclick = () => {
            let url = 'https://map.kakao.com/link/map/';
            url += currentLocation.value + ',';
            url += String(coords.getLat()) + ',';
            url += String(coords.getLng());
            window.open(url, '_blank');
          };

          // 결과값으로 받은 위치를 마커로 표시합니다
          new kakao.maps.Marker({
            map: map,
            position: coords,
          });

          bounds.extend(coords);
          map.setBounds(bounds);
        }
      });
    });
  }

  render() {
    return (
      <>
        <div
          id="map"
          style={{ width: '100%', height: '220px', marginTop: '10px' }}
        />
        <div ref={this.kakaoMapButtonRef} className="kakaoMapButton">
          <img src={KakaoMapLogo} alt="카카오맵 로고" />
          <div>카카오맵에서 보기</div>
        </div>
      </>
    );
  }
}

export default KakaoMap;
