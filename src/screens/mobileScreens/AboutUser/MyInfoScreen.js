import './MyInfoScreen.css';
import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Redirect, useHistory } from 'react-router-dom';
import BottomNavigation from '../../../components/mobileComponents/BottomNavigation';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import AppLoadingScreen from '../../../components/mobileComponents/AppLoadingScreen';
import { IsLoggedInVar } from '../../../apollo';
import { MY_USER_INFO_QUERY } from '../../../gql/queries/MyUserInfoQuery';
import { RESEND_VERIFICATION_MAIL_MUTATION } from '../../../gql/mutations/ResendVerificationMailMutation';
import { alertError } from '../../../components/functions/Common/alertError';

const MyInfoScreen = () => {
  const history = useHistory();
  const isLoggedIn = useReactiveVar(IsLoggedInVar);

  const { data, loading } = useQuery(MY_USER_INFO_QUERY);
  const [resendVerificationMail] = useMutation(
    RESEND_VERIFICATION_MAIL_MUTATION,
    {
      onCompleted: mutationData => {
        const { ok } = mutationData.resendVerificationMail;
        if (ok) {
          alert(
            `${data.userInfo.userInfo.email}(으)로 확인 메일을 전송하였습니다.`
          );
        } else {
          alertError();
        }
      },
      onError: alertError,
    }
  );

  const onClickVerify = () => {
    const ok = window.confirm('이메일 인증을 진행하시겠습니까?');
    if (!ok) return;
    resendVerificationMail();
  };

  return !isLoggedIn ? (
    <Redirect to={'/login'} />
  ) : loading ? (
    <div className="appLoader">
      <AppLoadingScreen />
    </div>
  ) : (
    <div>
      <div className="usersTopContainer">
        <FiArrowLeft
          className="usersGoBackArrow"
          onClick={() => {
            history.goBack();
          }}
        />
        <div className="leaveTitle">내 정보 관리</div>
        <div className="myInfoSave">저장</div>
      </div>
      {loading ? (
        <div className="appLoader">
          <AppLoadingScreen />
        </div>
      ) : (
        <div className="userInfoContainer">
          <div className="userInfoSemiTitle">이메일</div>
          <div className="userInfoText">{data.userInfo.userInfo.email}</div>
          <div className="userInfoSemiTitle">이메일 인증 여부</div>
          {data.userInfo.userInfo.isVerified ? (
            <div className="userInfoPassword">
              이메일 인증이 완료되었습니다.
            </div>
          ) : (
            <div className="userInfoPassword userInfoNotVerified">
              이메일 인증이 완료되지 않았습니다.
              <div onClick={onClickVerify} className="userInfoChange">
                인증하기
              </div>
            </div>
          )}
          <div className="userInfoSemiTitle">비밀번호</div>
          {data.userInfo.userInfo.oauthList.length === 0 ? (
            <div className="userInfoPassword">
              <div>********</div>
              <div
                onClick={() => {
                  history.push('/changePassword');
                  window.scrollTo(0, 0);
                }}
                className="userInfoChange"
              >
                수정하기
              </div>
            </div>
          ) : (
            <div className="userInfoPassword">소셜 회원입니다.</div>
          )}
        </div>
      )}
      <BottomNavigation pageName="users" />
    </div>
  );
};

export default MyInfoScreen;
