import axios from 'axios';
import { API_URL } from '../constants/url';

export const refreshAccessToken = async () => {
  const url = `${API_URL}/auth/refresh`;
  axios.defaults.withCredentials = true;
  try {
    const res = await axios.post(url);
    if (res.data.access && res.data.refresh) {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
};
