import { useHistory } from 'react-router';
import { LoggedInPaths } from '../routers/LoggedInRouter';

const useRefresh = () => {
  const history = useHistory();
  const refreshPath = LoggedInPaths.REFRESH;

  const refresh = () => {
    const path = window.location.pathname;
    history.replace(refreshPath);
    setTimeout(() => history.replace(path), 100);
  };

  return refresh;
};

export default useRefresh;
