import axios from 'axios';
import { BASE_URL } from '../../../constants/urls';
import { refreshAccessToken } from '../Common/refreshAccessToken';

export const logout = async () => {
  const url = `${BASE_URL}/auth/logout`;
  const payload = { fromAllDevices: false };
  axios.defaults.withCredentials = true;
  try {
    await axios.post(url, payload);
  } catch (e) {
    const isRefreshed = await refreshAccessToken();
    if (isRefreshed) {
      await axios.post(url, payload);
    }
  }
};
