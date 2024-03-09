import axios from 'axios';
import { API_URL } from '../constants/url';

export const getNotice = async id => {
  const res = await axios({
    url: `${API_URL}/graphql`,
    method: 'post',
    data: {
      query: `
        query {
          notice(input: {id: ${id}}) {
            ok
            error
            notice {
              id
              updatedAt
              title
              content
            }
          }
        }
      `,
    },
  });
  const notice = res.data.data?.notice?.notice;
  if (!notice) {
    throw new Error('getNotice failed.');
  }
  return notice;
};
