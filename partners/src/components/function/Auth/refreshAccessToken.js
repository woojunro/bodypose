import axios from 'axios';
import API_URLS from '../../../constants/urls';

const refreshAccessToken = async () => {
  try {
    const res = await axios.post(API_URLS.REFRESH_ACCESS_TOKEN);
    const { access, refresh } = res.data;
    return Boolean(access && refresh);
  } catch (e) {
    return false;
  }
};

export default refreshAccessToken;
