import { useState } from 'react';
import './LocationModal.scss';

function LocationModal(props) {
    const LOCATIONS = [
        {
            city: '서울',
            details: ['서울 전체', '강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구',
                '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구',
                '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구']
        },
        {
            city: '경기',
            details: ['경기 전체', '가평군', '고양시', '과천시', '광명시', '광주시', '구리시', '군포시', '김포시', '남양주시',
                '동두천시', '부천시', '성남시', '수원시', '시흥시', '안산시', '안성시', '안양시', '양주시',
                '양평군', '여주시', '연천군', '오산시', '용인시', '의왕시', '의정부시', '이천시', '파주시',
                '평택시', '포천시', '하남시', '화성시']
        },
        {
            city: '인천',
            details: ['인천 전체', '계양구', '남동구', '동구', '미추홀구', '부평구', '서구', '연수구', '중구']
        },
        {
            city: '부산',
            details: ['강서구', '금정구', '기장군', '남구', '동구', '동래구', '부산진구', '북구', '사상구', '사하구', '서구',
                      '수영구', '연제구', '영도구', '중구', '해운대구']
        },
        {
            city: '대구',
            details: ['군위군', '남구', '달서구', '달성군', '동구', '북구', '서구', '수성구', '중구']
        },
        {
            city: '광주',
            details: ['광산구', '남구', '동구', '북구', '서구']
        },
        {
            city: '대전',
            details: ['대덕구', '동구', '서구', '유성구', '중구']
        },
        {
            city: '울산',
            details: ['남구', '동구', '북구', '울주군', '중구']
        },
    ];

    const [activeCity, setActiveCity] = useState('');

    const handleCityClick = (city) => {
        // 상위 리스트 토글
        setActiveCity((preCity) => preCity === city ? '' : city);
    };

    const handleDetailClick = (city, detail) => {
        detail === `${city} 전체` ? props.setSelectLocation(detail) : props.setSelectLocation(city + ' ' + detail);
        props.setActiveModal('');
    }

    return (
        <div className='location-modal'>
            <ul className='city-box'>
                {LOCATIONS.map((location) => (
                    <li key={location.city} className='city-list'>
                        <button className={activeCity === location.city ? 'selected-button' : null}
                            onClick={() => handleCityClick(location.city)}>
                            {location.city}
                        </button>

                        {location.details.length > 0 && activeCity === location.city && (
                            <ul className='detail-box'>
                                {location.details.map((detail) => (
                                    <li key={`${location.city}-${detail}`} className='detail-list'>
                                        <button
                                            onClick={() => handleDetailClick(location.city, detail)}>
                                            {detail}
                                        </button>
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

export default LocationModal;