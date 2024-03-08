import { training_column_db } from '../../../virtualDB/column-db';
import ColumnListElement from './column-list-element';
import './column-show-more.css';

const ColumnShowMore = ({ columnId }) => {
  //가장 최근 칼럼 중에 columnId와 겹치지 않는 것만 3개 불러오기.
  const ShowMoreColumns = training_column_db.slice(1, 4);

  const RenderedShowMoreColumns = ShowMoreColumns.map((column, idx) => {
    return <ColumnListElement columnData={column} key={idx} />;
  });
  return (
    <div className="column-show-more">
      <div className="column-show-more-title">추천 컨텐츠</div>
      {RenderedShowMoreColumns}
    </div>
  );
};

export default ColumnShowMore;
