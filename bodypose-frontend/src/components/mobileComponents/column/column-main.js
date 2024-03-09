import ColumnHtml from './column-html';
import './column-main.css';
import ColumnToStudio from './column-to-studio';

const ColumnMain = ({ data }) => {
  return (
    <div className="column-main">
      <ColumnHtml content={data?.content} />
      <div className="column-main-bottom">
        {/*data에 studioSlug 있으면 띄우기 */}
        {data?.author?.studioSlug && (
          <ColumnToStudio studioSlug={data?.author?.studioSlug} />
        )}
      </div>
    </div>
  );
};

export default ColumnMain;
