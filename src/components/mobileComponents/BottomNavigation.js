import React from 'react';
import { Link } from 'react-router-dom';
import BookSelected from '../../materials/icons/book-selected.png';
import Book from '../../materials/icons/book.png';
import CameraSelected from '../../materials/icons/camera-selected.png';
import Camera from '../../materials/icons/camera.png';
import HeartSelected from '../../materials/icons/heart-selected.png';
import Heart from '../../materials/icons/heart.png';
import HomeSelected from '../../materials/icons/home-selected.png';
import Home from '../../materials/icons/home.png';
import UserSelected from '../../materials/icons/user-selected.png';
import User from '../../materials/icons/user.png';
import './BottomNavigation.css';

const BottomNavigation = ({ pageName }) => {
  const tabs = [
    {
      name: 'home',
      title: '홈',
      emptyIcon: Home,
      seletecdIcon: HomeSelected,
      pageTo: '/',
    },
    {
      name: 'studios',
      title: '스튜디오',

      emptyIcon: Camera,
      seletecdIcon: CameraSelected,
      pageTo: '/studios',
    },

    {
      name: 'concepts',
      title: '컨셉북',

      emptyIcon: Book,
      seletecdIcon: BookSelected,
      pageTo: '/concepts',
    },
    {
      name: 'hearts',
      title: '찜',

      emptyIcon: Heart,
      seletecdIcon: HeartSelected,
      pageTo: '/hearts',
    },

    {
      name: 'users',
      title: '내정보',

      emptyIcon: User,
      seletecdIcon: UserSelected,
      pageTo: '/users',
    },
  ];

  const renderedTabs = tabs.map(tab => {
    return (
      <li key={tab.name}>
        <Link
          to={tab.pageTo}
          style={{ textDecoration: 'none' }}
          onClick={() => window.scrollTo(0, 0)}
        >
          <div className="tabContainer">
            <img
              alt={tab.name}
              src={pageName === tab.name ? tab.seletecdIcon : tab.emptyIcon}
            />
            <div className="tabName">{tab.title}</div>
          </div>
        </Link>
      </li>
    );
  });
  return (
    <div>
      <div style={{ height: '52px' }} />
      <div className="bottomNavigation">
        <div className="navigationBox">
          <ul>{renderedTabs}</ul>
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;
