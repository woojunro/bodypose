import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import SearchAddressButton from './SearchAddressButton';
import './BranchLine.css';
import DetailAddressInputModal from './DetailAddressInputModal';

const BranchTitle = ({ branchNum = 0 }) => (
  <div className="branchTitle">
    {branchNum === 0 ? '대표 스튜디오' : `지점 ${branchNum}`}
  </div>
);

const BranchLine = ({
  isOnlyOne = false,
  studioName,
  changeBranch,
  branch,
  branchNum,
  onClickDelete,
}) => {
  const { name, address, parkingInfo } = branch;

  const [isEditing, setIsEditing] = useState(false);
  const [isAddressDetailModalOpen, setIsAddressDetailModalOpen] =
    useState(false);
  const [mainAddress, setMainAddress] = useState('');

  const closeModal = () => {
    setIsAddressDetailModalOpen(false);
    setMainAddress('');
  };

  const onModalSubmit = detailAddress => {
    const fullAddress = mainAddress + ' ' + detailAddress.trim();
    setValue('address', fullAddress.trim());
  };

  const searchAddressButtonCallback = data => {
    setMainAddress(data.address);
    setIsAddressDetailModalOpen(true);
  };

  const { register, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      name,
      address,
      parkingInfo,
    },
  });

  useEffect(() => {
    if (!name) setIsEditing(true);
    if (isOnlyOne) setValue('name', studioName);
  }, [name, isOnlyOne, setValue, studioName]);

  const onSubmit = data => {
    setIsEditing(false);
    changeBranch(branchNum, { ...data });
  };

  const onError = () => {};

  const onCancel = () => {
    if (name) {
      reset({ name, address, parkingInfo });
      setIsEditing(false);
    } else {
      onClickDelete(branchNum);
    }
  };

  return isEditing ? (
    <>
      <div className="branchLine">
        <BranchTitle branchNum={branchNum} />
        <div className="editBranchInputDiv">
          <div className="editBranchLineInputContainer">
            <input
              className="branchNameEdit"
              placeholder="지점명 (최대 10자)"
              autoComplete="off"
              maxLength={10}
              {...register('name', { required: true, maxLength: 10 })}
            />
          </div>
          <div className="editBranchLineInputContainer">
            <input
              className="branchAddressEdit"
              placeholder="주소를 입력해주세요"
              maxLength={100}
              readOnly
              {...register('address', { required: true, maxLength: 100 })}
            />
            <SearchAddressButton callback={searchAddressButtonCallback} />
          </div>
          <div className="editBranchLineInputContainer">
            <div className="editBranchParkingLabel">주차 정보</div>
            <textarea
              className="branchParkingInfoEdit"
              placeholder="주차 정보 (선택)"
              {...register('parkingInfo')}
            />
          </div>
        </div>
        <div className="branchEdit" onClick={handleSubmit(onSubmit, onError)}>
          완료
        </div>
        <div className="branchEdit" onClick={onCancel}>
          취소
        </div>
      </div>
      {isAddressDetailModalOpen && (
        <DetailAddressInputModal
          open={isAddressDetailModalOpen}
          onClose={closeModal}
          mainAddress={mainAddress}
          onSubmit={onModalSubmit}
        />
      )}
    </>
  ) : (
    <div className="branchLine">
      <BranchTitle branchNum={branchNum} />
      <div className="branchInfo">
        <div className="branchName">{name}</div>
        <div className="branchAddress">{address}</div>
        {parkingInfo && (
          <div className="branchParkingDiv">
            <div className="branchParkingLabel">주차 정보</div>
            <div className="branchParkingInfo">{parkingInfo}</div>
          </div>
        )}
      </div>
      <div className="branchEdit" onClick={() => setIsEditing(true)}>
        수정
      </div>
      <div className="branchEdit" onClick={() => onClickDelete(branchNum)}>
        삭제
      </div>
    </div>
  );
};

export default BranchLine;
