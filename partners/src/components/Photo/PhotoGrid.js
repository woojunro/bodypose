import React from 'react';
import './PhotoGrid.css';

const PhotoGrid = ({ photos = [], loading = true, selectPhoto = id => {} }) => {
  const emptyGrids = [];
  for (let i = 0; i < 12 - photos.length; i++) {
    emptyGrids.push(`empty-grid-${i}`);
  }

  return (
    <div className="photoGrid">
      {loading ? (
        /* create arrays (length 12) and render loading elements */
        Array.apply(null, Array(12))
          .map((_, i) => i)
          .map(i => (
            <div className="photoGridElement" key={`photos-loading-${i}`} />
          ))
      ) : (
        <>
          {photos.map(photo => (
            <img
              className="photoGridElement photoGridClickableElement"
              key={photo.id}
              src={photo.thumbnailUrl}
              alt={`Portfolid id ${photo.id}`}
              onClick={() => selectPhoto(photo.id)}
            />
          ))}
          {emptyGrids.map(key => (
            <div className="photoGridElement photoGridEmptyElement" key={key} />
          ))}
        </>
      )}
    </div>
  );
};

export default PhotoGrid;
