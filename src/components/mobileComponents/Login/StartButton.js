import React from 'react';
import { useHistory } from 'react-router-dom';
import { EmailToDb, SnsToDb } from '../../functions/WithDb/Auth';
import './StartButton.css';

export const StartButton = ({ someError, email, password, userName }) => {
  const history = useHistory();
  return (
    <>
      {someError === true ? (
        <div className="unactiveStartButtonContainer">
          <div className="unactiveStartButton">시작하기</div>
        </div>
      ) : (
        <div className="startButtonContainer">
          <div
            onClick={
              email
                ? () => {
                    EmailToDb(email, password, userName);
                    history.push('/login');
                  }
                : () => {
                    SnsToDb(userName);
                    history.push('/');
                  }
            }
            className="startButton"
          >
            시작하기
          </div>
        </div>
      )}
    </>
  );
};
