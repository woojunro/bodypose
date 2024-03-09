import Logo from './bodypose_symbol.png';

const user = {
  studioName: '제이슨 스튜디오',
  contactLink: null,
  reservationLink: 'https://bodypose.co.kr/kakaoLink/스튜디오제스트',
  logo: Logo,
  //0번 5주전 데이터, 4번 1주전 데이터
  inflow: [80, 90, 75, 90, 115],
  click: [240, 124, 215, 232, 253],
  transform: [14, 15, 16, 18, 20],
  studioProduct: 5,
  outdoorProduct: 2,
  optionalProduct: 3,
  hairMakeup: 1,
  branches: [
    {
      name: '제이슨 스튜디오',
      address: '서울시 강남구 대치동 영동대로 417',
      addition: '5층',
    },
    { name: '서초점', address: '서울시 서초구 헌릉로 12' },
  ],
  studioProductDescription: [
    '스튜디오',
    '이것은 조금 길다고 볼 수 있는 스튜디오 전체 추가 설명입니다. 이것보다는 보통 짧을듯',
    '이건 조금 짧은 스튜디오 추가 설명',
  ],
  outdoorProductDescription: [],
  optionalProductDescription: ['옵셔널', '로우준', '김재승'],
  hairMakeupDescription: ['헤어', '메엌', '예아'],
};

export default user;
