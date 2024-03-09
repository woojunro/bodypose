import React, { useEffect, useState } from 'react';
import './ChangePasswordScreen.css';
import PageTitle from '../../components/PageTitle';
import ChangePassword from '../../components/Info/ChangePassword';
import InfoChangeButton from '../../components/Info/InfoChangeButton';
import PasswordCompleteModal from '../../components/Info/PasswordCompleteModal';
import { CheckValidPassword } from '../../components/function/Auth/LoginFunctions';
import { gql, useMutation } from '@apollo/client';
import { ERROR_MESSAGE } from '../../constants/errorMessages';

const CHANGE_PASSWORD = gql`
  mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
    changePassword(
      input: { currentPassword: $currentPassword, newPassword: $newPassword }
    ) {
      ok
      error
    }
  }
`;

const StudioInfoScreen = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(true);
  const [canSubmit, setCanSubmit] = useState(false);

  const [changePassword, { loading }] = useMutation(CHANGE_PASSWORD, {
    onCompleted: data => {
      const { ok, error } = data.changePassword;
      if (ok) {
        setIsModalOpen(true);
      } else {
        if (error === 'WRONG_PASSWORD') {
          setIsPasswordCorrect(false);
        }
      }
    },
    onError: err => {
      if (err.message === 'Bad Request Exception') {
        setIsPasswordCorrect(false);
      } else {
        alert(ERROR_MESSAGE);
      }
    },
  });

  useEffect(() => {
    setCanSubmit(
      currentPassword.length > 0 &&
        CheckValidPassword(newPassword) &&
        newPassword === passwordConfirm
    );
  }, [currentPassword, newPassword, passwordConfirm]);

  //적용하기 눌렀을 때 저장하기
  const saveData = () => {
    changePassword({
      variables: {
        currentPassword,
        newPassword,
      },
    });
  };

  const refresh = () => {
    setCurrentPassword('');
    setNewPassword('');
    setPasswordConfirm('');
  };

  return (
    <div>
      <div className="Dashboard">
        <div className="partnersMainPartContainer">
          <div className="partnersMainPart">
            <PageTitle title="비밀번호 변경" />
            <ChangePassword
              currentPassword={currentPassword}
              setCurrentPassword={setCurrentPassword}
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              passwordConfirm={passwordConfirm}
              setPasswordConfirm={setPasswordConfirm}
              isPasswordCorrect={isPasswordCorrect}
            />
            <InfoChangeButton
              refresh={refresh}
              onClick={saveData}
              isActive={canSubmit && !loading}
            />
            <PasswordCompleteModal isModalOpen={isModalOpen} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudioInfoScreen;
