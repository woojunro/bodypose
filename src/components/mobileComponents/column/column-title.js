import './column-title.css';
import { formatDateToString } from '../../functions/formatDateToString';

const ColumnTitle = ({ data }) => {
  return (
    <>
      <div className="column-title-container">
        <div className="column-category">
          {(data?.categories || []).map(c => c.name).join(', ')}
        </div>
        <div className="column-title">{data?.title}</div>
      </div>
      <div className="column-writer-container">
        <div className="column-writer-data">
          <img src={data?.author?.logoUrl} alt="logo" />
          <div className="column-writer">{data?.author?.name}</div>
        </div>
        <div className="column-update-date">
          {formatDateToString(data?.createdAt)}
        </div>
      </div>
    </>
  );
};

export default ColumnTitle;
