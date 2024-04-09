import { useRef, useState } from 'react';

const phoneAutoHyphen = (target) => {
  target.value = target.value
    .replace(/[^0-9]/g, '')
    .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, '$1-$2-$3')
    .replace(/(\-{1,2})$/g, '');
};

function JoinExpert() {
  const [experienceList, setExperienceList] = useState([]);
  const [experienceValue, setExperienceValue] = useState();
  const [preview, setPreview] = useState();
  const fileInput = useRef();

  const handleImageUpload = (e) => {
    let reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleSummit = (e) => {
    e.preventDefault();
    let types = [];
    if (e.target.dog.checked) types.push('강아지');
    if (e.target.cat.checked) types.push('고양이');
    if (e.target.s.checked) types.push('소형');
    if (e.target.m.checked) types.push('중형');
    if (e.target.l.checked) types.push('대형');

    let formData = new FormData();
    formData.append('image', fileInput.current.files[0]);

    const data = {
      type: types,
      hourlyRate: {
        priceS: Number(e.target.priceS.value),
        priceM: Number(e.target.priceM.value),
        priceL: Number(e.target.priceL.value),
      },
      experience: experienceList,
      introduction: e.target.introduction.value,
      title: e.target.title.value,
      image: formData,
    };

    console.log(data);
  };
  return (
    <>
      <div className="mypage-join-expert">
        <h4>펫시터 전환</h4>
        <form action="" onSubmit={handleSummit}>
          <div>
            <h6>돌봄 가능한 동물 / 사이즈</h6>
            <input type="checkbox" name="dog" id="dog" />
            <label className="checkbox_label" htmlFor="dog">
              강아지
            </label>
            <input type="checkbox" name="" id="cat" />
            <label className="checkbox_label" htmlFor="cat">
              고양이
            </label>
            <input type="checkbox" name="" id="s" />
            <label className="checkbox_label" htmlFor="s">
              소형
            </label>
            <input type="checkbox" name="" id="m" />
            <label className="checkbox_label" htmlFor="m">
              중형
            </label>
            <input type="checkbox" name="" id="l" />
            <label className="checkbox_label" htmlFor="l">
              대형
            </label>
          </div>
          <div className="mypage-join-expert_price">
            <h6>희망 펫시팅 가격</h6>
            <label htmlFor="priceS">소형</label>
            <input type="number" name="priceS" id="priceS" placeholder="20,000" />

            <label htmlFor="priceM">중형</label>
            <input type="number" name="priceM" id="priceM" placeholder="30,000" />

            <label htmlFor="priceL">대형</label>
            <input type="number" name="priceL" id="priceL" placeholder="40,000" />
          </div>
          <div>
            <h6>반려 경험 및 경력</h6>
            <p>하나씩 추가해 주세요</p>
            {experienceList.length > 0 ? (
              <ul className="mypage-join-expert_experience-list">
                {experienceList.map((el, index) => (
                  <li>
                    <p>{el}</p>
                    <svg
                      onClick={() => {
                        setExperienceList((current) => {
                          const newCurrent = current.filter((el, currentIndex) => currentIndex !== index);
                          return newCurrent;
                        });
                      }}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                    >
                      <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm79 143c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
                    </svg>
                  </li>
                ))}
              </ul>
            ) : null}

            <input
              value={experienceValue}
              className="mypage-join-expert_experience"
              type="text"
              name="experience"
              id="experience"
              placeholder="펫시터 전문가 교육 수료"
              onChange={(e) => {
                setExperienceValue(e.target.value);
              }}
            />
            <button
              style={{
                marginRight: 0,
              }}
              onClick={() => {
                if (experienceValue == '') return;
                setExperienceList((current) => {
                  const newCurrent = [...current, experienceValue];
                  setExperienceValue('');
                  return newCurrent;
                });
              }}
              className="experience-add"
            >
              추가
            </button>
          </div>
          <div>
            <h6>대표 이미지</h6>
            <input type="file" accept="image/*" onChange={handleImageUpload} ref={fileInput} />
            {preview && (
              <div className="file_img-box">
                <img src={preview} alt="preview" />
              </div>
            )}
          </div>
          <div>
            <h6>제목 작성</h6>
            <input
              className="mypage-join-expert_title"
              type="text"
              name="title"
              id="title"
              placeholder="다양한 노하우로 안전하게!"
            />
          </div>
          <div>
            <h6>소개글 작성</h6>
            <textarea
              id="introduction"
              cols="30"
              rows="10"
              placeholder="예시) 안녕하세요~! 동물을 사랑하는 13년차 주부 (세식구) 파트너 홍이맘 입니다. 외로움을 달래주고 한 가족처럼 지내는 반려견들. 하지만 우리 반려견들과 24시간 함께하기 힘든게 현실이지요. 출장도 가야하고 여행도 가야하는데 그럴때마다 부모님이나 지인들에게 부탁하기도 힘들고... 홍이네 집에 맡겨주세요^^ 강아지만 보면 좋아서 시간 가는줄도 모르는 초등학생 아들과 정성스럽게 돌봐 드립니다. 세 마리를 직접 키우고 경험한 노하우로 견주님의 사랑스러운 반려견을 안전하게 돌봐드리겠습니다. * 1박 이상 펫시팅 맡기실 경우 강남구에 사는 반려견은 차로 무료 픽업/드랍 서비스 해드려요. * 사정상 소형견만 케어 가능합니다. * 당일 예약은 힘들어요. * 산책시 사람이나 동물에게 공격성이나 짖음이 심한 아이는 산책 시간이 짧아질 수 있습니다. * 12세 이상 노견은 조심스러워 단기간 1박2일 까지만 받고 있는 점 이해해주세요. *한가정에 한마리씩만 케어합니다."
            ></textarea>
          </div>
          <div>
            <h6>본인인증 / 이용약관 동의</h6>
            <label htmlFor="phone">휴대폰 번호</label>
            <input type="text" name="phone" id="phone" placeholder="010-1234-5678" />
            <button className="phone-certified">휴대폰 번호인증</button>
            <input type="checkbox" name="" id="agreement" />
            <label className="checkbox_label" htmlFor="agreement">
              펫메이트 이용약관에 동의합니다. (필수)
            </label>
          </div>
          <button className="registration">펫시터 등록</button>
        </form>
      </div>
    </>
  );
}

export default JoinExpert;
