import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './PetSitterList.scss';

function PetSitterList() {
    const petsitter = useState([1, 2]); // api 연결전 임시로 작성 (수정 예정)
    const [activeModal, setActiveModal] = useState(null);
    const [selectLocation, setSelectLocation] = useState('지역');
    const [selectType, setSelectType] = useState('전체 🐶🐱');

    const toggleModal = (modalId) => {
        if (activeModal === modalId) {
            setActiveModal(null);
        } else {
            setActiveModal(modalId);
        }
    };

    return (
        <>
            <Header />

            <section className='search-bar'>
                <div className='search-bar_inner'>
                    <div className='search_left'>
                        <div className='sl_button'>
                            <button
                                onClick={() => toggleModal('locationModal')}
                                style={{ border: activeModal === 'locationModal' ? '1px solid #632ed8' : null }}>
                                {selectLocation}
                            </button>
                            {
                                activeModal === 'locationModal' && <LocationModal />
                            }
                        </div>
                        <div className='sl_button'>
                            <button
                                onClick={() => toggleModal('typeModal')}
                                style={{ border: activeModal === 'typeModal' ? '1px solid #632ed8' : null }}>
                                {selectType}
                            </button>
                            {
                                activeModal === 'typeModal' && <TypeModal />
                            }
                        </div>
                    </div>
                </div>
            </section>

            <section className='search-list'>
                {
                    petsitter.map((el, i) => {
                        return (
                            <Petsitter />
                        )
                    })
                }
            </section>

            <Footer />

        </>
    )
}

function Petsitter(props) {
    return (
        <div className='search-list_inner'>
            <div className='search_wrap'>
                <div className='img-box'>
                    <img src='public/main02_review_01.jpg' />
                </div>
                <div className='text-box'>
                    <div className='text-box_top'>
                        <p>서울 강남구</p>
                        <h4>엘리스 펫시터</h4>
                    </div>
                    <div className='text-box_bottom'>
                        <div className='tb_left'>
                            <div className='tb_keyword'>
                                <span>강아지</span>
                                <span>대형견</span>
                                <span>중형견</span>
                                <span>소형견</span>
                            </div>
                            <div className='tb_review'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                    <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                    <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                    <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                    <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                    <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
                                </svg>
                                <p>후기 8개</p>
                            </div>
                        </div>
                        <div className='tb_right'>
                            <div className='tr_price'>
                                <p>₩60,000</p>
                                <div>
                                    <p>24시</p>
                                </div>
                            </div>
                            <div className='tr_price'>
                                <p>₩45,000</p>
                                <div>
                                    <p>당일</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function LocationModal() {
    const LOCATIONS = [
        {
            city: '서울특별시',
            details: ['서울 전체', '강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구',
                      '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구',
                      '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구']
        },
        {
            city: '경기도',
            details: []
        },
        {
            city: '인천광역시',
            details: []
        },
        {
            city: '부산광역시',
            details: []
        },
        {
            city: '대구광역시',
            details: []
        },
    ];
    return (
        <div className='location-modal'>
            <ul className='location-box'>
                {LOCATIONS.map((location, index) => (
                    <li key={index} className='location-list'>
                        <button>{location.city}</button>
                        {location.details.length > 0 && (
                            <ul className='location-detail-box'>
                                {location.details.map((detail, detailIndex) => (
                                    <li key={detailIndex} className='detail-list'>
                                        <button>{detail}</button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}

function TypeModal() {
    const TYPE = ['전체 🐶🐱', '강아지', '고양이'];
    const SIZE = ['소형견', '중형견', '대형견'];
    return (
        <div className='type-modal'>
            <div className='apply-box'>
                <p>반려동물 종류</p>
                <div className='apply-radio-box'>
                    {
                        TYPE.map((type, index) => {
                            return (
                                <div className='radio-box' key={index}>
                                    <label className='radio-label'>
                                        <input type="radio" name="radio" value={index} defaultChecked={index === 0} />
                                        <span>{type}</span>
                                    </label>
                                </div>
                            )
                        })
                    }
                </div>

                <div className='dog-checked'>
                    <p>강아지 크기</p>
                    <div className='apply-check-box'>
                        {
                            SIZE.map((size, index) => {
                                return (
                                    <div className='apply-check' key={index}>
                                        <label className='check-label'>
                                            <input type="checkbox" name="checkbox" defaultChecked='true' />
                                            <span>{size}</span>
                                        </label>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>

            <button className='reset-button'>초기화</button>
            <button className='apply-button'>적용하기</button>
        </div>
    )
}

export default PetSitterList;