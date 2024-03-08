import React, { useState } from 'react';
import './ItemTab.css';
import PhotoItem from './PhotoItem';
import HairMakeup from './HairMakeup';
import OptionProduct from './OptionProduct';

const ItemTab = ({ currentStudio, products }) => {
  const [isPhotoItemOpen, setIsPhotoItemOpen] = useState(true);
  const [isHairOpen, setIsHairOpen] = useState(true);
  const [isOptionOpen, setIsOptionOpen] = useState(true);

  const { studioProducts, hairMakeupShops, additionalProducts } = products;

  return (
    <div className="itemTab">
      <div className="totalItemContainer">
        {studioProducts?.length > 0 && (
          <PhotoItem
            currentStudio={currentStudio}
            products={studioProducts}
            isPhotoItemOpen={isPhotoItemOpen}
            setIsPhotoItemOpen={setIsPhotoItemOpen}
          />
        )}
        {hairMakeupShops?.length > 0 && (
          <HairMakeup
            shops={hairMakeupShops}
            isHairOpen={isHairOpen}
            setIsHairOpen={setIsHairOpen}
          />
        )}
        {additionalProducts?.length > 0 && (
          <OptionProduct
            currentStudio={currentStudio}
            products={additionalProducts}
            isOptionOpen={isOptionOpen}
            setIsOptionOpen={setIsOptionOpen}
          />
        )}
      </div>
    </div>
  );
};

export default ItemTab;
