import React from 'react';
import './SeeMoreArrow.css';
import { HiArrowRight } from 'react-icons/hi';
import { useHistory } from 'react-router';
import { StudioLocationVar } from '../../../apollo';

const SeeMoreArrow = () => {
  const history = useHistory();
  return (
    <div
      className="seeMoreStudioArrowContainer"
      onClick={() => {
        StudioLocationVar(null);
        history.push('/studios');
      }}
    >
      <div className="seeMoreStudioMain">
        <HiArrowRight className="seeMoreStudioArrow" />
        <div>더보기</div>
      </div>
    </div>
  );
};

export default SeeMoreArrow;
