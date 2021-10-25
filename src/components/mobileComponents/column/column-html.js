import './column-html.css';

const ColumnHtml = ({ content }) => {
  return (
    <div className="ck-content" dangerouslySetInnerHTML={{ __html: content }} />
  );
};

export default ColumnHtml;
