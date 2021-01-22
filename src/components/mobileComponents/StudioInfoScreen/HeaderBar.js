import { SetHeartDb } from '../../../components/functions/WithDb/GetStudios';
import { IoIosHeartEmpty, IoIosHeart, IoMdShare } from 'react-icons/io';
import { useHistory } from 'react-router-dom';
import LoginContext from '../../../contexts/LoginContext';
import { FiArrowLeft } from 'react-icons/fi';
import './HeaderBar.css';
import React, { useState, useContext } from 'react';

const HeaderBar = ({ currentStudio, copyTextToClipboard, setIsAlertOpen }) => {
  const [isHearted, setIsHearted] = useState(currentStudio.isHearted);
  const LogedIn = useContext(LoginContext);
  const history = useHistory();

  const ChangeIsHearted = () => {
    if (!LogedIn.logedIn) {
      history.push({
        pathname: '/login',
        state: { previousPath: '/studios' },
      });
    }
    SetHeartDb();
    //Db에 is hearted 바꾸는 코드 넣기.
    setIsHearted(!isHearted);
  };
  const onclick = () => {
    setIsAlertOpen(true);
    copyTextToClipboard();
  };

  return (
    <div className="studioInfoHeader">
      <FiArrowLeft
        onClick={() => history.goBack()}
        className="studioInfoGoBack"
      />
      <div>
        {isHearted ? (
          <IoIosHeart
            onClick={ChangeIsHearted}
            className="studioInfoColorHeart"
            fontSize="20px"
          />
        ) : (
          <IoIosHeartEmpty
            onClick={ChangeIsHearted}
            className="studioInfoHeart"
            fontSize="20px"
          />
        )}
        <IoMdShare onClick={() => onclick()} className="studioInfoShare" />
      </div>
    </div>
  );
};

export default HeaderBar;
