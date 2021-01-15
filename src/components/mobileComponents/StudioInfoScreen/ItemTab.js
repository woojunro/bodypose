import React from 'react';
import './ItemTab.css';
import { GetIndoorItem } from '../../functions/WithDb/StudioInfo';
import PhotoItem from './PhotoItem';

const ItemTab = ({ currentStudio }) => {
  return (
    <div className="totalItemContainer">
      <PhotoItem currentStudio={currentStudio} />
    </div>
  );
};

export default ItemTab;
