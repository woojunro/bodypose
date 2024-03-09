import axios from 'axios';
import { API_URL } from '../constants/url';

export const logout = async () => {
  const url = `${API_URL}/auth/logout`;
  const payload = { fromAllDevices: false };
  axios.defaults.withCredentials = true;
  const res = await axios.post(url, payload);
  return res;
};
