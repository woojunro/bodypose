import ColumnListElement from '../column/column-list-element';
import './home-column-list.css';
import SemiTitle from './SemiTitle';

const HomeColumnList = ({ columns = [] }) => {
  const latestColumns = columns.slice(0, 2);

  const RenderedColumns = latestColumns.map(column => {
    return <ColumnListElement columnData={column} key={column.id} />;
  });
  return (
    <div className="mainContainer">
      <SemiTitle title="매거진" pageTo="/magazine" />
      {RenderedColumns}
    </div>
  );
};
export default HomeColumnList;
