import ColumnCardNews from './column-card-news';
import ColumnHtml from './column-html';
import './column-main.css';
import ColumnVideo from './column-video';
import ColumnEnding from './column-ending';
import ColumnToLink from './column-to-link';

const ColumnMain = ({ data }) => {
  //type에 따라서 렌더해주기.
  const RenderedMain = type => {
    if (type === 'html') {
      return <ColumnHtml data={data} />;
    } else if (type === 'card-news') {
      return <ColumnCardNews data={data} />;
    } else {
      return <ColumnVideo data={data} />;
    }
  };

  return (
    <div className="column-main">
      {RenderedMain(data.type)}
      {data.description && <div>{data.description}</div>}
      <div className="column-main-bottom">
        {data.toLink && (
          <ColumnToLink toLink={data.toLink} toImg={data.toLinkImg} />
        )}
        <ColumnEnding />
      </div>
    </div>
  );
};

export default ColumnMain;
