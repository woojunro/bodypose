import './column-title.css';

const renderedCategory = category => {
  if (category === 'training') {
    return '트레이닝';
  } else if (category === 'nutrition') {
    return '식단';
  } else {
    return '촬영팁';
  }
};
const ColumnTitle = ({ data }) => {
  return (
    <>
      <div className="column-title-container">
        <div className="column-category">{renderedCategory(data.category)}</div>
        <div className="column-title">{data.title}</div>
      </div>
      <div className="column-writer-container">
        <div className="column-writer-data">
          {data.logo && <img src={data.logo} alt="logo" />}
          {data.writer && <div className="column-writer">{data.writer}</div>}
        </div>
        <div className="column-update-date">
          {data.updateDate && data.updateDate}
        </div>
      </div>
    </>
  );
};

export default ColumnTitle;
