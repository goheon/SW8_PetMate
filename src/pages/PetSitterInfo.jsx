import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { API_URL, cutAddressToDistrict, getCookie, parseJwt } from '../util/constants';
import { MyDatePicker, TimePicker } from '../components/datepicker/DatePicker';
import InquiryWriteModal from '../components/petSitterInfo/InquiryWriteModal';
import './PetSitterInfo.scss';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import Stars from '../components/Stars';
//펫시터 정보 가지구오기
async function getPetSitterInfo(sitterId) {
  try {
    const response = await fetch(`${API_URL}/orderSitter/${sitterId}`, {
      method: 'GET',
    });

    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();
    console.log(data);
    if (data) return data;
  } catch (error) {
    console.log('Error:', error);
  }
}

//리뷰 정보 가지구오기
async function getPetSitterReview(sitterId) {
  try {
    const response = await fetch(`${API_URL}/booklist/review/sitter/${sitterId}`, {
      method: 'GET',
    });

    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();

    if (data) return data;
  } catch (error) {
    console.log('Error:', error);
  }
}

//예약요청
async function postRequest(sitterId, data) {
  try {
    const response = await fetch(`${API_URL}/orderSitter/${sitterId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    if (!response.ok) throw new Error('Network response was not ok');
  } catch (error) {
    console.log('Error:', error);
  }
}

// 리뷰(리뷰 수, 펫시터의 리뷰 목록), User(주소(활동범위)) 정보를 가져옴
PetSitterInfo.defaultProps = {
  img: 'https://dispatch.cdnser.be/cms-content/uploads/2020/10/22/bd74cb66-a4ef-4c57-9358-1cb0494d9dc2.jpg',
  check: ['신원 인증', '인성 검사', '촬영 동의'],
};

function PetSitterInfo({ img, check }) {
  const nav = useNavigate();
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
  const { sitterId } = useParams(); //
  //펫시터 데이터
  const [petSitterData, setPetSitterData] = useState();
  const [petSitterReviewData, setPetSitterReviewData] = useState();

  useEffect(() => {
    getPetSitterInfo(sitterId).then((data) => {
      setPetSitterData(data);
    });
    getPetSitterReview(sitterId).then((data) => {
      setPetSitterReviewData(data.data);
    });
  }, []);

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

        timeChangedPrice += petSitterData.sitterInfo.hourlyRate[type] * count * hours;
      });
      return setTotalPrice(timeChangedPrice);
    }

    type = typeSetter(type);

    switch (msg) {
      case 'add':
        setTotalPrice(totalPrice + petSitterData.sitterInfo.hourlyRate[type] * count * hours);
        break;
      case 'remove':
        setTotalPrice(totalPrice - petSitterData.sitterInfo.hourlyRate[type] * count * hours);
        break;
      default:
        setTotalPrice(totalPrice - petSitterData.sitterInfo.hourlyRate[type] * count * hours);
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

    const data = {
      pets,
      totalPrice,
      detailInfo,
      startDate: formedStartDate,
      endDate: formedEndDate,
    };

    if (data.pets && data.totalPrice && data.startDate && data.endDate) {
      postRequest(sitterId, data).then((res) =>
        Swal.fire({
          title: '예약요청 완료',
          text: `예약요청이 완료되었습니다`,
          icon: 'success',
          customClass: { container: 'custom-popup' },
        }).then((result) => {
          nav('/mypage/reservation', { replace: true });
        }),
      );
    } else {
      Swal.fire({
        title: '예약요청 실패',
        text: `필수값을 입력하세요.`,
        icon: 'error',
        customClass: { container: 'custom-popup' },
      });
      console.log(data);
    }
  };

  if (!petSitterData) return <>로딩즁이거나 없는 펫시터 정보입니다</>;

  return (
    <>
      <section className="page-wrapper">
        <Header />
        <section className="container">
          <div className="container_left">
            <div className="pet-sitter-Introduction">
              <div className="pet-sitter-Introduction_img">
                <img src={petSitterData.sitterInfo.image[0]} alt="펫시터 대표이미지" />
              </div>
              <div className="pet-sitter-Introduction_title">
                <p>
                  {cutAddressToDistrict(petSitterData.value.address)} 펫시터 &middot; {petSitterData.value.username} 님
                </p>
                <h5>{petSitterData.sitterInfo.title}</h5>
                <div className="pet-sitter-Introduction_tag">
                  {petSitterData.sitterInfo.type.map((el, index) => {
                    return <span key={index}>#{el}</span>;
                  })}
                </div>
              </div>
              <div className="pet-sitter-Introduction_detail">
                <h5>{petSitterData.value.username} 펫시터님을 소개합니다</h5>
                <p>{petSitterData.sitterInfo.introduction}</p>
              </div>
              <div className="pet-sitter-Introduction_service">
                <h5>이용 가능 서비스</h5>
                <ul>
                  <li>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                      <path d="M226.5 92.9c14.3 42.9-.3 86.2-32.6 96.8s-70.1-15.6-84.4-58.5s.3-86.2 32.6-96.8s70.1 15.6 84.4 58.5zM100.4 198.6c18.9 32.4 14.3 70.1-10.2 84.1s-59.7-.9-78.5-33.3S-2.7 179.3 21.8 165.3s59.7 .9 78.5 33.3zM69.2 401.2C121.6 259.9 214.7 224 256 224s134.4 35.9 186.8 177.2c3.6 9.7 5.2 20.1 5.2 30.5v1.6c0 25.8-20.9 46.7-46.7 46.7c-11.5 0-22.9-1.4-34-4.2l-88-22c-15.3-3.8-31.3-3.8-46.6 0l-88 22c-11.1 2.8-22.5 4.2-34 4.2C84.9 480 64 459.1 64 433.3v-1.6c0-10.4 1.6-20.8 5.2-30.5zM421.8 282.7c-24.5-14-29.1-51.7-10.2-84.1s54-47.3 78.5-33.3s29.1 51.7 10.2 84.1s-54 47.3-78.5 33.3zM310.1 189.7c-32.3-10.6-46.9-53.9-32.6-96.8s52.1-69.1 84.4-58.5s46.9 53.9 32.6 96.8s-52.1 69.1-84.4 58.5z" />
                    </svg>
                    <div>
                      <strong>퍼피 산책케어</strong>
                      <p>1년 미만 퍼피 가능</p>
                    </div>
                  </li>
                  <li>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                      <path d="M416 0C352.3 0 256 32 256 32V160c48 0 76 16 104 32s56 32 104 32c56.4 0 176-16 176-96S512 0 416 0zM128 96c0 35.3 28.7 64 64 64h32V32H192c-35.3 0-64 28.7-64 64zM288 512c96 0 224-48 224-128s-119.6-96-176-96c-48 0-76 16-104 32s-56 32-104 32V480s96.3 32 160 32zM0 416c0 35.3 28.7 64 64 64H96V352H64c-35.3 0-64 28.7-64 64z" />
                    </svg>
                    <div>
                      <strong>매일 산책</strong>
                      <p>산책 및 실외 배변 가능</p>
                    </div>
                  </li>
                  <li>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                      <path d="M290.8 48.6l78.4 29.7L288 109.5 206.8 78.3l78.4-29.7c1.8-.7 3.8-.7 5.7 0zM136 92.5V204.7c-1.3 .4-2.6 .8-3.9 1.3l-96 36.4C14.4 250.6 0 271.5 0 294.7V413.9c0 22.2 13.1 42.3 33.5 51.3l96 42.2c14.4 6.3 30.7 6.3 45.1 0L288 457.5l113.5 49.9c14.4 6.3 30.7 6.3 45.1 0l96-42.2c20.3-8.9 33.5-29.1 33.5-51.3V294.7c0-23.3-14.4-44.1-36.1-52.4l-96-36.4c-1.3-.5-2.6-.9-3.9-1.3V92.5c0-23.3-14.4-44.1-36.1-52.4l-96-36.4c-12.8-4.8-26.9-4.8-39.7 0l-96 36.4C150.4 48.4 136 69.3 136 92.5zM392 210.6l-82.4 31.2V152.6L392 121v89.6zM154.8 250.9l78.4 29.7L152 311.7 70.8 280.6l78.4-29.7c1.8-.7 3.8-.7 5.7 0zm18.8 204.4V354.8L256 323.2v95.9l-82.4 36.2zM421.2 250.9c1.8-.7 3.8-.7 5.7 0l78.4 29.7L424 311.7l-81.2-31.1 78.4-29.7zM523.2 421.2l-77.6 34.1V354.8L528 323.2v90.7c0 3.2-1.9 6-4.8 7.3z" />
                    </svg>
                    <div>
                      <strong>실내 놀이</strong>
                      <p>터그놀이, 노즈워크 등</p>
                    </div>
                  </li>
                  <li>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                      <path d="M192 48c0-26.5 21.5-48 48-48H400c26.5 0 48 21.5 48 48V512H368V432c0-26.5-21.5-48-48-48s-48 21.5-48 48v80H192V48zM48 96H160V512H48c-26.5 0-48-21.5-48-48V320H80c8.8 0 16-7.2 16-16s-7.2-16-16-16H0V224H80c8.8 0 16-7.2 16-16s-7.2-16-16-16H0V144c0-26.5 21.5-48 48-48zm544 0c26.5 0 48 21.5 48 48v48H560c-8.8 0-16 7.2-16 16s7.2 16 16 16h80v64H560c-8.8 0-16 7.2-16 16s7.2 16 16 16h80V464c0 26.5-21.5 48-48 48H480V96H592zM312 64c-8.8 0-16 7.2-16 16v24H272c-8.8 0-16 7.2-16 16v16c0 8.8 7.2 16 16 16h24v24c0 8.8 7.2 16 16 16h16c8.8 0 16-7.2 16-16V152h24c8.8 0 16-7.2 16-16V120c0-8.8-7.2-16-16-16H344V80c0-8.8-7.2-16-16-16H312z" />
                    </svg>
                    <div>
                      <strong>응급 처치</strong>
                      <p>응급 상황 시 병원 이동 가능</p>
                    </div>
                  </li>
                  <li>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                      <path d="M112 96c-26.5 0-48 21.5-48 48V256h96V144c0-26.5-21.5-48-48-48zM0 144C0 82.1 50.1 32 112 32s112 50.1 112 112V368c0 61.9-50.1 112-112 112S0 429.9 0 368V144zM554.9 399.4c-7.1 12.3-23.7 13.1-33.8 3.1L333.5 214.9c-10-10-9.3-26.7 3.1-33.8C360 167.7 387.1 160 416 160c88.4 0 160 71.6 160 160c0 28.9-7.7 56-21.1 79.4zm-59.5 59.5C472 472.3 444.9 480 416 480c-88.4 0-160-71.6-160-160c0-28.9 7.7-56 21.1-79.4c7.1-12.3 23.7-13.1 33.8-3.1L498.5 425.1c10 10 9.3 26.7-3.1 33.8z" />
                    </svg>
                    <div>
                      <strong>약물 복용</strong>
                      <p>경구(입) 약물 복용 가능</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <section className="review-section">
              <div className="review-card_inner">
                {petSitterReviewData.map((el) => {
                  return (
                    <div key={el._id} className="review">
                      <div className="review_user-profile">
                        <img
                          alt="user-img"
                          className="review_user-profile_img"
                          src="https://tmpfiles.nohat.cc/abstract-user-flat-3.svg"
                        />
                        <div>
                          <span className="review_user-profile_name">{el.username}</span>
                          <Stars rating={el.starRate} />
                        </div>
                      </div>
                      <h5 className="review_title">{el.title}</h5>
                      <p className="review_user-comment">{el.comment}</p>
                      {el.image.length > 0 ? (
                        <div className="review_images">
                          {el.image.map((el) => (
                            <img alt="user-img" className="review_user-profile_img" src={`${el}`} />
                          ))}
                        </div>
                      ) : null}

                      {/* <div className="review_pet-sitter">
                        <div className="review_pet-sitter_profile">
                          <img
                            className="review_pet-sitter_img"
                            src="https://dispatch.cdnser.be/cms-content/uploads/2020/10/22/bd74cb66-a4ef-4c57-9358-1cb0494d9dc2.jpg"
                            alt="pet-siiter-img"
                          />
                          <span>{petSitterData.value.username}</span>
                        </div>
                        <div className="review_pet-siiter_comment">
                          Voluptate laboris incididunt elit quis sit fugiat. Quis id do consectetur non id do tempor
                          esse mollit et ullamco reprehenderit qui. Veniam nisi reprehenderit laborum non. Ad
                          exercitation amet dolor exercitation. Duis consectetur sint sunt in esse velit aute mollit
                          nulla eu et. Magna ad nulla aliqua sint reprehenderit.
                        </div>
                      </div> */}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          <div className="container_right">
            <div className="petsitter-info">
              <div className="petsitter_top">
                <div className="pt_img">
                  <img src={petSitterData.value.image[0]} alt="" />
                </div>
                <div className="pt_detail">
                  <h4>{petSitterData.value.username} 펫시터</h4>
                  <p>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                      <path d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4l0 0 0 0 0 0 0 0 .3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z" />
                    </svg>
                    후기<span>{petSitterReviewData.length}</span>개
                    {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                      <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
                    </svg>
                    단골 고객 <span>145</span>명 */}
                  </p>
                </div>
              </div>
              <div className="petsitter_mid">
                <ul>
                  {petSitterData.sitterInfo.experience.map((info, i) => {
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
                <InquiryWriteModal isOpen={isModalOpen} onClose={closeModal} name={petSitterData.value.username} />

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
                          {optionCheck(petSitterData.sitterInfo.type)}
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
                    {/* <button type="button" className="inquiryWrite" onClick={openModal}>
                      문의하기
                    </button> */}
                    <button className="request-btn" type="submit">
                      예약 요청
                    </button>
                  </div>
                </form>
              </div>
              <div className="pet-select_price-list">
                <div className="pet-select_price-list_text">
                  <span>이용 요금</span>
                  <span>1시간</span>
                </div>
                <ul>
                  {petSitterData.sitterInfo.hourlyRate.cat ? (
                    <li>
                      <div>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                          <path d="M320 192h17.1c22.1 38.3 63.5 64 110.9 64c11 0 21.8-1.4 32-4v4 32V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V339.2L280 448h56c17.7 0 32 14.3 32 32s-14.3 32-32 32H192c-53 0-96-43-96-96V192.5c0-16.1-12-29.8-28-31.8l-7.9-1c-17.5-2.2-30-18.2-27.8-35.7s18.2-30 35.7-27.8l7.9 1c48 6 84.1 46.8 84.1 95.3v85.3c34.4-51.7 93.2-85.8 160-85.8zm160 26.5v0c-10 3.5-20.8 5.5-32 5.5c-28.4 0-54-12.4-71.6-32h0c-3.7-4.1-7-8.5-9.9-13.2C357.3 164 352 146.6 352 128v0V32 12 10.7C352 4.8 356.7 .1 362.6 0h.2c3.3 0 6.4 1.6 8.4 4.2l0 .1L384 21.3l27.2 36.3L416 64h64l4.8-6.4L512 21.3 524.8 4.3l0-.1c2-2.6 5.1-4.2 8.4-4.2h.2C539.3 .1 544 4.8 544 10.7V12 32v96c0 17.3-4.6 33.6-12.6 47.6c-11.3 19.8-29.6 35.2-51.4 42.9zM432 128a16 16 0 1 0 -32 0 16 16 0 1 0 32 0zm48 16a16 16 0 1 0 0-32 16 16 0 1 0 0 32z" />
                        </svg>
                      </div>
                      <span>고양이</span> <span>{petSitterData.sitterInfo.hourlyRate.cat.toLocaleString()} 원</span>
                    </li>
                  ) : undefined}
                  {petSitterData.sitterInfo.hourlyRate.small ? (
                    <li>
                      <div>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                          <path d="M309.6 158.5L332.7 19.8C334.6 8.4 344.5 0 356.1 0c7.5 0 14.5 3.5 19 9.5L392 32h52.1c12.7 0 24.9 5.1 33.9 14.1L496 64h56c13.3 0 24 10.7 24 24v24c0 44.2-35.8 80-80 80H464 448 426.7l-5.1 30.5-112-64zM416 256.1L416 480c0 17.7-14.3 32-32 32H352c-17.7 0-32-14.3-32-32V364.8c-24 12.3-51.2 19.2-80 19.2s-56-6.9-80-19.2V480c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V249.8c-28.8-10.9-51.4-35.3-59.2-66.5L1 167.8c-4.3-17.1 6.1-34.5 23.3-38.8s34.5 6.1 38.8 23.3l3.9 15.5C70.5 182 83.3 192 98 192h30 16H303.8L416 256.1zM464 80a16 16 0 1 0 -32 0 16 16 0 1 0 32 0z" />
                        </svg>
                      </div>
                      <span>소형견</span> <span>7kg 미만</span>{' '}
                      <span>{petSitterData.sitterInfo.hourlyRate.small.toLocaleString()} 원</span>
                    </li>
                  ) : undefined}
                  {petSitterData.sitterInfo.hourlyRate.medium ? (
                    <li>
                      <div>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                          <path d="M309.6 158.5L332.7 19.8C334.6 8.4 344.5 0 356.1 0c7.5 0 14.5 3.5 19 9.5L392 32h52.1c12.7 0 24.9 5.1 33.9 14.1L496 64h56c13.3 0 24 10.7 24 24v24c0 44.2-35.8 80-80 80H464 448 426.7l-5.1 30.5-112-64zM416 256.1L416 480c0 17.7-14.3 32-32 32H352c-17.7 0-32-14.3-32-32V364.8c-24 12.3-51.2 19.2-80 19.2s-56-6.9-80-19.2V480c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V249.8c-28.8-10.9-51.4-35.3-59.2-66.5L1 167.8c-4.3-17.1 6.1-34.5 23.3-38.8s34.5 6.1 38.8 23.3l3.9 15.5C70.5 182 83.3 192 98 192h30 16H303.8L416 256.1zM464 80a16 16 0 1 0 -32 0 16 16 0 1 0 32 0z" />
                        </svg>
                      </div>
                      <span>중형견</span> <span>7~14.9kg</span>{' '}
                      <span>{petSitterData.sitterInfo.hourlyRate.medium.toLocaleString()} 원</span>
                    </li>
                  ) : undefined}
                  {petSitterData.sitterInfo.hourlyRate.large ? (
                    <li>
                      <div>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                          <path d="M309.6 158.5L332.7 19.8C334.6 8.4 344.5 0 356.1 0c7.5 0 14.5 3.5 19 9.5L392 32h52.1c12.7 0 24.9 5.1 33.9 14.1L496 64h56c13.3 0 24 10.7 24 24v24c0 44.2-35.8 80-80 80H464 448 426.7l-5.1 30.5-112-64zM416 256.1L416 480c0 17.7-14.3 32-32 32H352c-17.7 0-32-14.3-32-32V364.8c-24 12.3-51.2 19.2-80 19.2s-56-6.9-80-19.2V480c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V249.8c-28.8-10.9-51.4-35.3-59.2-66.5L1 167.8c-4.3-17.1 6.1-34.5 23.3-38.8s34.5 6.1 38.8 23.3l3.9 15.5C70.5 182 83.3 192 98 192h30 16H303.8L416 256.1zM464 80a16 16 0 1 0 -32 0 16 16 0 1 0 32 0z" />
                        </svg>
                      </div>
                      <span>대형견</span> <span>15kg 이상</span>{' '}
                      <span>{petSitterData.sitterInfo.hourlyRate.large.toLocaleString()} 원</span>
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
