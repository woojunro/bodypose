import ColumnHtml from './column-html';
import './column-main.css';
import ColumnToStudio from './column-to-studio';

const ColumnMain = ({ data }) => {
  return (
    <div className="column-main">
      <ColumnHtml data={data} />
      <div className="column-main-bottom">
        {/*data에 studioSlug 있으면 띄우기 */}
        {data.studioSlug && <ColumnToStudio studioSlug={'wedidit'} />}
      </div>
    </div>
  );
};

export default ColumnMain;
