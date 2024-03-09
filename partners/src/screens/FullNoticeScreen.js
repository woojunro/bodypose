import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import FullNotice from '../components/Dashboard/Notice/FullNotice';
import Footer from '../components/Footer';
import { LoggedInPaths } from '../routers/LoggedInRouter';
import './FullNoticeScreen.css';
import LoadingScreen from './LoadingScreen';

const GET_PARTNERS_NOTICE = gql`
  query GetPartnersNotice($id: Int!) {
    partnersNotice(input: { id: $id }) {
      ok
      error
      partnersNotice {
        id
        title
        content
      }
    }
  }
`;

const FullNoticeScreen = () => {
  const { noticeId } = useParams();
  const history = useHistory();

  const { data, loading } = useQuery(GET_PARTNERS_NOTICE, {
    variables: { id: Number(noticeId) },
    fetchPolicy: 'network-only',
    onError: history.goBack,
  });

  return loading ? (
    <LoadingScreen />
  ) : (
    <div className="Dashboard">
      <div className="partnersMainPartContainer">
        <div className="partnersMainPart">
          <div className="noticeNameContainer">
            <div className="noticeName">
              <div>{data?.partnersNotice?.partnersNotice?.title}</div>
              <div
                className="toNoticeScreen"
                onClick={() => history.push(LoggedInPaths.NOTICE)}
              >
                목록으로
              </div>
            </div>
          </div>
          <FullNotice text={data?.partnersNotice?.partnersNotice?.content} />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default FullNoticeScreen;
