import React from 'react';
import Select from 'react-select';

const textStyle = {
  fontSize: '14px',
  fontWeight: '600',
};

const BodyposeSelect = ({ options, currentOption, setCurrentOption }) => {
  return (
    <Select
      isSearchable={false}
      value={currentOption}
      onChange={value => setCurrentOption(value)}
      options={options}
      styles={{
        option: (provided, state) => ({
          ...provided,
          ...textStyle,
          backgroundColor: state.isSelected
            ? '#1c1c1c'
            : state.isFocused
            ? '#afafaf'
            : '#ffffff',
        }),
        control: base => ({
          ...base,
          borderColor: '#1c1c1c',
          '&:hover': {
            borderColor: '#1c1c1c',
          },
          boxShadow: 'none',
        }),
        singleValue: provided => ({
          ...provided,
          ...textStyle,
        }),
        menu: provided => ({ ...provided, zIndex: 10000 }),
      }}
    />
  );
};

export default BodyposeSelect;
