import React from 'react';
import './PhotoScreen.css';
import LoadingScreen from '../screens/LoadingScreen';
import PageTitle from '../components/PageTitle';
import AddPhoto from '../components/Photo/AddPhoto';
import PhotoList from '../components/Photo/PhotoList';
import Footer from '../components/Footer';
import { gql, useQuery } from '@apollo/client';

const GET_ALL_PHOTO_CONCEPTS = gql`
  query GetAllPhotoConcepts {
    allPhotoConcepts {
      backgroundConcepts {
        name
        slug
      }
      costumeConcepts {
        name
        slug
      }
      objectConcepts {
        name
        slug
      }
    }
  }
`;

const PhotoScreen = ({ currentUser }) => {
  const { data, loading } = useQuery(GET_ALL_PHOTO_CONCEPTS);

  return loading ? (
    <LoadingScreen />
  ) : (
    <div className="Dashboard">
      <div className="partnersMainPartContainer">
        <div className="partnersMainPart">
          <PageTitle title="포트폴리오 관리" />
          <AddPhoto concepts={data?.allPhotoConcepts} />
          <PhotoList />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default PhotoScreen;
