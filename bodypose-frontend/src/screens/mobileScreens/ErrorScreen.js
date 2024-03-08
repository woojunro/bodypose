import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const ErrorScreen = () => {
  const history = useHistory();

  useEffect(() => {
    const goToHome = setTimeout(() => {
      history.replace('/');
    }, 3000);
    return () => {
      clearTimeout(goToHome);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="appFullScreenCenter">
      <p>잘못된 접근입니다.</p>
      <p>3초 후 홈페이지로 이동합니다.</p>
    </div>
  );
};
export default ErrorScreen;
