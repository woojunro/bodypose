import { training_column_db } from '../../../virtualDB/column-db';
import ColumnListElement from '../column/column-list-element';
import './home-column-list.css';
import SemiTitle from './SemiTitle';

const HomeColumnList = () => {
  //최근 칼럼 2개 불러오기.
  const latestColumns = training_column_db.slice(0, 2);

  const RenderedColumns = latestColumns.map((column, idx) => {
    return <ColumnListElement columnData={column} />;
  });
  return (
    <div>
      <SemiTitle title="매거진" pageTo="/columns" />
      {RenderedColumns}
    </div>
  );
};
export default HomeColumnList;
