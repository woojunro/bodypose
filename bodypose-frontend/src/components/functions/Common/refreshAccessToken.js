import axios from 'axios';
import { BASE_URL } from '../../../constants/urls';

export const refreshAccessToken = async () => {
  const url = `${BASE_URL}/auth/refresh`;
  try {
    axios.defaults.withCredentials = true;
    const res = await axios.post(url);
    if (res.data.access && res.data.refresh) return true;
  } catch (e) {
    return false;
  }

  return false;
};
