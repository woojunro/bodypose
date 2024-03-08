import { useHistory } from 'react-router';
import './column-to-studio.css';

const ColumnToStudio = ({ studioSlug }) => {
  const history = useHistory();
  return (
    <div className="column-to-studio">
      <div
        className="column-to-studio-button"
        onClick={() => {
          history.push({
            pathname: `/studios/${studioSlug}`,
            state: { previousPath: history.location.pathname },
          });
          window.scrollTo(0, 0);
        }}
      >
        스튜디오 정보 보기
      </div>
    </div>
  );
};

export default ColumnToStudio;
