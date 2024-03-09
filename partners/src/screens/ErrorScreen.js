import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './ErrorScreen.css';

const ErrorScreen = () => {
  const history = useHistory();

  useEffect(() => {
    const gotoHome = setTimeout(() => {
      history.push('/');
    }, 3000);
    return () => {
      clearTimeout(gotoHome);
    };
  }, []);

  return (
    <div className="errorScreen">
      <p>잘못된 접근입니다.</p>
      <p>3초 후 홈페이지로 이동합니다.</p>
    </div>
  );
};
export default ErrorScreen;
