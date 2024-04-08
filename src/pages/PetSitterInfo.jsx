import { useState, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './PetSitterInfo.scss';
import { Calendar, Time } from '../components/Calendar';

// 리뷰(리뷰 수, 펫시터의 리뷰 목록), User(주소(활동범위)) 정보를 가져옴
PetSitterInfo.defaultProps = {
  userId: 1,
  sitterId: 1,
  name: '이하은',
  img: 'https://dispatch.cdnser.be/cms-content/uploads/2020/10/22/bd74cb66-a4ef-4c57-9358-1cb0494d9dc2.jpg',
  type: ['강아지', '고양이'],
  location: '서울시 강서구',
  introduction:
    '안녕하세요! 저는 동물을 사랑하고 책임감을 가지고 행동하는 펫시터입니다. 애완동물의 행복과 안전을 최우선으로 생각하며, 신뢰할 수 있는 돌봄을 제공합니다.',
  experience: '8봤고 1 교육으로 뭐를 했고 ~~~..........',
  check: ['신원 인증', '인성 검사', '촬영 동의'],
  hourlyRate: { small: 15000, medium: 20000, large: 25000, cat: 10000 },
};

function PetSitterInfo({ img, sitterId, name, type, location, introduction, experience, check, hourlyRate }) {
  const petTypeRef = useRef();
  const petCountRef = useRef();

  const [selectedPetList, setSelectedpetList] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // 추가 버튼의 이벤트 핸들링
  function handleAdd(e) {
    e.preventDefault();
    e.stopPropagation();
    const type = petTypeRef.current.value;
    const count = petCountRef.current.value;
    type === '선택' || count === '선택' ? alert('맡기실 반려동물을 선택해주세요') : addBinder(type, count);
    petTypeRef.current.value = '선택';
    petCountRef.current.value = '선택';
  }

  // handleAdd의 삼항 연산자 사용을 위한 바인딩
  const addBinder = (type, count) => {
    setSelectedpetList([...selectedPetList, [type, count]]);
    calculateTotalPrice('add', type, count);
  };

  // 삭제 핸들링 함수
  function handleRemove(index) {
    const target = selectedPetList.filter((_, i) => i === index)[0];
    setSelectedpetList(selectedPetList.filter((_, i) => i !== index));
    const type = target[0];
    const count = target[1];
    calculateTotalPrice('remove', type, count);
  }

  // 예약 카드 총액 계산
  function calculateTotalPrice(msg, type, count) {
    switch (msg) {
      case 'add':
        setTotalPrice(totalPrice + hourlyRate[type] * count);
        break;
      case 'remove':
        setTotalPrice(totalPrice - hourlyRate[type] * count);
        break;
      default:
        break;
    }
  }

  //펫시터 유저의 type에 따른 동적 옵션 추가
  function optionCheck(type) {
    const options = []; // 옵션을 저장할 배열 초기화

    // type 배열 내에 강아지나 고양이가 있는지 확인 후, 해당하는 옵션 추가
    if (type.includes('강아지')) {
      options.push(
        <option key="small" value="small">
          소형 강아지
        </option>,
      );
      options.push(
        <option key="medium" value="medium">
          중형 강아지
        </option>,
      );
      options.push(
        <option key="large" value="large">
          대형 강아지
        </option>,
      );
    }
    if (type.includes('고양이')) {
      options.push(
        <option key="cat" value="cat">
          고양이
        </option>,
      );
    }

    return options;
  }

  // 폼 제출시 handleSubmit으로 처리
  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <>
      <section className="page-wrapper">
        <Header />
        <section className="container">
          <section className="pet-sitter-info-section">
            <div className="pet-sitter-info-card">
              <div className="pet-sitter-info-card_inner">
                <img src={img} alt="프로필 이미지" />
                <p className="sitterId">{sitterId}</p>
                <p className="name">{name} 님</p>
                <div className="info-text">
                  <p className="type">{type.join(', ')} 펫시터</p>
                  <p className="location">{location}</p>
                </div>
                <div className="introduction">
                  <h6>{name} 님을 소개합니다!</h6>
                  <p>{introduction}</p>
                </div>
                <div className="experience">
                  <h6>{name} 님의 경력</h6>
                  <p>{experience}</p>
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
            </div>
          </section>
          <section className="reservation-section">
            <div className="reservation-card">
              <div className="reservation-card_inner">
                <form action="#" method="post" onSubmit={handleSubmit}>
                  <h6>언제 펫시터가 필요한가요?</h6>
                  <div className="date-time-select">
                    <div className="date-select">
                      <span>시작일</span>
                      <Calendar className="start-date" />
                      <span>종료일</span>
                      <Calendar className="end-date" />
                    </div>
                    <div className="time-select">
                      <span>
                        시작
                        <br />
                        시간
                      </span>
                      <Time className="start-time" />
                      <span>
                        종료
                        <br />
                        시간
                      </span>
                      <Time className="end-time" />
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
                          let text;
                          switch (el[0]) {
                            case 'small':
                              text = '소형 강아지';
                              break;
                            case 'medium':
                              text = '중형 강아지';
                              break;
                            case 'large':
                              text = '대형 강아지';
                              break;
                            case 'cat':
                              text = '고양이';
                              break;
                            default:
                              break;
                          }
                          return (
                            <li key={i}>
                              {text} {el[1]} 마리
                              <button onClick={() => handleRemove(i)}>X</button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    <div className="pet-select_calculator">
                      {/* 캘린더 완성 후 시간 값 연결 */}
                      <p>총액: {totalPrice.toLocaleString()} 원</p>
                    </div>
                    <div className="pet-select_price-list">
                      <span>시간당 가격</span>
                      <ul>
                        {hourlyRate.cat ? <li>고양이: {hourlyRate.cat.toLocaleString()} 원</li> : undefined}
                        {hourlyRate.small ? <li>소형 강아지: {hourlyRate.small.toLocaleString()} 원</li> : undefined}
                        {hourlyRate.medium ? <li>중형 강아지: {hourlyRate.medium.toLocaleString()} 원</li> : undefined}
                        {hourlyRate.large ? <li>대형 강아지: {hourlyRate.large.toLocaleString()} 원</li> : undefined}
                      </ul>
                    </div>
                  </div>
                  <h6>요청사항</h6>
                  <div className="request">
                    <textarea
                      name="request_text"
                      id=""
                      cols="30"
                      rows="10"
                      placeholder="펫시팅에 필요한 상세 내용을 적어주세요."
                    ></textarea>
                  </div>
                  <button type="submit">예약 요청하기</button>
                </form>
              </div>
            </div>
          </section>
          <section className="review-section">
            <div className="review-card">
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
            </div>
          </section>
        </section>
        <Footer />
      </section>
    </>
  );
}

export default PetSitterInfo;
