import React, { useState, useContext } from 'react';
import './StudioCard.css';
import { IoIosHeartEmpty, IoIosStar, IoIosHeart } from 'react-icons/io';
import { Link, useHistory } from 'react-router-dom';
import LoginContext from '../../../contexts/LoginContext';
import GetShortAdress from '../../functions/Studio/GetShortAdress';
import { client } from '../../../apollo';
import { gql, useMutation } from '@apollo/client';
import {
  DISHEART_STUDIO_MUTATION,
  HEART_STUDIO_MUTATION,
} from '../../../gql/mutations/HeartStudioMutation';

const StudioCard = ({
  id,
  Hearted,
  name,
  title,
  location,
  rating,
  price,
  review,
  mainPhoto,
  isEvent,
  percent,
  originalPrice,
}) => {
  const LoggedIn = useContext(LoginContext);
  const history = useHistory();
  const adress = GetShortAdress(location);

  const [isHearted, setIsHearted] = useState(Hearted);

  const heart = () => {
    client.writeFragment({
      id: `StudioWithIsHearted:${id}`,
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
      id: `StudioWithIsHearted:${id}`,
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
          slug: name,
        },
      });
    } else {
      heartStudioPhoto({
        variables: {
          slug: name,
        },
      });
    }
    setIsHearted(!isHearted);
  };

  return (
    <div className="totalContainer">
      <Link
        onClick={() => window.scrollTo(0, 0)}
        to={{
          pathname: `/studios/${name}`,
          state: { previousPath: history.location.pathname },
        }}
        style={{ TextDecoder: 'none', color: 'white' }}
      >
        <div className="studioCardContainer">
          <div className="studioImg">
            <img src={mainPhoto} alt={title} />
          </div>
          <div className="cardInfo">
            <div className="upper">
              <div className="firstLine">
                <span style={{ fontSize: '15px' }}>{title}</span>
              </div>
              <div className="location">{adress}</div>
              <div className="thirdLine">
                <IoIosStar color="#FFD800" fontSize="18px" />
                <span className="rating">{rating}</span>
                <span className="review">{`(${review}개)`}</span>
              </div>
            </div>
            <div className="lower">
              <div className="eventLine">
                {isEvent ? (
                  <span>
                    <span className="percent">{percent}</span>
                    <span className="originalPrice">{originalPrice}</span>
                  </span>
                ) : null}
              </div>
              <div className="lastLine">
                <span className="per">최저 가격</span>
                <span className="price">{`${price}~`}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
      {isHearted ? (
        <IoIosHeart
          onClick={ChangeHeart}
          className="cardSelectedHeart"
          fontSize="20px"
        />
      ) : (
        <IoIosHeartEmpty
          onClick={ChangeHeart}
          className="cardHeart"
          fontSize="20px"
        />
      )}
    </div>
  );
};

export default StudioCard;
