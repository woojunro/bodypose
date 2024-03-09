import axios from 'axios';
import API_URLS from '../../../constants/urls';
import { resetClient } from '../../../graphql/apollo';
import { IsLoggedInVar } from '../../../graphql/variables';

const logout = () => {
  const payload = { fromAllDevices: false };
  axios.post(API_URLS.LOGOUT, payload).finally(() => {
    resetClient().finally(() => IsLoggedInVar(false));
  });
};

export default logout;
