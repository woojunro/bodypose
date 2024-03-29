import React, { useState, useEffect } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Redirect, useHistory } from 'react-router-dom';
import BottomNavigation from '../../../components/mobileComponents/BottomNavigation';
import LeaveButton from '../../../components/mobileComponents/Login/LeaveButton';
import './LeaveScreen.css';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { MY_PROFILE_QUERY } from '../../../gql/queries/MyProfileQuery';
import { IsLoggedInVar } from '../../../apollo';
import AppLoadingScreen from '../../../components/mobileComponents/AppLoadingScreen';
import { LEAVE_BODYPOSE_MUTATION } from '../../../gql/mutations/LeaveMutation';

const LeaveScreen = () => {
  const isLoggedIn = useReactiveVar(IsLoggedInVar);
  const history = useHistory();
  const [checked, setChecked] = useState(false);
  const [isLeaved, setIsLeaved] = useState(false);

  const { loading: profileLoading } = useQuery(MY_PROFILE_QUERY);

  const [unregister, { loading }] = useMutation(LEAVE_BODYPOSE_MUTATION, {
    onCompleted: async data => {
      if (data.deleteMyAccount.ok) {
        setIsLeaved(true);
      } else {
        alert('오류가 발생하였습니다. 다시 시도해주세요.');
        setChecked(false);
      }
    },
    onError: () => {
      alert('오류가 발생하였습니다. 다시 시도해주세요.');
      setChecked(false);
    },
  });

  useEffect(() => {
    if (isLeaved) {
      setTimeout(() => {
        history.push('/logout');
      }, 2000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLeaved]);

  if (!isLoggedIn) {
    return <Redirect to={'/error'} />;
  } else {
    if (isLeaved) {
      return (
        <div className="leftScreen">
          <div>회원탈퇴 되었습니다.</div>
        </div>
      );
    }
    return (
      <div>
        <div className="usersTopContainer">
          <FiArrowLeft
            className="usersGoBackArrow"
            onClick={() => {
              history.goBack();
            }}
          />
          <div className="leaveTitle">회원탈퇴</div>
          <div className="usersTopEmptyBox" />
        </div>

        {profileLoading || loading ? (
          <div className="appLoader">
            <AppLoadingScreen />
          </div>
        ) : (
          <div className="leaveContrast">
            <div className="leaveNotice">
              *회원탈퇴를 하기 전에 안내 사항을 꼭 확인해주세요.
            </div>
            <div className="leaveSemiTitle">회원정보 삭제</div>
            <div className="leaveText">
              이메일, 비밀번호, 이름 등의 회원 정보는 모두 삭제되며, 삭제된
              데이터는 복구되지 않습니다.
            </div>

            <div className="leaveSemiTitle">서비스 이용기록 삭제</div>
            <div className="leaveText">
              내가 찜한 스튜디오, 내가 찜한 컨셉 등의 모든 서비스 이용 기록이
              삭제되며, 삭제된 데이터는 복구되지 않습니다.
            </div>
            <div className="leaveSemiTitle">
              게시판형 서비스 등록 게시물 유지
            </div>
            <div className="leaveText">
              <span>
                커뮤니티의 리뷰 등의 게시판형 서비스는 자동 삭제되지 않고 그대로
                남아 있습니다. 삭제를 원하는 게시글이 있다면
              </span>
              <span className="leaveRedText">
                반드시 탈퇴 전 삭제하시기 바랍니다.
              </span>
              <div>
                탈퇴 후에는 회원정보가 삭제되어 본인 여부를 확인할 수 있는
                방법이 없어, 게시글을 임의로 삭제해드릴 수 없습니다.
              </div>
            </div>
            <div className="leaveAgreeContainer">
              <input
                type="checkBox"
                checked={checked}
                onChange={() => {
                  setChecked(!checked);
                }}
              />
              <div className="leaveAgreeText">
                위 내용을 모두 확인했으며, 이에 동의합니다.
              </div>
            </div>
            {checked ? (
              <LeaveButton onClick={unregister} />
            ) : (
              <div className="unleaveButtonContainer">
                <div className="unleaveButton">탈퇴하기</div>
              </div>
            )}
          </div>
        )}
        <BottomNavigation pageName="users" />
      </div>
    );
  }
};

export default LeaveScreen;
