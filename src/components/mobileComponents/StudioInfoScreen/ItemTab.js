import React, { useState } from 'react';
import './ItemTab.css';
import PhotoItem from './PhotoItem';
import HairMakeup from './HairMakeup';
import OptionProduct from './OptionProduct';

const ItemTab = ({ currentStudio, products }) => {
  const [isPhotoItemOpen, setIsPhotoItemOpen] = useState(true);
  const [isHairOpen, setIsHairOpen] = useState(true);
  const [isOptionOpen, setIsOptionOpen] = useState(true);

  return (
    <div className="itemTab">
      <div className="totalItemContainer">
        <PhotoItem
          currentStudio={currentStudio}
          products={products.studioProducts}
          isPhotoItemOpen={isPhotoItemOpen}
          setIsPhotoItemOpen={setIsPhotoItemOpen}
        />
        {products.hairMakeupShops && products.hairMakeupShops.length !== 0 && (
          <HairMakeup
            shops={products.hairMakeupShops}
            isHairOpen={isHairOpen}
            setIsHairOpen={setIsHairOpen}
          />
        )}
        {products.additionalProducts &&
          products.additionalProducts.length !== 0 && (
            <OptionProduct
              currentStudio={currentStudio}
              products={products.additionalProducts}
              isOptionOpen={isOptionOpen}
              setIsOptionOpen={setIsOptionOpen}
            />
          )}
      </div>
    </div>
  );
};

export default ItemTab;
