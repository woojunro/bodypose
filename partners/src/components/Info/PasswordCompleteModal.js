import React from 'react';
import './PasswordCompleteModal.css';
import Modal from 'react-responsive-modal';
import { useHistory } from 'react-router-dom';
import { LoggedInPaths } from '../../routers/LoggedInRouter';

const PasswordCompleteModal = ({ isModalOpen }) => {
  const history = useHistory();

  const onClose = () => history.push(LoggedInPaths.MY_INFO);

  return (
    <Modal open={isModalOpen} onClose={onClose} center>
      <div className="passwordCompleteModal">비밀번호가 변경되었습니다.</div>
      <div className="passwordCompleteButtonContainer">
        <div className="passwordCompleteButton" onClick={onClose}>
          확인
        </div>
      </div>
    </Modal>
  );
};

export default PasswordCompleteModal;
