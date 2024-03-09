import React, { useState } from 'react';
import Modal from 'react-responsive-modal';
import './DetailAddressInputModal.css';

const DetailAddressInputModal = ({
  open = false,
  onClose = () => {},
  mainAddress = '',
  onSubmit = detailAddress => {},
}) => {
  const [detailAddress, setDetailAddress] = useState('');

  const onClick = () => {
    onSubmit(detailAddress);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} center>
      <div className="detailAddressInputModalContainer">
        <h3>상세 주소 입력</h3>
        <div className="detailAddressInputModalMainAddress">{mainAddress}</div>
        <input
          className="detailAddressInputModalDetailAddressInput"
          value={detailAddress}
          placeholder="상세 주소"
          onChange={e => setDetailAddress(e.target.value)}
          maxLength={100 - mainAddress.length - 1} // 한 칸 띄어쓰기
          autoFocus
        />
        <div
          className="detailAddressInputModalConfirmButton centeredDiv"
          onClick={onClick}
        >
          확인
        </div>
      </div>
    </Modal>
  );
};

export default DetailAddressInputModal;
