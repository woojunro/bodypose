import React from 'react';
import { IoIosStar } from 'react-icons/io';

const ReviewStars = ({ stars, setStars }) => {
  const renderedStars = () => {
    if (stars === 0) {
      return (
        <div>
          <IoIosStar
            color="lightgray"
            fontSize="36px"
            onClick={() => setStars(1)}
          />
          <IoIosStar
            color="lightgray"
            fontSize="36px"
            onClick={() => setStars(2)}
          />
          <IoIosStar
            color="lightgray"
            fontSize="36px"
            onClick={() => setStars(3)}
          />
          <IoIosStar
            color="lightgray"
            fontSize="36px"
            onClick={() => setStars(4)}
          />
          <IoIosStar
            color="lightgray"
            fontSize="36px"
            onClick={() => setStars(5)}
          />
        </div>
      );
    } else if (stars === 1) {
      return (
        <div>
          <IoIosStar color="#FFD800" fontSize="36px" />
          <IoIosStar
            color="lightgray"
            fontSize="36px"
            onClick={() => setStars(2)}
          />
          <IoIosStar
            color="lightgray"
            fontSize="36px"
            onClick={() => setStars(3)}
          />
          <IoIosStar
            color="lightgray"
            fontSize="36px"
            onClick={() => setStars(4)}
          />
          <IoIosStar
            color="lightgray"
            fontSize="36px"
            onClick={() => setStars(5)}
          />
        </div>
      );
    } else if (stars === 2) {
      return (
        <div>
          <IoIosStar
            color="#FFD800"
            fontSize="36px"
            onClick={() => setStars(1)}
          />
          <IoIosStar color="#FFD800" fontSize="36px" />
          <IoIosStar
            color="lightgray"
            fontSize="36px"
            onClick={() => setStars(3)}
          />
          <IoIosStar
            color="lightgray"
            fontSize="36px"
            onClick={() => setStars(4)}
          />
          <IoIosStar
            color="lightgray"
            fontSize="36px"
            onClick={() => setStars(5)}
          />
        </div>
      );
    } else if (stars === 3) {
      return (
        <div>
          <IoIosStar
            color="#FFD800"
            fontSize="36px"
            onClick={() => setStars(1)}
          />
          <IoIosStar
            color="#FFD800"
            fontSize="36px"
            onClick={() => setStars(2)}
          />
          <IoIosStar color="#FFD800" fontSize="36px" />
          <IoIosStar
            color="lightgray"
            fontSize="36px"
            onClick={() => setStars(4)}
          />
          <IoIosStar
            color="lightgray"
            fontSize="36px"
            onClick={() => setStars(5)}
          />
        </div>
      );
    } else if (stars === 4) {
      return (
        <div>
          <IoIosStar
            color="#FFD800"
            fontSize="36px"
            onClick={() => setStars(1)}
          />
          <IoIosStar
            color="#FFD800"
            fontSize="36px"
            onClick={() => setStars(2)}
          />
          <IoIosStar
            color="#FFD800"
            fontSize="36px"
            onClick={() => setStars(3)}
          />
          <IoIosStar color="#FFD800" fontSize="36px" />
          <IoIosStar
            color="lightgray"
            fontSize="36px"
            onClick={() => setStars(5)}
          />
        </div>
      );
    } else if (stars === 5) {
      return (
        <div>
          <IoIosStar
            color="#FFD800"
            fontSize="36px"
            onClick={() => setStars(1)}
          />
          <IoIosStar
            color="#FFD800"
            fontSize="36px"
            onClick={() => setStars(2)}
          />
          <IoIosStar
            color="#FFD800"
            fontSize="36px"
            onClick={() => setStars(3)}
          />
          <IoIosStar
            color="#FFD800"
            fontSize="36px"
            onClick={() => setStars(4)}
          />
          <IoIosStar color="#FFD800" fontSize="36px" />
        </div>
      );
    }
  };
  return <div style={{ marginTop: '5px' }}>{renderedStars()}</div>;
};

export default ReviewStars;
