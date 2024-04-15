import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LocationModal from '../components/petSitterList/LocationModal';
import TypeModal from '../components/petSitterList/TypeModal';
import PetSitterCard from '../components/petSitterList/PetSitterCard';
import './PetSitterList.scss';

const data = [
    {
        userId: 1,
        sitterId: 1,
        name: '박진솔',
        img: 'https://dispatch.cdnser.be/cms-content/uploads/2020/10/22/bd74cb66-a4ef-4c57-9358-1cb0494d9dc2.jpg',
        type: ['소형견', '중형견', '대형견', '고양이'],
        location: '서울 강서구',
        title: '안전하고 편안하게 돌봐주는 펫시팅',
        introduction:
            '안녕하세요! 저는 동물을 사랑하고 책임감을 가지고 행동하는 펫시터입니다. 애완동물의 행복과 안전을 최우선으로 생각하며, 신뢰할 수 있는 돌봄을 제공합니다.',
        experience: [
            '펫시터 전문가 교육 수료',
            '전문 펫시터 자격증 보유',
            '펫시터 직업 훈련 교육 수료',
            '반려동물행동교정사 2급 자격증 보유',
            '강아지 반려 경험 (14년) 인증 완료',
            '고양이 반려 경험 (8년) 인증 완료',
        ],
        check: ['신원 인증', '인성 검사', '촬영 동의'],
        hourlyRate: { small: 15000, medium: 20000, large: 25000, cat: 10000 },
    },
    {
        userId: 2,
        sitterId: 2,
        name: '엘리스',
        img: 'https://dispatch.cdnser.be/cms-content/uploads/2020/10/22/bd74cb66-a4ef-4c57-9358-1cb0494d9dc2.jpg',
        type: ['소형견', '중형견'],
        location: '서울 동작구',
        title: '테스트 / 여기 제목들어감',
        introduction:
            '안녕하세요! 저는 동물을 사랑하고 책임감을 가지고 행동하는 펫시터입니다. 애완동물의 행복과 안전을 최우선으로 생각하며, 신뢰할 수 있는 돌봄을 제공합니다.',
        experience: [
            '펫시터 전문가 교육 수료',
            '전문 펫시터 자격증 보유',
            '펫시터 직업 훈련 교육 수료',
            '반려동물행동교정사 2급 자격증 보유',
            '강아지 반려 경험 (14년) 인증 완료',
            '고양이 반려 경험 (8년) 인증 완료',
        ],
        check: ['신원 인증', '인성 검사', '촬영 동의'],
        hourlyRate: { small: 15000, medium: 20000 },
    },
    {
        userId: 3,
        sitterId: 3,
        name: '이고헌',
        img: 'https://dispatch.cdnser.be/cms-content/uploads/2020/10/22/bd74cb66-a4ef-4c57-9358-1cb0494d9dc2.jpg',
        type: ['고양이'],
        location: '경기 고양시',
        title: '엘리스 펫시터 <- 보단 title 들어가는게 나은듯?',
        introduction:
            '안녕하세요! 저는 동물을 사랑하고 책임감을 가지고 행동하는 펫시터입니다. 애완동물의 행복과 안전을 최우선으로 생각하며, 신뢰할 수 있는 돌봄을 제공합니다.',
        experience: [
            '펫시터 전문가 교육 수료',
            '전문 펫시터 자격증 보유',
            '펫시터 직업 훈련 교육 수료',
            '반려동물행동교정사 2급 자격증 보유',
            '강아지 반려 경험 (14년) 인증 완료',
            '고양이 반려 경험 (8년) 인증 완료',
        ],
        check: ['신원 인증', '인성 검사', '촬영 동의'],
        hourlyRate: { cat: 15000 },
    },
];

function PetSitterList() {
    const [petsitter] = useState(data); // api 연결전 임시로 작성 (수정 예정)
    const [activeModal, setActiveModal] = useState('');
    const [selectedLocation, setSelectLocation] = useState('지역');
    const [selectedType, setSelectedType] = useState('전체 🐶🐱');
    const [selectedSizes, setSelectedSizes] = useState(['소형견', '중형견', '대형견']);

    // 모달창(지역, 타입) 토글
    const toggleModal = (modalId) => {
        setActiveModal((preModal) => preModal === modalId ? '' : modalId);
    };

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
                        petsitter.map((el, i) => {
                            return (
                                <PetSitterCard petsitter={petsitter[i]} />
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