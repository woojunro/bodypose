import { useState } from 'react';
import BottomAlertDialog from '../BottomAlertDialog';
import './column-low-menu.css';
import { IoShareOutline } from 'react-icons/io5';
import { IoMenuSharp } from 'react-icons/io5';
import { useHistory } from 'react-router';

const ColumnLowMenu = () => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const history = useHistory();

  const copyURLToClipboard = () => {
    const dummy = document.createElement('input');
    const text = window.location.href;
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand('copy');
    dummy.remove();
  };

  const onClickShare = () => {
    setIsAlertOpen(true);
    copyURLToClipboard();
  };

  const onClickMenu = () => {
    history.push('/magazine');
  };

  return (
    <>
      <div className="column-low-menu">
        <div className="column-low-menu-element">
          <IoMenuSharp
            className="column-low-menu-logo"
            onClick={() => onClickMenu()}
          />
          <div>목록으로</div>
        </div>
        <div className="column-low-menu-element" onClick={() => onClickShare()}>
          <IoShareOutline className="column-low-menu-logo" />
          <div>공유</div>
        </div>
      </div>
      <div style={{ height: '50px' }} />
      <BottomAlertDialog
        isOpen={isAlertOpen}
        setIsOpen={setIsAlertOpen}
        dialog="주소가 복사되었습니다."
      />
    </>
  );
};

export default ColumnLowMenu;
