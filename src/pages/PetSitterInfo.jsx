import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getCookie, parseJwt } from '../util/constants';
import { MyDatePicker, TimePicker } from '../components/datepicker/DatePicker';
import InquiryWriteModal from '../components/petSitterInfo/InquiryWriteModal';
import './PetSitterInfo.scss';

// 리뷰(리뷰 수, 펫시터의 리뷰 목록), User(주소(활동범위)) 정보를 가져옴
PetSitterInfo.defaultProps = {
  userId: 1,
  sitterId: 1,
  name: '이하은',
  img: 'https://dispatch.cdnser.be/cms-content/uploads/2020/10/22/bd74cb66-a4ef-4c57-9358-1cb0494d9dc2.jpg',
  type: ['소형견', '중형견', '대형견', '고양이'],
  location: '서울시 강서구',
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
};
function PetSitterInfo({ img, sitterId, name, type, location, title, introduction, experience, check, hourlyRate }) {
  const petTypeRef = useRef();
  const petCountRef = useRef();
  const requestRef = useRef();
  const startDate = useSelector((state) => state.reservationStartDate.startDate);
  const endDate = useSelector((state) => state.reservationEndDate.endDate);
  const startTime = useSelector((state) => state.reservationStartTime.startTime);
  const endTime = useSelector((state) => state.reservationEndTime.endTime);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPetList, setSelectedpetList] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  //시간 변경을 감시
  useEffect(() => {
    calculateTotalPrice();
  }, [startDate, endDate, startTime, endTime]);

  //모달 상태 핸들링
  const openModal = () => {
    parseJwt(getCookie('jwt')).userId ? setIsModalOpen(true) : alert('로그인 후 이용해주세요.');
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // 추가 버튼의 이벤트 핸들링
  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const type = petTypeRef.current.value;
    const count = petCountRef.current.value;

    //시간 선택, 반려동물 선택 검증 후 추가
    startTime === endTime && startDate === endDate
      ? alert('시간을 올바르게 선택해주세요.')
      : type === '선택' || count === '선택'
      ? alert('맡기실 반려동물을 선택해주세요')
      : addBinder(type, count);
    petTypeRef.current.value = '선택';
    petCountRef.current.value = '선택';
  };

  // handleAdd의 삼항 연산자 사용을 위한 바인딩
  const addBinder = (type, count) => {
    setSelectedpetList([...selectedPetList, [type, count]]);
    calculateTotalPrice('add', type, count);
  };

  // 삭제 핸들링 함수
  const handleRemove = (index) => {
    const target = selectedPetList.filter((_, i) => i === index)[0];
    setSelectedpetList(selectedPetList.filter((_, i) => i !== index));
    const type = target[0];
    const count = target[1];
    calculateTotalPrice('remove', type, count);
  };

  const typeSetter = (type) => {
    switch (type) {
      case '소형견':
        type = 'small';
        break;
      case '중형견':
        type = 'medium';
        break;
      case '대형견':
        type = 'large';
        break;
      default:
        type = 'cat';
    }

    return type;
  };

  // 예약 카드 총액 계산
  const calculateTotalPrice = (msg, type, count) => {
    //시간 계산
    let hours;
    const differenceInMillis = Math.abs(new Date(startDate).getTime() - new Date(endDate).getTime());
    const differenceInHours = differenceInMillis / 1000 / 60 / 60;

    const startTimeHours = new Date(startTime).getHours();
    const endTimeHours = new Date(endTime).getHours();

    if (differenceInHours === 0) {
      hours = endTimeHours - startTimeHours;
    } else {
      if (endTimeHours > startTimeHours) {
        hours = differenceInHours + (endTimeHours - startTimeHours);
      } else {
        hours = differenceInHours + (24 - startTimeHours) + endTimeHours;
      }
    }
    //시간만 바뀌면 선택된 펫리스트를 순회해서 시간 반영된 가격을 계산해서 합친 걸로 재설정
    if (!msg || !type || !count) {
      let timeChangedPrice = 0;
      selectedPetList.forEach((el) => {
        let type = el[0];
        const count = el[1];

        type = typeSetter(type);

        timeChangedPrice += hourlyRate[type] * count * hours;
      });
      return setTotalPrice(timeChangedPrice);
    }

    type = typeSetter(type);

    switch (msg) {
      case 'add':
        setTotalPrice(totalPrice + hourlyRate[type] * count * hours);
        break;
      case 'remove':
        setTotalPrice(totalPrice - hourlyRate[type] * count * hours);
        break;
      default:
        setTotalPrice(totalPrice - hourlyRate[type] * count * hours);
        break;
    }
  };

  //펫시터 유저의 type에 따른 동적 옵션 추가
  const optionCheck = (type) => {
    const options = []; // 옵션을 저장할 배열 초기화

    // type 배열 내 확인 후, 해당하는 옵션 추가
    if (type.includes('소형견')) {
      options.push(
        <option key="small" value="소형견">
          소형견
        </option>,
      );
    }
    if (type.includes('중형견')) {
      options.push(
        <option key="medium" value="중형견">
          중형견
        </option>,
      );
    }
    if (type.includes('대형견')) {
      options.push(
        <option key="large" value="대형견">
          대형견
        </option>,
      );
    }
    if (type.includes('고양이')) {
      options.push(
        <option key="cat" value="고양이">
          고양이
        </option>,
      );
    }

    return options;
  };

  // 폼 제출시 handleSubmit으로 처리
  const handleSubmit = (e) => {
    e.preventDefault();

    //로그인 상태 확인
    const userId = parseJwt(getCookie('jwt')).userId;
    if (!userId) return alert('로그인 후 이용해주세요.');

    //요청사항
    const detailInfo = requestRef.current.value;

    //반려동물 목록
    let pets = [];
    selectedPetList.map((el) => {
      pets.push({ type: el[0], count: el[1] });
    });

    //시작일
    const formedStartDate = new Date(
      new Date(startDate).getFullYear(),
      new Date(startDate).getMonth(),
      new Date(startDate).getDate(),
      new Date(startTime).getHours(),
    );

    //종료일
    const formedEndDate = new Date(
      new Date(endDate).getFullYear(),
      new Date(endDate).getMonth(),
      new Date(endDate).getDate(),
      new Date(endTime).getHours(),
    );

    console.log(
      'pets: ',
      pets,
      'userId: ',
      userId,
      'sitterId: ',
      sitterId,
      'totalPrice: ',
      totalPrice,
      'detailInfo: ',
      detailInfo,
      'formedStartDate: ',
      formedStartDate,
      'formedEndDate: ',
      formedEndDate,
    );
  };

  return (
    <>
      <section className="page-wrapper">
        <Header />
        <section className="container">
          <section className="pet-sitter-info-section">
            <div className="pet-sitter-info-card_inner">
              <img src={img} alt="프로필 이미지" />
              <p className="name">{name} 펫시터</p>
              <div className="info-text">
                <p className="type">
                  {type.includes('소형견' || '중형견' || '대형견') ? '강아지, 고양이' : '고양이'} 펫시터
                </p>
                <p className="location">{location}</p>
              </div>
              <p className="title">" {title} "</p>

              <div className="introduction">
                <h6>{name} 님을 소개합니다!</h6>
                <p>{introduction}</p>
              </div>
              <div className="experience">
                <h6>{name} 님의 경력</h6>
                <ul>
                  {experience.map((el, i) => {
                    return <li key={i}>{el}</li>;
                  })}
                </ul>
              </div>
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
          </section>
          <section className="reservation-section">
            <div className="reservation-card_inner">
              <InquiryWriteModal isOpen={isModalOpen} onClose={closeModal} name={name} />
              <form action="#" id="reservation" method="post" onSubmit={handleSubmit}>
                <h6>언제 펫시터가 필요한가요?</h6>
                <div className="date-time-select">
                  <div className="date-select">
                    <span>시작일</span>
                    <MyDatePicker className="start-date" type="start" />
                    <span>종료일</span>
                    <MyDatePicker className="end-date" type="end" />
                  </div>
                  <div className="time-select">
                    <span>
                      시작
                      <br />
                      시간
                    </span>
                    <TimePicker className="start-time" type="start" />
                    <span>
                      종료
                      <br />
                      시간
                    </span>
                    <TimePicker className="end-time" type="end" />
                  </div>
                </div>
                <h6>맡기시는 반려동물</h6>
                <div className="pet-select">
                  <div className="pet-select_options">
                    <select name="pet-type" ref={petTypeRef}>
                      <option default>선택</option>
                      {optionCheck(type)}
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
                  </div>
                  <div className="pet-select_pet-list">
                    <ul>
                      {selectedPetList.map((el, i) => {
                        return (
                          <li key={i}>
                            {el[0]} {el[1]} 마리
                            <button onClick={() => handleRemove(i)}>X</button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <div className="pet-select_calculator">
                    <p>총액: {totalPrice.toLocaleString()} 원</p>
                  </div>
                  <div className="pet-select_price-list">
                    <div className="pet-select_price-list_text">
                      <span>이용 요금</span>
                      <span>1시간</span>
                    </div>
                    <ul>
                      {hourlyRate.cat ? (
                        <li>
                          <span>고양이</span> <span>{hourlyRate.cat.toLocaleString()} 원</span>
                        </li>
                      ) : undefined}
                      {hourlyRate.small ? (
                        <li>
                          <span>소형견</span> <span>{hourlyRate.small.toLocaleString()} 원</span>
                        </li>
                      ) : undefined}
                      {hourlyRate.medium ? (
                        <li>
                          <span>중형견</span> <span>{hourlyRate.medium.toLocaleString()} 원</span>
                        </li>
                      ) : undefined}
                      {hourlyRate.large ? (
                        <li>
                          <span>대형견</span> <span>{hourlyRate.large.toLocaleString()} 원</span>
                        </li>
                      ) : undefined}
                    </ul>
                  </div>
                </div>
                <h6>요청사항</h6>
                <div className="request">
                  <textarea
                    ref={requestRef}
                    name="request_text"
                    id=""
                    cols="30"
                    rows="10"
                    placeholder="펫시팅에 필요한 상세 내용을 적어주세요."
                  ></textarea>
                </div>
                <button type="button" className="inquiryWrite" onClick={openModal}>
                  문의하기
                </button>
                <button type="submit">예약 요청</button>
              </form>
            </div>
          </section>
          <section className="review-section">
            <div className="review-card_inner">
              <div className="review">
                <div className="review_user-profile">
                  <img
                    alt="user-img"
                    className="review_user-profile_img"
                    src="https://tmpfiles.nohat.cc/abstract-user-flat-3.svg"
                  />
                  <span className="review_user-profile_name">이고헌</span>
                </div>
                <p className="review_user-comment">
                  Pariatur mollit magna commodo qui culpa Lorem qui esse culpa minim nisi. Esse laboris reprehenderit
                  magna consectetur ullamco nisi sit. Eu ullamco ad elit cupidatat sint enim pariatur nostrud sit
                  nostrud sit deserunt laborum proident. Consequat anim mollit nulla nulla labore pariatur exercitation
                  irure fugiat et culpa velit proident velit.
                </p>
                <div className="review_images">
                  <img
                    alt="user-img"
                    className="review_user-profile_img"
                    src="https://tmpfiles.nohat.cc/abstract-user-flat-3.svg"
                  />
                  <img
                    alt="user-img"
                    className="review_user-profile_img"
                    src="https://tmpfiles.nohat.cc/abstract-user-flat-3.svg"
                  />
                </div>
                <div className="review_pet-sitter">
                  <div className="review_pet-sitter_profile">
                    <img
                      className="review_pet-sitter_img"
                      src="https://dispatch.cdnser.be/cms-content/uploads/2020/10/22/bd74cb66-a4ef-4c57-9358-1cb0494d9dc2.jpg"
                      alt="pet-siiter-img"
                    />
                    <span>{name}</span>
                  </div>
                  <div className="review_pet-siiter_comment">
                    Voluptate laboris incididunt elit quis sit fugiat. Quis id do consectetur non id do tempor esse
                    mollit et ullamco reprehenderit qui. Veniam nisi reprehenderit laborum non. Ad exercitation amet
                    dolor exercitation. Duis consectetur sint sunt in esse velit aute mollit nulla eu et. Magna ad nulla
                    aliqua sint reprehenderit.
                  </div>
                </div>
              </div>
              <div className="review">
                <div className="review_user-profile">
                  <img
                    alt="user-img"
                    className="review_user-profile_img"
                    src="https://tmpfiles.nohat.cc/abstract-user-flat-3.svg"
                  />
                  <span className="review_user-profile_name">이고헌</span>
                </div>
                <p className="review_user-comment">
                  Pariatur mollit magna commodo qui culpa Lorem qui esse culpa minim nisi. Esse laboris reprehenderit
                  magna consectetur ullamco nisi sit. Eu ullamco ad elit cupidatat sint enim pariatur nostrud sit
                  nostrud sit deserunt laborum proident. Consequat anim mollit nulla nulla labore pariatur exercitation
                  irure fugiat et culpa velit proident velit.
                </p>
                <div className="review_images">
                  <img
                    alt="user-img"
                    className="review_user-profile_img"
                    src="https://tmpfiles.nohat.cc/abstract-user-flat-3.svg"
                  />
                  <img
                    alt="user-img"
                    className="review_user-profile_img"
                    src="https://tmpfiles.nohat.cc/abstract-user-flat-3.svg"
                  />
                </div>
                <div className="review_pet-sitter">
                  <div className="review_pet-sitter_profile">
                    <img
                      className="review_pet-sitter_img"
                      src="https://dispatch.cdnser.be/cms-content/uploads/2020/10/22/bd74cb66-a4ef-4c57-9358-1cb0494d9dc2.jpg"
                      alt="pet-siiter-img"
                    />
                    <span>{name}</span>
                  </div>
                  <div className="review_pet-siiter_comment">
                    Voluptate laboris incididunt elit quis sit fugiat. Quis id do consectetur non id do tempor esse
                    mollit et ullamco reprehenderit qui. Veniam nisi reprehenderit laborum non. Ad exercitation amet
                    dolor exercitation. Duis consectetur sint sunt in esse velit aute mollit nulla eu et. Magna ad nulla
                    aliqua sint reprehenderit.
                  </div>
                </div>
              </div>
            </div>
          </section>
        </section>
        <Footer />
      </section>
    </>
  );
}

export default PetSitterInfo;
