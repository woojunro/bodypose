import React, { useState, useEffect } from 'react';
import ColumnHeader from '../../../components/mobileComponents/column/column-header';
import ColumnNavigator from '../../../components/mobileComponents/column/column-navigator';
import './column-list-screen.css';

//가상 DB
import {
  nutrition_column_db,
  photo_column_db,
  training_column_db,
} from '../../../virtualDB/column-db';
import ColumnList from '../../../components/mobileComponents/column/column-list';

const ColumnListScreen = () => {
  const [columnCategory, setColumnCategory] = useState('training');
  const [columnData, setColumnData] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  //전체 칼럼 갯수 몇개인가.
  const [totalColumnCount, setTotalColumnCount] = useState();
  //뒤에 더 불러올 칼럼이 있으면 true 아니면 false
  const [isMoreColumns, setIsMoreColumns] = useState(false);

  //칼럼 5개 불러오는 함수.
  useEffect(() => {
    if (columnCategory === 'training') {
      setColumnData(training_column_db.slice(pageNum - 1, pageNum + 4));
    } else if (columnCategory === 'nutrition') {
      setColumnData(nutrition_column_db.slice(pageNum - 1, pageNum + 4));
    } else {
      setColumnData(photo_column_db.slice(pageNum - 1, pageNum + 3));
    }
  }, [columnCategory]);

  //칼럼 추가로 불러오는 함수.
  const FetchMoreData = () => {};

  return (
    <div>
      <ColumnHeader />
      <ColumnNavigator
        columnCategory={columnCategory}
        setColumnCategory={setColumnCategory}
      />
      <ColumnList
        datas={columnData}
        fetchMoreData={FetchMoreData}
        hasMore={isMoreColumns}
      />
    </div>
  );
};

export default ColumnListScreen;
