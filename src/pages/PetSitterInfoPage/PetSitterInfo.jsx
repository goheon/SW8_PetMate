import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PetSitterInfoCard from './components/PetSitterInfoCard';
import { ReservationCard } from './components/ReservationCard';
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

function PetSitterInfo(sitterInfo) {
  return (
    <>
      <Header />
      <section className="container">
        <section className="pet-sitter-info-section">
          <PetSitterInfoCard sitterInfo={sitterInfo} />
        </section>
        <section className="reservation-section">
          <ReservationCard />
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
