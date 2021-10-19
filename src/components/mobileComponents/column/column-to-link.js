import './column-to-link.css';

const ColumnToLink = ({ toLink, toImg }) => {
  return (
    <div className="column-to-link">
      <img
        src={toImg}
        alt="toImg"
        onClick={() => {
          window.open(toLink, '_blank');
        }}
      />
    </div>
  );
};

export default ColumnToLink;
