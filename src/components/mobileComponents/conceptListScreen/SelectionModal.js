import React, { useState } from 'react';
import './SelectionModal.css';
import { bgOptions, costumeOptions, objectOptions } from './SelectionOptions';

const Modal = ({
  isOpen,
  close,
  setSelection,
  selectedBgConcepts,
  selectedCostumeConcepts,
  selectedObjectConcepts,
}) => {
  const [totalSelected, setTotalSelected] = useState({
    bgConcept: selectedBgConcepts,
    costumeConcept: selectedCostumeConcepts,
    objectConcept: selectedObjectConcepts,
  });
  let BgOptions = bgOptions;
  let CostumeOptions = costumeOptions;
  let ObjectOptions = objectOptions;
  const setBgConcepts = (whatTo) => {
    setTotalSelected({
      bgConcept: whatTo,
      costumeConcept: totalSelected.costumeConcept,
      objectConcept: totalSelected.objectConcept,
    });
  };
  const setCostumeConcepts = (whatTo) => {
    setTotalSelected({
      costumeConcept: whatTo,
      bgConcept: totalSelected.bgConcept,
      objectConcept: totalSelected.objectConcept,
    });
  };
  const setObjectConcepts = (whatTo) => {
    setTotalSelected({
      objectConcept: whatTo,
      costumeConcept: totalSelected.costumeConcept,
      bgConcept: totalSelected.bgConcept,
    });
  };

  const addBgConcept = (option) => {
    if (option === 'total') {
      setBgConcepts(['total']);
    } else {
      if (totalSelected.bgConcept.includes('total')) {
        const filteredItems = totalSelected.bgConcept.filter(
          (BgConcepts) => BgConcepts !== 'total'
        );
        setBgConcepts([...filteredItems, option]);
      } else {
        setBgConcepts([...totalSelected.bgConcept, option]);
      }
    }
  };
  const deleteBgConcept = (option) => {
    if (totalSelected.bgConcept.includes(option)) {
      const valueToRemove = option;
      const filteredItems = totalSelected.bgConcept.filter(
        (BgConcepts) => BgConcepts !== valueToRemove
      );
      setBgConcepts(filteredItems);
    }
  };
  const addCostumeConcept = (option) => {
    if (option === 'total') {
      setCostumeConcepts(['total']);
    } else {
      if (totalSelected.costumeConcept.includes('total')) {
        const filteredItems = totalSelected.costumeConcept.filter(
          (CostumeConcepts) => CostumeConcepts !== 'total'
        );
        setCostumeConcepts([...filteredItems, option]);
      } else {
        setCostumeConcepts([...totalSelected.costumeConcept, option]);
      }
    }
  };
  const deleteCostumeConcept = (option) => {
    if (totalSelected.costumeConcept.includes(option)) {
      const valueToRemove = option;
      const filteredItems = totalSelected.costumeConcept.filter(
        (CostumeConcepts) => CostumeConcepts !== valueToRemove
      );
      setCostumeConcepts(filteredItems);
    }
  };
  const addObjectConcept = (option) => {
    if (option === 'total') {
      setObjectConcepts(['total']);
    } else {
      if (totalSelected.objectConcept.includes('total')) {
        const filteredItems = totalSelected.objectConcept.filter(
          (ObjectConcepts) => ObjectConcepts !== 'total'
        );
        setObjectConcepts([...filteredItems, option]);
      } else {
        setObjectConcepts([...totalSelected.objectConcept, option]);
      }
    }
  };
  const deleteObjectConcept = (option) => {
    if (totalSelected.objectConcept.includes(option)) {
      const valueToRemove = option;
      const filteredItems = totalSelected.objectConcept.filter(
        (ObjectConcepts) => ObjectConcepts !== valueToRemove
      );
      setObjectConcepts(filteredItems);
    }
  };
  // 옵션 선택 버튼들 생성.
  const renderedBgConcepts = BgOptions.map((option) => {
    if (totalSelected.bgConcept.includes(option.optionName)) {
      return (
        <div
          key={option.optionName}
          className="selectedOptionContainer"
          onClick={() => {
            deleteBgConcept(option.optionName);
          }}
        >
          {option.title}
        </div>
      );
    } else {
      return (
        <div
          key={option.optionName}
          className="unselectedOptionContainer"
          onClick={() => {
            addBgConcept(option.optionName);
          }}
        >
          {option.title}
        </div>
      );
    }
  });
  const renderedCostumeConcepts = CostumeOptions.map((option) => {
    if (totalSelected.costumeConcept.includes(option.optionName)) {
      return (
        <div
          key={option.optionName}
          className="selectedOptionContainer"
          onClick={() => {
            deleteCostumeConcept(option.optionName);
          }}
        >
          {option.title}
        </div>
      );
    } else {
      return (
        <div
          key={option.optionName}
          className="unselectedOptionContainer"
          onClick={() => {
            addCostumeConcept(option.optionName);
          }}
        >
          {option.title}
        </div>
      );
    }
  });
  const renderedObjectConcepts = ObjectOptions.map((option) => {
    if (totalSelected.objectConcept.includes(option.optionName)) {
      return (
        <div
          key={option.optionName}
          className="selectedOptionContainer"
          onClick={() => {
            deleteObjectConcept(option.optionName);
          }}
        >
          {option.title}
        </div>
      );
    } else {
      return (
        <div
          key={option.optionName}
          className="unselectedOptionContainer"
          onClick={() => {
            addObjectConcept(option.optionName);
          }}
        >
          {option.title}
        </div>
      );
    }
  });
  return (
    <>
      {isOpen ? (
        <div className="selectionModal">
          <div className="selectionGreyBackground">
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
                  className="selectCompleteButton"
                  onClick={() => {
                    setSelection(totalSelected);
                    setTimeout(() => {
                      close();
                    }, 100);
                  }}
                >
                  선택 완료
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
