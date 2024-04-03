import './PetSitterInfoCard.scss';

const PetSitterInfoCard = ({ sitterInfo }) => {
  const { img, sitterId, name, type, location, review, regularCustomer, description, experience, check } = sitterInfo;

  return (
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
  );
};

export default PetSitterInfoCard;
