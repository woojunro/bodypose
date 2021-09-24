import React, { useState, useEffect } from 'react';
import { IoIosSearch, IoIosCloseCircleOutline } from 'react-icons/io';
import { useReactiveVar } from '@apollo/client';
import { StudioLocationVar } from '../../../apollo';
import { STUDIO_LOCATION_OPTIONS } from './SortingOptions';

import './SearchBar.css';

export const SearchBar = ({ onSearchSubmit }) => {
  const location = useReactiveVar(StudioLocationVar);
  const [openSearch, setOpenSearch] = useState(false);
  const [term, setTerm] = useState('');

  useEffect(() => {
    if (!openSearch) {
      setTerm('');
    }
    const timeoutId = setTimeout(() => {
      onSearchSubmit(term);
    }, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [term, openSearch]);
  return (
    <div className="searchField">
      {openSearch ? (
        <span>
          <input
            className="searchInput"
            autoFocus={true}
            value={term}
            type="text"
            placeholder="이름으로 검색"
            onChange={e => setTerm(e.target.value)}
          />
          <IoIosCloseCircleOutline
            onClick={() => setTerm('')}
            className="closeIcon"
          />
        </span>
      ) : null}
      <div>
        <IoIosSearch
          onClick={() => {
            if (!location) StudioLocationVar(STUDIO_LOCATION_OPTIONS[0]);
            setOpenSearch(!openSearch);
          }}
          className="searchIcon"
        />
      </div>
    </div>
  );
};
