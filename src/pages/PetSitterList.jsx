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

  console.log(filteredSitters);

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
