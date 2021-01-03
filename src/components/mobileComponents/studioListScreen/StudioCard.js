import React from 'react';
import './StudioCard.css';
import { IoIosHeartEmpty } from 'react-icons/io';
import { IoIosStar } from 'react-icons/io';
import { IoIosHeart } from 'react-icons/io';
import { Link } from 'react-router-dom';

const StudioCard = ({
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
  return (
    <div className="totalContainer">
      <Link
        to={`studios/${name}`}
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
              <div className="location">{location}</div>
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
                <span className="per">1인 컨셉 1개</span>
                <span className="price">{`${price}~`}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
      <IoIosHeartEmpty className="cardHeart" fontSize="20px" />
    </div>
  );
};

export default StudioCard;
