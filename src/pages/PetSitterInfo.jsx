import Header from '../components/Header';
import Footer from '../components/Footer';
import './PetSitterInfo.scss';

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
};

function PetSitterInfo({
  sitterId,
  img,
  name,
  location,
  type,
  experience,
  hourlyRate,
  description,
  check,
  review,
  regularCustomer,
}) {
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
              <p className="type">{type} 펫시터</p>
              <p className="location">{location}</p>
              <div>
                <span>리뷰 {review} 개</span>
                <br />
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
            <div className="reservation-card_inner"></div>
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
