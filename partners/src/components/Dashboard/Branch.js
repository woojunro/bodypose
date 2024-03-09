import React from 'react';
import { useHistory } from 'react-router-dom';
import useMyStudio from '../../hooks/useMyStudio';
import { LoggedInPaths } from '../../routers/LoggedInRouter';
import './Branch.css';

const Branch = () => {
  const history = useHistory();
  const {
    studio: { branches },
  } = useMyStudio();

  return (
    <div className="fullSizeBox">
      <div className="boxTitle">
        <div>지점</div>
        <div
          className="gotoPage"
          onClick={() => history.push(LoggedInPaths.STUDIO_BRANCH)}
        >
          지점 관리하기
        </div>
      </div>
      <div className="dashboardBranchItemContainer">
        {branches.length > 0 ? (
          <>
            <div>대표 스튜디오</div>
            <div className="dashboardBranchItems">
              {branches.map(item => (
                <div key={item.id} className="dashboardBranchData">
                  <div className="dashboardBranchName">{item.name}</div>
                  <div className="dashboardBranchAddress">{item.address}</div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="noBranches">지점 정보가 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default Branch;
