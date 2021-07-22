import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { clearCache } from '../../apollo';
import { logout } from '../../components/functions/Login/Logout';
import AppLoadingScreen from '../../components/mobileComponents/AppLoadingScreen';

const LogoutScreen = () => {
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    logout()
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading) {
      clearCache();
      setTimeout(() => history.push('/'), 2000);
    }
  }, [loading, history]);

  return (
    <div className="appFullScreenCenter">
      {loading ? (
        <AppLoadingScreen />
      ) : (
        <>
          <p>로그아웃되었습니다.</p>
          <p>홈페이지로 이동합니다.</p>
        </>
      )}
    </div>
  );
};

export default LogoutScreen;
