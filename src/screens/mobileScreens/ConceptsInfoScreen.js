import React from 'react';
import Header from '../../components/mobileComponents/HeaderM';

const ConceptsInfoScreen = ({ match }) => {
  return (
    <div>
      <Header pageName="home" />
      {match.params.conceptNum}번 사진이다.
    </div>
  );
};

export default ConceptsInfoScreen;
