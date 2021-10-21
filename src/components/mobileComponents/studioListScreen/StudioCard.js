import React, { useState } from 'react';
import './StudioCard.css';
import { IoHeart, IoHeartOutline } from 'react-icons/io5';
import { useHistory } from 'react-router-dom';
import GetShortAdress from '../../functions/Studio/GetShortAdress';
import { client, IsLoggedInVar } from '../../../apollo';
import { gql, useMutation, useReactiveVar } from '@apollo/client';
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
  price,
  review,
  mainPhoto,
  isEvent,
  percent,
  originalPrice,
}) => {
  const isLoggedIn = useReactiveVar(IsLoggedInVar);
  const history = useHistory();
  const address = GetShortAdress(location || '주소 없음');

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
    if (!isLoggedIn) {
      const ok = window.confirm(
        '로그인이 필요한 기능입니다. 로그인 하시겠습니까?'
      );
      if (!ok) return;
      history.push({
        pathname: '/login',
        state: { previousPath: '/studios' },
      });
      return;
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
      <div
        className="studioCardContainer"
        onClick={() => {
          history.push({
            pathname: `/studios/${name}`,
            state: { previousPath: history.location.pathname },
          });
        }}
      >
        <div className="studioImg">
          <img src={mainPhoto} alt={title} />
        </div>
        <div className="cardInfo">
          <div className="upper">
            <div className="firstLine">
              <span>{title}</span>
            </div>
            <div className="location">{address}</div>
            {/* <div className="thirdLine">
              <IoStar color="#FFD800" fontSize="17px" />
              {review === 0 ? (
                <span className="noReviewSpan">리뷰 없음</span>
              ) : (
                <>
                  <span className="rating">{rating.toFixed(1)}</span>
                  <span className="review">{`(${review}개)`}</span>
                </>
              )}
            </div> */}
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
              <span className="price">
                {price ? `${price.toLocaleString()}원~` : '문의'}
              </span>
            </div>
          </div>
        </div>
      </div>
      {isHearted ? (
        <IoHeart
          onClick={ChangeHeart}
          className="cardSelectedHeart"
          fontSize="20px"
        />
      ) : (
        <IoHeartOutline
          onClick={ChangeHeart}
          className="cardHeart"
          fontSize="20px"
        />
      )}
    </div>
  );
};

export default StudioCard;
