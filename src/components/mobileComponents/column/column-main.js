import ColumnHtml from './column-html';
import './column-main.css';
import ColumnToLink from './column-to-link';

const ColumnMain = ({ data }) => {
  return (
    <div className="column-main">
      <ColumnHtml data={data} />
      <div className="column-main-bottom">
        {/*여긴 쓸모 없으면 버리기 */}
        {/* {data.toLink && (
          <ColumnToLink toLink={data.toLink} toImg={data.toLinkImg} />
        )} */}
      </div>
    </div>
  );
};

export default ColumnMain;
