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
          <div className="container_left">
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
                    nostrud sit deserunt laborum proident. Consequat anim mollit nulla nulla labore pariatur
                    exercitation irure fugiat et culpa velit proident velit.
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
                      dolor exercitation. Duis consectetur sint sunt in esse velit aute mollit nulla eu et. Magna ad
                      nulla aliqua sint reprehenderit.
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
                    nostrud sit deserunt laborum proident. Consequat anim mollit nulla nulla labore pariatur
                    exercitation irure fugiat et culpa velit proident velit.
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
                      dolor exercitation. Duis consectetur sint sunt in esse velit aute mollit nulla eu et. Magna ad
                      nulla aliqua sint reprehenderit.
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="container_right">
            <div className="petsitter-info">
              <div className="petsitter_top">
                <div className="pt_img">
                  <img src={img} alt="" />
                </div>
                <div className="pt_detail">
                  <h4>{name} 펫시터</h4>
                  <p>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                      <path d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4l0 0 0 0 0 0 0 0 .3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z" />
                    </svg>
                    후기<span>210</span>개
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                      <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
                    </svg>
                    단골 고객 <span>145</span>명
                  </p>
                </div>
              </div>
              <div className="petsitter_mid">
                <ul>
                  {experience.map((info, i) => {
                    return (
                      <li key={i}>
                        <p>{info}</p>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="petsitter_btm">
                <p>
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
            <section className="reservation-section">
              <div className="reservation-card_inner">
                <InquiryWriteModal isOpen={isModalOpen} onClose={closeModal} name={name} />

                <form action="#" id="reservation" method="post" onSubmit={handleSubmit}>
                  <div>
                    <h6>언제 펫시터가 필요한가요?</h6>
                    <div className="date-time-select">
                      <p>시작일</p>
                      <div className="date-select">
                        <MyDatePicker className="start-date" type="start" />
                        <TimePicker className="start-time" type="start" />
                      </div>
                      <p>종료일</p>
                      <div className="time-select">
                        <MyDatePicker className="end-date" type="end" />
                        <TimePicker className="end-time" type="end" />
                      </div>
                    </div>
                  </div>

                  <div>
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

                      {selectedPetList.length > 0 ? (
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

                          <div className="pet-select_calculator">
                            <p>
                              총액: <span>{totalPrice.toLocaleString()}</span>원
                            </p>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div>
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
                  </div>

                  <div>
                    <button type="button" className="inquiryWrite" onClick={openModal}>
                      문의하기
                    </button>
                    <button type="submit">예약 요청</button>
                  </div>
                </form>
              </div>
              <div className="pet-select_price-list">
                <div className="pet-select_price-list_text">
                  <span>이용 요금</span>
                  <span>1시간</span>
                </div>
                <ul>
                  {hourlyRate.cat ? (
                    <li>
                      <div>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                          <path d="M320 192h17.1c22.1 38.3 63.5 64 110.9 64c11 0 21.8-1.4 32-4v4 32V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V339.2L280 448h56c17.7 0 32 14.3 32 32s-14.3 32-32 32H192c-53 0-96-43-96-96V192.5c0-16.1-12-29.8-28-31.8l-7.9-1c-17.5-2.2-30-18.2-27.8-35.7s18.2-30 35.7-27.8l7.9 1c48 6 84.1 46.8 84.1 95.3v85.3c34.4-51.7 93.2-85.8 160-85.8zm160 26.5v0c-10 3.5-20.8 5.5-32 5.5c-28.4 0-54-12.4-71.6-32h0c-3.7-4.1-7-8.5-9.9-13.2C357.3 164 352 146.6 352 128v0V32 12 10.7C352 4.8 356.7 .1 362.6 0h.2c3.3 0 6.4 1.6 8.4 4.2l0 .1L384 21.3l27.2 36.3L416 64h64l4.8-6.4L512 21.3 524.8 4.3l0-.1c2-2.6 5.1-4.2 8.4-4.2h.2C539.3 .1 544 4.8 544 10.7V12 32v96c0 17.3-4.6 33.6-12.6 47.6c-11.3 19.8-29.6 35.2-51.4 42.9zM432 128a16 16 0 1 0 -32 0 16 16 0 1 0 32 0zm48 16a16 16 0 1 0 0-32 16 16 0 1 0 0 32z" />
                        </svg>
                      </div>
                      <span>고양이</span> <span>{hourlyRate.cat.toLocaleString()} 원</span>
                    </li>
                  ) : undefined}
                  {hourlyRate.small ? (
                    <li>
                      <div>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                          <path d="M309.6 158.5L332.7 19.8C334.6 8.4 344.5 0 356.1 0c7.5 0 14.5 3.5 19 9.5L392 32h52.1c12.7 0 24.9 5.1 33.9 14.1L496 64h56c13.3 0 24 10.7 24 24v24c0 44.2-35.8 80-80 80H464 448 426.7l-5.1 30.5-112-64zM416 256.1L416 480c0 17.7-14.3 32-32 32H352c-17.7 0-32-14.3-32-32V364.8c-24 12.3-51.2 19.2-80 19.2s-56-6.9-80-19.2V480c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V249.8c-28.8-10.9-51.4-35.3-59.2-66.5L1 167.8c-4.3-17.1 6.1-34.5 23.3-38.8s34.5 6.1 38.8 23.3l3.9 15.5C70.5 182 83.3 192 98 192h30 16H303.8L416 256.1zM464 80a16 16 0 1 0 -32 0 16 16 0 1 0 32 0z" />
                        </svg>
                      </div>
                      <span>소형견</span> <span>7kg 미만</span> <span>{hourlyRate.small.toLocaleString()} 원</span>
                    </li>
                  ) : undefined}
                  {hourlyRate.medium ? (
                    <li>
                      <div>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                          <path d="M309.6 158.5L332.7 19.8C334.6 8.4 344.5 0 356.1 0c7.5 0 14.5 3.5 19 9.5L392 32h52.1c12.7 0 24.9 5.1 33.9 14.1L496 64h56c13.3 0 24 10.7 24 24v24c0 44.2-35.8 80-80 80H464 448 426.7l-5.1 30.5-112-64zM416 256.1L416 480c0 17.7-14.3 32-32 32H352c-17.7 0-32-14.3-32-32V364.8c-24 12.3-51.2 19.2-80 19.2s-56-6.9-80-19.2V480c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V249.8c-28.8-10.9-51.4-35.3-59.2-66.5L1 167.8c-4.3-17.1 6.1-34.5 23.3-38.8s34.5 6.1 38.8 23.3l3.9 15.5C70.5 182 83.3 192 98 192h30 16H303.8L416 256.1zM464 80a16 16 0 1 0 -32 0 16 16 0 1 0 32 0z" />
                        </svg>
                      </div>
                      <span>중형견</span> <span>7~14.9kg</span> <span>{hourlyRate.medium.toLocaleString()} 원</span>
                    </li>
                  ) : undefined}
                  {hourlyRate.large ? (
                    <li>
                      <div>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                          <path d="M309.6 158.5L332.7 19.8C334.6 8.4 344.5 0 356.1 0c7.5 0 14.5 3.5 19 9.5L392 32h52.1c12.7 0 24.9 5.1 33.9 14.1L496 64h56c13.3 0 24 10.7 24 24v24c0 44.2-35.8 80-80 80H464 448 426.7l-5.1 30.5-112-64zM416 256.1L416 480c0 17.7-14.3 32-32 32H352c-17.7 0-32-14.3-32-32V364.8c-24 12.3-51.2 19.2-80 19.2s-56-6.9-80-19.2V480c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V249.8c-28.8-10.9-51.4-35.3-59.2-66.5L1 167.8c-4.3-17.1 6.1-34.5 23.3-38.8s34.5 6.1 38.8 23.3l3.9 15.5C70.5 182 83.3 192 98 192h30 16H303.8L416 256.1zM464 80a16 16 0 1 0 -32 0 16 16 0 1 0 32 0z" />
                        </svg>
                      </div>
                      <span>대형견</span> <span>15kg 이상</span> <span>{hourlyRate.large.toLocaleString()} 원</span>
                    </li>
                  ) : undefined}
                </ul>
              </div>
            </section>
          </div>

          {/* <section className="pet-sitter-info-section">
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
          </section> */}
        </section>
        <Footer />
      </section>
    </>
  );
}

export default PetSitterInfo;
