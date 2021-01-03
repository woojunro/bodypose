import React, { Component } from 'react';
import './Modal.css';

class Modal extends Component {
  render() {
    const { isOpen, close } = this.props; //아까 버튼에서 props로 가져온것
    return (
      <>
        {isOpen ? (
          ////만약 isopen(this.state.isModalOpen)이 true일때 코드를 실행 false면  null
          /// <div onClick={close}> 회색 바탕을 누를시 모달이 꺼지게 만듬
          ////<div className="modalContents" onClick={(e) => e.stopPropagation()}>
          /// 이 범위의 이벤트는 상위로 전이 막음.

          <div className="modal">
            <div
              className="greyBackground"
              onClick={() => {
                close();
              }}
            >
              <div className="loginModal">
                <div
                  className="modalContents"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                ></div>
              </div>
            </div>
          </div>
        ) : null}
      </>
    );
  }
}

export default Modal;
