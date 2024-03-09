import React from 'react';
import './MenuBar.css';
import MenuLogo from './MenuLogo';
import MenuBarName from './MenuBarName';
import MenuList from './MenuList';
import useMyStudio from '../../hooks/useMyStudio';

const MenuBar = ({ currentPage }) => {
  const { studio } = useMyStudio();

  return (
    <div className="menubar">
      <MenuLogo logo={studio.logoUrl} />
      <MenuBarName studioName={studio.name} />
      <MenuList currentPage={currentPage} />
    </div>
  );
};

export default MenuBar;
