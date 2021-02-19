import { IoIosHeartEmpty, IoIosHeart, IoMdShare } from 'react-icons/io';
import { useHistory } from 'react-router-dom';
import LoginContext from '../../../contexts/LoginContext';
import { FiArrowLeft } from 'react-icons/fi';
import './HeaderBar.css';
import React, { useState, useContext } from 'react';
import { client } from '../../../apollo';
import { gql, useMutation } from '@apollo/client';
import {
  DISHEART_STUDIO_MUTATION,
  HEART_STUDIO_MUTATION,
} from '../../../gql/mutations/HeartStudioMutation';

const HeaderBar = ({ currentStudio, copyTextToClipboard, setIsAlertOpen }) => {
  const [isHearted, setIsHearted] = useState(currentStudio.isHearted);
  const LoggedIn = useContext(LoginContext);
  const history = useHistory();

  const gobackFunction = () => {
    if (history.location.state) {
      history.goBack();
    } else {
      history.push('/');
    }
  };

  const heart = () => {
    client.writeFragment({
      id: `StudioWithIsHearted:${currentStudio.id}`,
      fragment: gql`
        fragment StudioCardHeart on StudioWithIsHearted {
          isHearted
        }
      `,
      data: {
        isHearted: true,
      },
    });
  };

  const disheart = () => {
    client.writeFragment({
      id: `StudioWithIsHearted:${currentStudio.id}`,
      fragment: gql`
        fragment StudioCardHeart on StudioWithIsHearted {
          isHearted
        }
      `,
      data: {
        isHearted: false,
      },
    });
  };

  const [heartStudioPhoto] = useMutation(HEART_STUDIO_MUTATION, {
    onError: () => alert('오류가 발생하였습니다. 다시 시도해주세요.'),
    onCompleted: data => {
      if (data.heartStudio.ok) {
        heart();
      }
    },
  });

  const [disheartStudioPhoto] = useMutation(DISHEART_STUDIO_MUTATION, {
    onError: () => alert('오류가 발생하였습니다. 다시 시도해주세요.'),
    onCompleted: data => {
      if (data.disheartStudio.ok) {
        disheart();
      }
    },
  });

  const ChangeHeart = () => {
    if (!LoggedIn.loggedIn) {
      const ok = window.confirm(
        '로그인이 필요한 기능입니다. 로그인 하시겠습니까?'
      );
      if (!ok) {
        return;
      }
      history.push({
        pathname: '/login',
        state: { previousPath: '/studios' },
      });
    }

    if (isHearted) {
      disheartStudioPhoto({
        variables: {
          slug: currentStudio.slug,
        },
      });
    } else {
      heartStudioPhoto({
        variables: {
          slug: currentStudio.slug,
        },
      });
    }
    setIsHearted(!isHearted);
  };

  const onclick = () => {
    setIsAlertOpen(true);
    copyTextToClipboard();
  };

  return (
    <div className="studioInfoHeader">
      <FiArrowLeft
        onClick={() => gobackFunction()}
        className="studioInfoGoBack"
      />
      <div>
        {isHearted ? (
          <IoIosHeart
            onClick={ChangeHeart}
            className="studioInfoColorHeart"
            fontSize="20px"
          />
        ) : (
          <IoIosHeartEmpty
            onClick={ChangeHeart}
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
