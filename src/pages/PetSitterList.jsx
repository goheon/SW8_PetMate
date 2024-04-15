import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LocationModal from '../components/petSitterList/LocationModal';
import TypeModal from '../components/petSitterList/TypeModal';
import PetSitterCard from '../components/petSitterList/PetSitterCard';
import { API_URL } from '../util/constants';
import './PetSitterList.scss';

function PetSitterList() {
    const [sittersList, setSittersList] = useState([]);
    const [filteredSitters, setFilteredSitters] = useState([]);
    const [activeModal, setActiveModal] = useState('');
    const [selectedLocation, setSelectLocation] = useState('지역');
    const [selectedType, setSelectedType] = useState('전체 🐶🐱');
    const [selectedSizes, setSelectedSizes] = useState(['소형견', '중형견', '대형견']);

    // 모달창(지역, 타입) 토글
    const toggleModal = (modalId) => {
        setActiveModal((preModal) => preModal === modalId ? '' : modalId);
    };

    const filterSitters = () => {
        let tempSitters = [...sittersList];

        // 지역 필터링
        if (selectedLocation !== '지역') {

            // "전체" 단어가 포함되어 있는지 확인하고, 있다면 해당 단어 앞 부분만 사용
            const locationFilter = selectedLocation.includes(' 전체')
                ? selectedLocation.split(' 전체')[0]
                : selectedLocation;

            tempSitters = tempSitters.filter(sitter => sitter.address.startsWith(locationFilter));
        }

        // 타입 필터링
        if (selectedType !== '전체 🐶🐱') {
            if (selectedType === '강아지') {
                tempSitters = tempSitters.filter(sitter => selectedSizes.every(size => sitter.type.includes(size)));
            } else if (selectedType === '고양이') {
                tempSitters = tempSitters.filter(sitter => sitter.type.includes('고양이'));
            }
        }
        setFilteredSitters(tempSitters);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_URL}/sitterslist`, {
                    method: 'GET',
                });
                const data = await response.json();
                setSittersList(data);
            } catch (error) {
                console.error('데이터를 불러오는 데 실패했습니다.', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        filterSitters();
    }, [selectedLocation, selectedType, selectedSizes, sittersList]);

    return (
        <>
            <section className="page-wrapper">
                <Header />

                <section className='search-bar'>
                    <div className='search-bar_inner'>
                        <div className='search_left'>
                            <div className='sl_button'>
                                <button
                                    className={`${activeModal === 'locationModal' ? 'selected-button' : ''} ${selectedLocation !== '지역' ? 'selected-location-button' : ''}`}
                                    onClick={() => toggleModal('locationModal')}>
                                    {selectedLocation}
                                </button>
                                {
                                    activeModal === 'locationModal' && <LocationModal setActiveModal={setActiveModal} setSelectLocation={setSelectLocation} />
                                }
                            </div>
                            <div className='sl_button'>
                                <button
                                    className={activeModal === 'typeModal' ? 'selected-button' : null}
                                    onClick={() => toggleModal('typeModal')}>
                                    {selectedType}
                                </button>
                                {
                                    activeModal === 'typeModal' && <TypeModal setActiveModal={setActiveModal} selectedType={selectedType}
                                        setSelectedType={setSelectedType} selectedSizes={selectedSizes} setSelectedSizes={setSelectedSizes} />
                                }
                            </div>
                        </div>
                    </div>
                </section>

                <section className='search-list'>
                    {
                        [...filteredSitters].reverse().map((sitter) => {
                            return (
                                <PetSitterCard key={sitter.sitterId} sitter={sitter} />
                            )
                        })
                    }
                </section>

                <Footer />
            </section>
        </>
    )
}

export default PetSitterList;