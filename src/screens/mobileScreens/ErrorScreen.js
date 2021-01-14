import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

const ErrorScreen = () => {
  const [isTimeout, setIsTimeout] = useState(false);
  const history = useHistory();

  setTimeout(() => {
    setIsTimeout(true);
  }, 3000);

  useEffect(() => {
    if (isTimeout) {
      history.push('/');
    }
    return null;
  }, [isTimeout]);

  return <div>잘못된 접근입니다. 3초 후 홈페이지로 이동합니다.</div>;
};
export default ErrorScreen;
