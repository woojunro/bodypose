import InfiniteScroll from 'react-infinite-scroll-component';
import LoadingIcon from '../conceptListScreen/LoadingIcon';
import ColumnListElement from './column-list-element';
import './column-list.css';
import ColumnEnding from './column-ending';

const ColumnList = ({ list = [], fetchMoreData, hasMore }) => {
  return list.length === 0 ? (
    <div className="column-list">
      <ColumnEnding />
    </div>
  ) : (
    <InfiniteScroll
      dataLength={list.length}
      next={fetchMoreData}
      hasMore={hasMore}
      loader={<LoadingIcon />}
      endMessage={<ColumnEnding />}
    >
      {list.map(data => {
        return <ColumnListElement columnData={data} key={data.id} />;
      })}
    </InfiniteScroll>
  );
};

export default ColumnList;
