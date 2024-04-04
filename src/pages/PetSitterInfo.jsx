import { useState, useRef, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './PetSitterInfo.scss';
import { Calendar, Time } from '../components/Calendar';

PetSitterInfo.defaultProps = {
  userId: 1,
  sitterId: 1,
  name: '이하은',
  img: 'https://dispatch.cdnser.be/cms-content/uploads/2020/10/22/bd74cb66-a4ef-4c57-9358-1cb0494d9dc2.jpg',
  review: 215,
  regularCustomer: 145,
  type: '강아지',
  location: '서울시 강서구',
  description:
    '안녕하세요! 저는 동물을 사랑하고 책임감을 가지고 행동하는 펫시터입니다. 애완동물의 행복과 안전을 최우선으로 생각하며, 신뢰할 수 있는 돌봄을 제공합니다. 견주와 반려동물 사이의 신뢰를 중요시하며 항상 최선을 다하겠습니다.',
  experience: [
    '펫시터 전문가 교육 수료',
    '전문 펫시터 자격증 보유',
    '펫시터 직업 훈련 교육 수료',
    '반려동물행동교정사 2급 자격증 보유',
    '강아지 반려 경험 (14년) 인증 완료',
    '고양이 반려 경험 (8년) 인증 완료',
  ],
  check: ['신원 인증', '인성 검사', '촬영 동의'],
  hourlyRate: 15000,
};

function PetSitterInfo({
  img,
  sitterId,
  name,
  type,
  location,
  review,
  regularCustomer,
  description,
  experience,
  check,
  hourlyRate,
}) {
  const petTypeRef = useRef();
  const petCountRef = useRef();

  const [selectedPetList, setSelectedpetList] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  function handleAdd(e) {
    e.preventDefault();
    e.stopPropagation();
    const type = petTypeRef.current.value;
    const count = petCountRef.current.value;
    type === '선택' || count === '선택' ? alert('맡기실 반려동물을 선택해주세요') : addBinder(type, count);
    petTypeRef.current.value = '선택';
    petCountRef.current.value = '선택';
  }

  const addBinder = (type, count) => {
    setSelectedpetList([...selectedPetList, [type, count]]);
    calculateTotalPrice('add', type, count);
  };

  function handleRemove(index) {
    const target = selectedPetList.filter((_, i) => i === index)[0];
    setSelectedpetList(selectedPetList.filter((_, i) => i !== index));
    const type = target[0];
    const count = target[1];
    calculateTotalPrice('remove', type, count);
  }

  function calculateTotalPrice(msg, type, count) {
    switch (msg) {
      case 'add':
        setTotalPrice(totalPrice + hourlyRate * count);
        break;
      case 'remove':
        setTotalPrice(totalPrice - hourlyRate * count);
        break;
      default:
        break;
    }
  }

  //펫시터의 시간당 가격 설정, 스타일링

  return (
    <>
      <Header />
      <section className="container">
        <section className="pet-sitter-info-section">
          <div className="pet-sitter-info-card">
            <div className="pet-sitter-info">
              <img src={img} alt="프로필 이미지" />
              <p className="sitterId">{sitterId}</p>
              <p className="name">{name} 님</p>
              <div className="info-text">
                <p className="type">{type} 펫시터</p>
                <p className="location">{location}</p>
                <span>리뷰 {review} 개</span>
                <span>단골고객 {regularCustomer} 명</span>
              </div>
              <h6>{name} 님을 소개합니다!</h6>
              <p className="description">{description}</p>
              <h6>{name} 님의 경력</h6>
              <ul className="experience">
                {experience.map((el, i) => (
                  <li key={i}>{el}</li>
                ))}
              </ul>
              <p className="check">
                {check.map((check, i) => {
                  return (
                    <span key={i}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                        <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                      </svg>
                      {check}
                    </span>
                  );
                })}
              </p>
            </div>
          </div>
        </section>
        <section className="reservation-section">
          <div className="reservation-card">
            <div className="reservation-card_inner">
              <form action="#" method="post" onSubmit={handleAdd}>
                <h6>언제 펫시터가 필요한가요?</h6>
                <div className="date-select">
                  <span>시작일</span>
                  <Calendar className="start-date" />
                  <span>종료일</span>
                  <Calendar className="end-date" />
                </div>
                <div className="time-select">
                  <span>시작 시간</span>
                  <Time className="start-time" />
                  <span>종료 시간</span>
                  <Time className="end-time" />
                </div>
                <h6>맡기시는 반려동물</h6>
                <div className="pet-select">
                  <select name="pet-type" ref={petTypeRef}>
                    {/* {type==='강아지' ? dogOption : type==='고양이' ? catOption : all} */}
                    <option default>선택</option>
                    <option value="small">소형 강아지</option>
                    <option value="medium">중형 강아지</option>
                    <option value="large">대형 강아지</option>
                  </select>
                  <select name="pet-count" ref={petCountRef}>
                    <option default>선택</option>
                    {Array(5)
                      .fill('')
                      .map((_, i) => (
                        <option key={i + 1}>{i + 1}</option>
                      ))}
                  </select>
                  <button type="button" onClick={handleAdd}>
                    추가
                  </button>
                  <div className="pet-list">
                    <ul>
                      {selectedPetList.map((el, i) => {
                        switch (el[0]) {
                          case 'small':
                            el[0] = '소형 강아지';
                            break;
                          case 'medium':
                            el[0] = '중형 강아지';
                            break;
                          case 'large':
                            el[0] = '대형 강아지';
                            break;
                          case 'cat':
                            el[0] = '고양이';
                            break;
                          default:
                            break;
                        }
                        if (el[0] === 'small') {
                          el[0] = '소형 강아지';
                        }
                        return (
                          <li key={i}>
                            {el[0]} {el[1]} 마리
                            <button onClick={() => handleRemove(i)}>X</button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <div className="calculator">
                    <p>총액: {totalPrice.toLocaleString()} 원</p>
                  </div>
                  {/* 펫시터 정보에서 type이 강아지인 경우 small, medium, large 가격 조회*/}
                  <div className="price-list">
                    <span>시간당 가격</span>
                    <ul>
                      <li>소형: {hourlyRate.toLocaleString()}</li>
                    </ul>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
        <section className="review-section">
          <h6>후기</h6>
        </section>
      </section>
      <Footer />
    </>
  );
}

export default PetSitterInfo;
