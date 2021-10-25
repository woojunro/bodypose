import { useHistory } from 'react-router';
import './column-to-link.css';

const ColumnToLink = ({ toLink, toImg }) => {
  const history = useHistory();
  return (
    <div className="column-to-link">
      <img
        src={toImg}
        alt="toImg"
        onClick={() => {
          history.push({
            pathname: toLink,
            state: { previousPath: history.location.pathname },
          });
        }}
      />
    </div>
  );
};

export default ColumnToLink;
