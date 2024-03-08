import './column-ending.css';
import BodyposeLogo from '../../../materials/로고 회색.png';

const ColumnEnding = () => {
  return (
    <div className="column-list-endmessage">
      <div className="column-list-logo">
        <img src={BodyposeLogo} alt="모든 글을 불러왔습니다." />
      </div>
    </div>
  );
};
export default ColumnEnding;
