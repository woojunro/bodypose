import { useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { ALL_PHOTO_CONCEPTS_QUERY } from '../../../gql/queries/AllPhotoConceptsQuery';
import AppLoadingScreen from '../AppLoadingScreen';
import './SelectionModal.css';

const Modal = ({
  close,
  setSelection,
  selectedBgConcepts,
  selectedCostumeConcepts,
  selectedObjectConcepts,
  setPageList,
  setHasMore,
}) => {
  const [selectedConcepts, setSelectedConcepts] = useState({
    bgConcept: selectedBgConcepts,
    costumeConcept: selectedCostumeConcepts,
    objectConcept: selectedObjectConcepts,
  });
  const { data, loading } = useQuery(ALL_PHOTO_CONCEPTS_QUERY, {
    onError: () => {
      alert('오류가 발생하였습니다. 다시 시도해주세요.');
      window.location.reload();
    },
  });

  return (
    <>
      {!loading ? (
        <div className="selectionModal">
          <div className="selectionGreyBackground">
            <div className="selectionTrueModal">
              <div
                className="selectionModalContents"
                onClick={e => {
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
                <div className="optionsContainer">
                  <div
                    className={`${
                      selectedConcepts.bgConcept.length === 0 ? '' : 'un'
                    }selectedOptionContainer`}
                    onClick={() => {
                      setSelectedConcepts({
                        ...selectedConcepts,
                        bgConcept: [],
                      });
                    }}
                  >
                    전체
                  </div>
                  {data.allPhotoConcepts.backgroundConcepts.map(option => {
                    if (selectedConcepts.bgConcept.includes(option.slug)) {
                      return (
                        <div
                          key={`filter-${option.slug}`}
                          className="selectedOptionContainer"
                          onClick={() => {
                            const newBgConcept = selectedConcepts.bgConcept.filter(
                              bg => option.slug !== bg
                            );
                            setSelectedConcepts({
                              ...selectedConcepts,
                              bgConcept: newBgConcept,
                            });
                          }}
                        >
                          {option.name}
                        </div>
                      );
                    } else {
                      return (
                        <div
                          key={`filter-${option.slug}`}
                          className="unselectedOptionContainer"
                          onClick={() => {
                            setSelectedConcepts({
                              ...selectedConcepts,
                              bgConcept: [
                                ...selectedConcepts.bgConcept,
                                option.slug,
                              ],
                            });
                          }}
                        >
                          {option.name}
                        </div>
                      );
                    }
                  })}
                </div>
                <div>
                  <span className="conceptCategory">의상별</span>
                  <span className="multiSelectionGuide">(복수선택 가능)</span>
                </div>
                <div className="optionsContainer">
                  <div
                    className={`${
                      selectedConcepts.costumeConcept.length === 0 ? '' : 'un'
                    }selectedOptionContainer`}
                    onClick={() => {
                      setSelectedConcepts({
                        ...selectedConcepts,
                        costumeConcept: [],
                      });
                    }}
                  >
                    전체
                  </div>
                  {data.allPhotoConcepts.costumeConcepts.map(option => {
                    if (selectedConcepts.costumeConcept.includes(option.slug)) {
                      return (
                        <div
                          key={`filter-${option.slug}`}
                          className="selectedOptionContainer"
                          onClick={() => {
                            const newCosConcept = selectedConcepts.costumeConcept.filter(
                              cos => option.slug !== cos
                            );
                            setSelectedConcepts({
                              ...selectedConcepts,
                              costumeConcept: newCosConcept,
                            });
                          }}
                        >
                          {option.name}
                        </div>
                      );
                    } else {
                      return (
                        <div
                          key={`filter-${option.slug}`}
                          className="unselectedOptionContainer"
                          onClick={() => {
                            setSelectedConcepts({
                              ...selectedConcepts,
                              costumeConcept: [
                                ...selectedConcepts.costumeConcept,
                                option.slug,
                              ],
                            });
                          }}
                        >
                          {option.name}
                        </div>
                      );
                    }
                  })}
                </div>
                <div>
                  <span className="conceptCategory">도구별</span>
                  <span className="multiSelectionGuide">(복수선택 가능)</span>
                </div>
                <div className="optionsContainer">
                  <div
                    className={`${
                      selectedConcepts.objectConcept.length === 0 ? '' : 'un'
                    }selectedOptionContainer`}
                    onClick={() => {
                      setSelectedConcepts({
                        ...selectedConcepts,
                        objectConcept: [],
                      });
                    }}
                  >
                    전체
                  </div>
                  {data.allPhotoConcepts.objectConcepts.map(option => {
                    if (selectedConcepts.objectConcept.includes(option.slug)) {
                      return (
                        <div
                          key={`filter-${option.slug}`}
                          className="selectedOptionContainer"
                          onClick={() => {
                            const newObjConcept = selectedConcepts.objectConcept.filter(
                              obj => option.slug !== obj
                            );
                            setSelectedConcepts({
                              ...selectedConcepts,
                              objectConcept: newObjConcept,
                            });
                          }}
                        >
                          {option.name}
                        </div>
                      );
                    } else {
                      return (
                        <div
                          key={`filter-${option.slug}`}
                          className="unselectedOptionContainer"
                          onClick={() => {
                            setSelectedConcepts({
                              ...selectedConcepts,
                              objectConcept: [
                                ...selectedConcepts.objectConcept,
                                option.slug,
                              ],
                            });
                          }}
                        >
                          {option.name}
                        </div>
                      );
                    }
                  })}
                </div>
                <div
                  className="selectCompleteButton"
                  onClick={() => {
                    setSelection(selectedConcepts);
                    setPageList([1]);
                    setHasMore(true);
                    close();
                  }}
                >
                  선택 완료
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="selectionModal">
          <div className="selectionGreyBackground">
            <div className="selectionTrueModal">
              <AppLoadingScreen />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
