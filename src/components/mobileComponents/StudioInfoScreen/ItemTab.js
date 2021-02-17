import React, { useState } from 'react';
import './ItemTab.css';
import PhotoItem from './PhotoItem';
import HairMakeup from './HairMakeup';
import OptionProduct from './OptionProduct';

const ItemTab = ({ currentStudio, products }) => {
  const [isPhotoItemOpen, setIsPhotoItemOpen] = useState(true);
  const [isHairOpen, setIsHairOpen] = useState(false);
  const [isOptionOpen, setIsOptionOpen] = useState(false);

  return (
    <div className="itemTab">
      <div className="totalItemContainer">
        <PhotoItem
          currentStudio={currentStudio}
          products={products.studioProducts}
          isPhotoItemOpen={isPhotoItemOpen}
          setIsPhotoItemOpen={setIsPhotoItemOpen}
        />
        {/*
        <HairMakeup
          currentStudio={currentStudio}
          isHairOpen={isHairOpen}
          setIsHairOpen={setIsHairOpen}
        />
        <OptionProduct
          currentStudio={currentStudio}
          isOptionOpen={isOptionOpen}
          setIsOptionOpen={setIsOptionOpen}
        />
        */}
      </div>
    </div>
  );
};

export default ItemTab;
