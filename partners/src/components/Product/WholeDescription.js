import React from 'react';
import AutoHeightTextarea from '../AutoHeightTextarea';
import Description from '../../materials/imgDescription/description.png';
import { HelpIcon } from '../help/help-icon';

const WholeDescription = ({
  productType = '',
  description = '',
  setDescription = (description = '') => {},
}) => (
  <div className="fullSizeBox">
    <div className="boxTitle">
      <div className="title-with-tootip">
        <div>{productType} 상품 설명</div>
        <HelpIcon img={Description} />
      </div>
    </div>
    <div style={{ padding: 20 }}>
      <AutoHeightTextarea value={description} setValue={setDescription} />
    </div>
  </div>
);

export default WholeDescription;
