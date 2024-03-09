import { IoIosStarOutline, IoIosStar } from 'react-icons/io';

export const GetStars = (rating) => {
  if (rating === 5) {
    return (
      <div>
        <IoIosStar color="#FFD800" fontSize="15px" />
        <IoIosStar color="#FFD800" fontSize="15px" />
        <IoIosStar color="#FFD800" fontSize="15px" />
        <IoIosStar color="#FFD800" fontSize="15px" />
        <IoIosStar color="#FFD800" fontSize="15px" />
      </div>
    );
  } else if (rating === 4) {
    return (
      <div>
        <IoIosStar color="#FFD800" fontSize="15px" />
        <IoIosStar color="#FFD800" fontSize="15px" />
        <IoIosStar color="#FFD800" fontSize="15px" />
        <IoIosStar color="#FFD800" fontSize="15px" />
        <IoIosStarOutline color="#FFD800" fontSize="15px" />
      </div>
    );
  } else if (rating === 3) {
    return (
      <div>
        <IoIosStar color="#FFD800" fontSize="15px" />
        <IoIosStar color="#FFD800" fontSize="15px" />
        <IoIosStar color="#FFD800" fontSize="15px" />
        <IoIosStarOutline color="#FFD800" fontSize="15px" />
        <IoIosStarOutline color="#FFD800" fontSize="15px" />
      </div>
    );
  } else if (rating === 2) {
    return (
      <div>
        <IoIosStar color="#FFD800" fontSize="15px" />
        <IoIosStar color="#FFD800" fontSize="15px" />
        <IoIosStarOutline color="#FFD800" fontSize="15px" />
        <IoIosStarOutline color="#FFD800" fontSize="15px" />
        <IoIosStarOutline color="#FFD800" fontSize="15px" />
      </div>
    );
  } else if (rating === 1) {
    return (
      <div>
        <IoIosStar color="#FFD800" fontSize="15px" />
        <IoIosStarOutline color="#FFD800" fontSize="15px" />
        <IoIosStarOutline color="#FFD800" fontSize="15px" />
        <IoIosStarOutline color="#FFD800" fontSize="15px" />

        <IoIosStarOutline color="#FFD800" fontSize="15px" />
      </div>
    );
  } else {
    return (
      <div>
        {' '}
        <IoIosStarOutline color="#FFD800" fontSize="15px" />
        <IoIosStarOutline color="#FFD800" fontSize="15px" />
        <IoIosStarOutline color="#FFD800" fontSize="15px" />
        <IoIosStarOutline color="#FFD800" fontSize="15px" />
        <IoIosStarOutline color="#FFD800" fontSize="15px" />
      </div>
    );
  }
};
