import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LocationModal from '../components/petSitterList/LocationModal';
import TypeModal from '../components/petSitterList/TypeModal';
import PetSitterCard from '../components/petSitterList/PetSitterCard';
import { API_URL } from '../util/constants';
import './PetSitterList.scss';

function chunkArrayInGroups(arr, size) {
  // 결과 배열을 담을 변수 선언
  const result = [];

  // 주어진 배열을 순회하면서 size만큼의 요소들을 묶어서 결과 배열에 추가
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }

  return result;
}

function PetSitterList() {
  const [sittersData, setSittersData] = useState([]);
  const [filteredSitters, setFilteredSitters] = useState([]);
  const [activeModal, setActiveModal] = useState('');
  const [selectedLocation, setSelectLocation] = useState('지역');
  const [selectedType, setSelectedType] = useState('전체 🐶🐱');
  const [selectedSizes, setSelectedSizes] = useState(['소형견', '중형견', '대형견']);
  const [pageNation, setPageNation] = useState(0);

  // 모달창(지역, 타입) 토글
  const toggleModal = (modalId) => {
    setActiveModal((preModalId) => (preModalId === modalId ? '' : modalId));
  };

  const filterSitters = () => {
    let tempSitters = [...sittersData];
    setPageNation(0);

    // 지역 필터링
    if (selectedLocation !== '지역') {
      // "전체" 단어가 포함되어 있는지 확인하고, 있다면 해당 단어 앞 부분만 사용
      const locationFilter = selectedLocation.includes(' 전체') ? selectedLocation.split(' 전체')[0] : selectedLocation;

      tempSitters = tempSitters.filter((sitter) => sitter.address.startsWith(locationFilter));
    }

    // 타입 필터링
    if (selectedType !== '전체 🐶🐱') {
      if (selectedType === '강아지') {
        tempSitters = tempSitters.filter((sitter) => selectedSizes.every((size) => sitter.type.includes(size)));
      } else if (selectedType === '고양이') {
        tempSitters = tempSitters.filter((sitter) => sitter.type.includes('고양이'));
      }
    }

    tempSitters.reverse();
    tempSitters = chunkArrayInGroups(tempSitters, 5);

    setFilteredSitters(tempSitters);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/sitterslist`, {
          method: 'GET',
        });
        const data = await response.json();
        setSittersData(data);
      } catch (error) {
        console.error('데이터를 불러오는 데 실패했습니다.', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    filterSitters();
  }, [selectedLocation, selectedType, selectedSizes, sittersData]);

  return (
    <>
      <section className="page-wrapper">
        <Header />

        <section className="search-bar">
          <div className="search-bar_inner">
            <div className="search_left">
              <div className="sl_button">
                <button
                  className={`${activeModal === 'locationModal' ? 'selected-button' : ''} ${
                    selectedLocation !== '지역' ? 'selected-location-button' : ''
                  }`}
                  onClick={() => toggleModal('locationModal')}
                >
                  {selectedLocation}
                </button>
                {activeModal === 'locationModal' && (
                  <LocationModal setActiveModal={setActiveModal} setSelectLocation={setSelectLocation} />
                )}
              </div>
              <div className="sl_button">
                <button
                  className={activeModal === 'typeModal' ? 'selected-button' : null}
                  onClick={() => toggleModal('typeModal')}
                >
                  {selectedType}
                </button>
                {activeModal === 'typeModal' && (
                  <TypeModal
                    setActiveModal={setActiveModal}
                    selectedType={selectedType}
                    setSelectedType={setSelectedType}
                    selectedSizes={selectedSizes}
                    setSelectedSizes={setSelectedSizes}
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="search-list">
          {filteredSitters.length > 0 &&
            filteredSitters[pageNation].map((sitter) => {
              return <PetSitterCard key={sitter.sitterId} sitter={sitter} />;
            })}
          {/* {[...filteredSitters].reverse().map((sitter) => {
            return <PetSitterCard key={sitter.sitterId} sitter={sitter} />;
          })} */}

          {filteredSitters.length < 1 && (
            <div className="petsitter_null_box">
              <p className="petsitter_null_box-text">
                <svg
                  version="1.1"
                  id="Layer_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  x="0px"
                  y="0px"
                  width="70px"
                  height="70px"
                  viewBox="0 0 122.88 98.023"
                  enable-background="new 0 0 122.88 98.023"
                  xml:space="preserve"
                >
                  <g>
                    <path d="M58.268,81.725c-0.169-0.405-0.253-0.843-0.253-1.309c0-0.467,0.084-0.904,0.253-1.31c0.167-0.403,0.418-0.772,0.752-1.105 V78h0.001l0.001-0.001c0.333-0.333,0.703-0.585,1.105-0.753c0.406-0.168,0.843-0.253,1.31-0.253c0.47,0,0.908,0.085,1.315,0.253 c0.397,0.165,0.762,0.41,1.091,0.736c0.006,0.005,0.012,0.011,0.018,0.017c0.334,0.333,0.584,0.702,0.753,1.107 s0.254,0.843,0.254,1.31c0,0.466-0.085,0.903-0.254,1.309c-0.168,0.404-0.419,0.773-0.753,1.106 c-0.335,0.336-0.706,0.59-1.112,0.76c-0.405,0.169-0.843,0.255-1.312,0.255c-0.466,0-0.903-0.086-1.307-0.256 c-0.396-0.166-0.761-0.413-1.091-0.74c-0.006-0.005-0.012-0.011-0.019-0.018C58.687,82.499,58.436,82.13,58.268,81.725 L58.268,81.725z M63.44,5.113c-0.166-0.268-0.38-0.465-0.643-0.593c-0.336-0.164-0.789-0.245-1.358-0.245s-1.021,0.081-1.357,0.245 c-0.263,0.128-0.478,0.326-0.643,0.593c-0.015,0.024-0.03,0.048-0.046,0.071L5.731,89.359h0c-0.302,0.489-0.566,1.057-0.795,1.704 c-0.243,0.692-0.443,1.466-0.6,2.322c-0.023,0.125-0.04,0.246-0.05,0.362h114.307c-0.01-0.116-0.026-0.237-0.05-0.362 c-0.157-0.856-0.356-1.63-0.6-2.322c-0.229-0.647-0.493-1.215-0.795-1.704l-0.011-0.018L63.458,5.138L63.44,5.113L63.44,5.113 L63.44,5.113z M64.651,0.679c1.006,0.489,1.809,1.22,2.413,2.197v0l53.663,84.175c0.016,0.023,0.031,0.047,0.046,0.071 c0.468,0.756,0.865,1.602,1.195,2.539c0.314,0.893,0.569,1.878,0.768,2.956c0.097,0.52,0.144,0.98,0.144,1.385 c0,0.98-0.24,1.811-0.717,2.488c-0.549,0.779-1.327,1.264-2.33,1.449c-0.3,0.056-0.59,0.084-0.872,0.084H3.919 c-0.282,0-0.572-0.028-0.872-0.084c-1.003-0.186-1.782-0.67-2.33-1.449C0.241,95.813,0,94.982,0,94.002 c0-0.404,0.048-0.865,0.145-1.385c0.198-1.078,0.453-2.063,0.768-2.956c0.33-0.938,0.728-1.783,1.195-2.539l0.001,0.001 l0.016-0.026L55.805,2.894l0.011-0.018c0.604-0.977,1.407-1.708,2.413-2.197C59.162,0.226,60.231,0,61.44,0 C62.649,0,63.718,0.226,64.651,0.679L64.651,0.679z M63.563,72.619c-0.004,0.805-0.57,1.313-1.295,1.531 c-0.263,0.079-0.546,0.119-0.827,0.119s-0.564-0.04-0.828-0.119c-0.724-0.218-1.291-0.727-1.295-1.531l-2.72-35.558 c0-0.008-0.001-0.016-0.001-0.024l0,0c0-0.871,1.297-1.399,2.957-1.605c0.597-0.074,1.242-0.112,1.887-0.112 s1.29,0.038,1.887,0.112c1.66,0.207,2.956,0.735,2.956,1.605c0,0.015-0.001,0.028-0.002,0.042L63.563,72.619L63.563,72.619z" />
                  </g>
                </svg>
                <span>펫시터가 없습니다.</span>
              </p>
            </div>
          )}
        </section>
        {filteredSitters.length > 0 && (
          <div className="page-nation">
            <svg
              onClick={() => {
                setPageNation((current) => {
                  if (current > 0) {
                    return current - 1;
                  }
                  return current;
                });
              }}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M512 256A256 256 0 1 0 0 256a256 256 0 1 0 512 0zM271 135c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-87 87 87 87c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L167 273c-9.4-9.4-9.4-24.6 0-33.9L271 135z" />
            </svg>
            <ul>
              {filteredSitters.map((el, index) => {
                return (
                  <li className={pageNation === index ? 'on' : ''}>
                    <button
                      onClick={() => {
                        setPageNation(index);
                      }}
                    >
                      {index + 1}
                    </button>
                  </li>
                );
              })}
            </ul>
            <svg
              onClick={() => {
                setPageNation((current) => {
                  if (current < filteredSitters.length - 1) {
                    return current + 1;
                  }
                  return current;
                });
              }}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM241 377c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l87-87-87-87c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L345 239c9.4 9.4 9.4 24.6 0 33.9L241 377z" />
            </svg>
          </div>
        )}

        <Footer />
      </section>
    </>
  );
}

export default PetSitterList;
