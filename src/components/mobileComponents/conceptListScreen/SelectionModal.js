import React, { useState, useEffect } from 'react';
import './SelectionModal.css';
import { bgOptions, costumeOptions, objectOptions } from './SelectionOptions';
import OptionButton from './OptionButton';

const Modal = ({
  isOpen,
  close,
  setBgSelection,
  setCostumeSelection,
  setObjectSelection,
  selectedBgConcepts,
  selectedCostumeConcepts,
  selectedObjectConcepts,
}) => {
  const [BgConcepts, setBgConcepts] = useState(selectedBgConcepts);
  const [CostumeConcepts, setCostumeConcepts] = useState(
    selectedCostumeConcepts
  );
  const [ObjectConcepts, setObjectConcepts] = useState(selectedObjectConcepts);
  let BgOptions = bgOptions;
  let CostumeOptions = costumeOptions;
  let ObjectOptions = objectOptions;

  const addBgConcept = (option) => {
    var newArray = BgConcepts;
    newArray.push(option);
    setBgConcepts(newArray);
  };
  const deleteBgConcept = (option) => {
    if (BgConcepts.includes(option)) {
      const valueToRemove = option;
      const filteredItems = BgConcepts.filter(
        (BgConcepts) => BgConcepts !== valueToRemove
      );
      setBgConcepts(filteredItems);
    }
  };
  const addCostumeConcept = (option) => {
    var newArray = CostumeConcepts;
    newArray.push(option);
    setCostumeConcepts(newArray);
  };
  const deleteCostumeConcept = (option) => {
    if (CostumeConcepts.includes(option)) {
      const valueToRemove = option;
      const filteredItems = CostumeConcepts.filter(
        (CostumeConcepts) => CostumeConcepts !== valueToRemove
      );
      setCostumeConcepts(filteredItems);
    }
  };
  const addObjectConcept = (option) => {
    var newArray = ObjectConcepts;
    newArray.push(option);
    setObjectConcepts(newArray);
  };
  const deleteObjectConcept = (option) => {
    if (ObjectConcepts.includes(option)) {
      const valueToRemove = option;
      const filteredItems = ObjectConcepts.filter(
        (ObjectConcepts) => ObjectConcepts !== valueToRemove
      );
      setObjectConcepts(filteredItems);
    }
  };
  const checkBgTotal = (option) => {
    //Bg의 total을 선택한다면, 다른 것들 다 없애고 total만 넣기.

    if (option === 'total' && !BgConcepts.includes('total')) {
      console.log('2');
      setBgConcepts(['total']);
    }
  };

  const renderedBgConcepts = BgOptions.map((option) => {
    return (
      <OptionButton
        key={option.title}
        optionName={option.optionName}
        title={option.title}
        isSelected={BgConcepts.includes(option.optionName)}
        addSelection={addBgConcept}
        deleteSelection={deleteBgConcept}
        checkTotal={checkBgTotal}
      />
    );
  });
  const renderedCostumeConcepts = CostumeOptions.map((option) => {
    return (
      <OptionButton
        key={option.optionName}
        optionName={option.optionName}
        title={option.title}
        isSelected={CostumeConcepts.includes(option.optionName)}
        addSelection={addCostumeConcept}
        deleteSelection={deleteCostumeConcept}
      />
    );
  });
  const renderedObjectConcepts = ObjectOptions.map((option) => {
    return (
      <OptionButton
        key={option.optionName}
        optionName={option.optionName}
        title={option.title}
        isSelected={ObjectConcepts.includes(option.optionName)}
        addSelection={addObjectConcept}
        deleteSelection={deleteObjectConcept}
      />
    );
  });
  return (
    <>
      {isOpen ? (
        <div className="selectionModal">
          <div
            className="selectionGreyBackground"
            onClick={() => {
              close();
            }}
          >
            <div className="selectionTrueModal">
              <div
                className="selectionModalContents"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <div className="guideText">
                  * 선택한 카테고리들에 해당되는 사진들을 볼 수 있습니다.
                </div>
                <div>
                  <span className="conceptCategory">배경별</span>
                  <span className="multiSelectionGuide">(복수선택 가능)</span>
                </div>
                <div className="optionsContainer">{renderedBgConcepts}</div>
                <div>
                  <span className="conceptCategory">의상별</span>
                  <span className="multiSelectionGuide">(복수선택 가능)</span>
                </div>
                <div className="optionsContainer">
                  {renderedCostumeConcepts}
                </div>
                <div>
                  <span className="conceptCategory">도구별</span>
                  <span className="multiSelectionGuide">(복수선택 가능)</span>
                </div>
                <div className="optionsContainer">{renderedObjectConcepts}</div>
                <div
                  onClick={() => {
                    console.log(BgConcepts);
                    setBgSelection(BgConcepts);
                    setCostumeSelection(CostumeConcepts);
                    setObjectSelection(ObjectConcepts);
                    setTimeout(() => {
                      close();
                    }, 100);
                  }}
                >
                  선택완료
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Modal;
