import React, { useState, useEffect } from 'react';
import { IoIosSearch, IoIosCloseCircleOutline } from 'react-icons/io';

import './SearchBar.css';

export const SearchBar = ({ onSearchSubmit }) => {
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
            placeholder="스튜디오 이름"
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
            setOpenSearch(!openSearch);
          }}
          className="searchIcon"
        />
      </div>
    </div>
  );
};
