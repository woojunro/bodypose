import axios from 'axios';
import { BASE_URL } from '../../../constants/urls';

export const logout = async () => {
  const url = `${BASE_URL}/auth/logout`;
  const payload = { fromAllDevices: false };
  axios.defaults.withCredentials = true;
  await axios.post(url, payload);
};
