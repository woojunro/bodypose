import React from 'react';
import './Branch.css';
import BranchLine from './BranchLine';
import { IoAddCircleOutline } from 'react-icons/io5';

const Branch = ({
  newBranches = [],
  setNewBranches = () => {},
  studioName = '',
}) => {
  const addNewBranch = () => {
    const branch = {
      name: '',
      address: '',
      parkingInfo: '',
    };
    setNewBranches([...newBranches, branch]);
  };

  const setBranch = (idx, branch) => {
    const branches = [...newBranches];
    branches[idx] = branch;
    setNewBranches([...branches]);
  };

  const deleteBranch = idx => {
    setNewBranches(newBranches.filter((_, index) => idx !== index));
  };

  return (
    <div className="fullSizeBox">
      <div className="boxTitle">지점 목록</div>
      <div className="branchesContainer">
        {newBranches.map((branch, index) => (
          <BranchLine
            isOnlyOne={newBranches.length === 1}
            studioName={studioName}
            changeBranch={setBranch}
            onClickDelete={deleteBranch}
            branch={branch}
            key={`${index}-${branch.name || 'new'}`}
            branchNum={index}
          />
        ))}
        <div className="addNewBranch" onClick={addNewBranch}>
          <IoAddCircleOutline className="addNewBranchIcon" />
          지점 추가하기
        </div>
      </div>
    </div>
  );
};

export default Branch;
