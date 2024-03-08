export const MakingPickContainer = (pick, setPick) => {
  if (pick === 'studio') {
    return (
      <div className="pickContainer">
        <div className="pickedHeart">스튜디오</div>
        <div className="pickBar"> | </div>
        <div onClick={() => setPick('concept')} className="unpickedHeart">
          컨셉
        </div>
      </div>
    );
  } else {
    return (
      <div className="pickContainer">
        <div onClick={() => setPick('studio')} className="unpickedHeart">
          스튜디오
        </div>
        <div className="pickBar"> | </div>
        <div className="pickedHeart">컨셉</div>
      </div>
    );
  }
};
