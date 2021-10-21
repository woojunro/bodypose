import React from 'react';
import { useParams } from 'react-router';
import ColumnEnding from '../../../components/mobileComponents/column/column-ending';
import ColumnHeader from '../../../components/mobileComponents/column/column-header';
import ColumnMain from '../../../components/mobileComponents/column/column-main';
import ColumnShowMore from '../../../components/mobileComponents/column/column-show-more';
import ColumnTitle from '../../../components/mobileComponents/column/column-title';
import { training_column_db } from '../../../virtualDB/column-db';
import './column-screen.css';

const ColumnScreen = () => {
  const { columnId } = useParams();
  //id에 맞는 칼럼 불러오기.
  const columnData =
    columnId === '18'
      ? training_column_db[0]
      : columnId === '17'
      ? training_column_db[1]
      : training_column_db[2];

  return (
    <>
      <ColumnHeader />

      <div className="column-screen">
        <ColumnTitle data={columnData} />
        <ColumnMain data={columnData} />
        <ColumnEnding />
        <ColumnShowMore columnId={columnId} />
      </div>
    </>
  );
};

export default ColumnScreen;
