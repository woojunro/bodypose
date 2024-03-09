import React from 'react';
import useScript from 'react-script-hook';

const SearchAddressButton = ({
  src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js',
  callback = (data = {}) => {},
}) => {
  const [loading, error] = useScript({ src, checkForExisting: true });

  const onClick = () => {
    const { daum } = window;
    new daum.Postcode({
      oncomplete: data => callback(data),
    }).open();
  };

  return (
    <button
      className="searchAddressButton"
      disabled={loading || error}
      onClick={onClick}
    >
      주소 검색
    </button>
  );
};

export default SearchAddressButton;
