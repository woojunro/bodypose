import InfiniteScroll from 'react-infinite-scroll-component';
import LoadingIcon from '../conceptListScreen/LoadingIcon';
import ColumnListElement from './column-list-element';
import './column-list.css';
import BodyposeLogo from '../../../materials/로고 회색.png';
import ColumnEnding from './column-ending';

const ColumnList = ({ datas, fetchMoreData, hasMore }) => {
  return (
    <InfiniteScroll
      dataLength={datas?.length}
      next={fetchMoreData}
      hasMore={hasMore}
      loader={<LoadingIcon />}
      endMessage={<ColumnEnding />}
    >
      {datas.map(data => {
        return <ColumnListElement columnData={data} key={data.id} />;
      })}
    </InfiniteScroll>
  );
};

export default ColumnList;
