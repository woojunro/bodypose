import './column-card-news.css';

const ColumnCardNews = ({ data }) => {
  const RenderedCardNews = data.cardNews.map((card, idx) => {
    return (
      <div className="card-news" key={idx}>
        <img src={card} alt="card news" />
      </div>
    );
  });

  return <div className="card-news-container">{RenderedCardNews}</div>;
};

export default ColumnCardNews;
