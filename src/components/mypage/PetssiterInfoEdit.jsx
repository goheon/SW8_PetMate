import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchEditPetSitter, fetchGetSitterInfo } from './util/APIrequest';
import Swal from 'sweetalert2';

function JoinExpert() {
  const loginUserInfo = useSelector((state) => state.loginUserInfo);
  const [sitterInfo, setSitterInfo] = useState();
  const [experienceList, setExperienceList] = useState([]);
  const [experienceValue, setExperienceValue] = useState();
  const [preview, setPreview] = useState();
  const nav = useNavigate();
  const fileInput = useRef();

  //sitter정보 GET
  useEffect(() => {
    if (loginUserInfo) {
      const getSitterInfo = async () => {
        const response = await fetchGetSitterInfo(loginUserInfo.userId);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSitterInfo(data);
      };

      getSitterInfo();
    }

    // form 값 설정
  }, [loginUserInfo]);

  useEffect(() => {
    if (sitterInfo) {
      // 돌봄 가능한 동물 / 사이즈 설정
      document.getElementById('cat').checked = sitterInfo.type?.includes('고양이') || false;
      document.getElementById('s').checked = sitterInfo.type?.includes('소형견') || false;
      document.getElementById('m').checked = sitterInfo.type?.includes('중형견') || false;
      document.getElementById('l').checked = sitterInfo.type?.includes('대형견') || false;

      // 희망 펫시팅 가격 설정
      document.getElementById('priceC').value = sitterInfo.hourlyRate?.cat || '';
      document.getElementById('priceS').value = sitterInfo.hourlyRate?.small || '';
      document.getElementById('priceM').value = sitterInfo.hourlyRate?.medium || '';
      document.getElementById('priceL').value = sitterInfo.hourlyRate?.large || '';

      // 반려 경험 및 경력 설정
      setExperienceList(sitterInfo.experience || []);

      // 대표 이미지 설정
      setPreview(sitterInfo.img || null);

      // 제목 설정
      document.getElementById('title').value = sitterInfo.title || '';

      // 소개글 설정
      document.getElementById('introduction').value = sitterInfo.introduction || '';
    }
  }, [sitterInfo]);

  //이미지 업로드 핸들링
  const handleImageUpload = (e) => {
    let reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  //제출
  const handleSummit = (e) => {
    e.preventDefault();

    Swal.fire({
      title: '정보를 수정할까요?',
      text: '수정 전 작성한 내용이 맞는지 확인해주세요!',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: '확인',
      cancelButtonText: '취소',
      customClass: { container: 'custom-popup' },
    }).then(async (result) => {
      if (result.isConfirmed) {
        let types = [];
        if (e.target.cat.checked) types.push('고양이');
        if (e.target.s.checked) types.push('소형견');
        if (e.target.m.checked) types.push('중형견');
        if (e.target.l.checked) types.push('대형견');

        if (types.length < 1) {
          Swal.fire({
            title: '돌봄 가능한 동물 / 사이즈를 선택해주세요.',
            icon: 'warning',
            confirmButtonText: '확인',
            customClass: { container: 'custom-popup' },
          });
          return;
        }

        if (
          (e.target.priceC.value === '' && e.target.cat.checked) ||
          (e.target.priceC.value !== '' && !e.target.cat.checked) ||
          (e.target.priceS.value === '' && e.target.s.checked) ||
          (e.target.priceS.value !== '' && !e.target.s.checked) ||
          (e.target.priceM.value === '' && e.target.m.checked) ||
          (e.target.priceM.value !== '' && !e.target.m.checked) ||
          (e.target.priceL.value === '' && e.target.l.checked) ||
          (e.target.priceL.value !== '' && !e.target.l.checked)
        ) {
          Swal.fire({
            title: '희망 펫시팅 가격을 바르게 입력해주세요.',
            icon: 'warning',
            confirmButtonText: '확인',
            customClass: { container: 'custom-popup' },
          });
          return;
        }

        const formData = new FormData();
        if (fileInput.current.files.length !== 0) {
          formData.append('img', fileInput.current.files[0]);
        }
        formData.append('type', types);

        const formedHourlyRate = {};
        if (e.target.cat.checked) formedHourlyRate.cat = Number(e.target.priceC.value);
        if (e.target.s.checked) formedHourlyRate.small = Number(e.target.priceS.value);
        if (e.target.m.checked) formedHourlyRate.medium = Number(e.target.priceM.value);
        if (e.target.l.checked) formedHourlyRate.large = Number(e.target.priceL.value);
        formData.append('hourlyRate', JSON.stringify(formedHourlyRate));
        formData.append('experience', experienceList);
        formData.append('introduction', e.target.introduction.value);
        formData.append('title', e.target.title.value);

        const response = await fetchEditPetSitter(formData, sitterInfo.sitterId);
        if (!response.ok) throw new Error('Network response was not ok');
        Swal.fire({
          title: '성공',
          text: '수정이 완료되었습니다!',
          icon: 'success',
          customClass: { container: 'custom-popup' },
        }).then(() => {
          // 수정이 완료된 후 본인 펫시터 상세페이지로 이동
          // nav('/', { replace: true });
        });
      }
    });
  };

  return (
    <>
      <div className="mypage-join-expert">
        <h4>펫시터 전환</h4>
        <form enctype="multipart/form-data" action="" onSubmit={handleSummit}>
          <div>
            <h6>돌봄 가능한 동물 / 사이즈</h6>
            <input type="checkbox" name="" id="cat" />
            <label className="checkbox_label" htmlFor="cat">
              고양이
            </label>
            <input type="checkbox" name="" id="s" />
            <label className="checkbox_label" htmlFor="s">
              소형견
            </label>
            <input type="checkbox" name="" id="m" />
            <label className="checkbox_label" htmlFor="m">
              중형견
            </label>
            <input type="checkbox" name="" id="l" />
            <label className="checkbox_label" htmlFor="l">
              대형견
            </label>
          </div>
          <div className="mypage-join-expert_price">
            <h6>희망 펫시팅 가격</h6>
            <label htmlFor="priceC">고양이</label>
            <input type="number" name="priceC" id="priceC" placeholder="15,000" />

            <label htmlFor="priceS">소형견</label>
            <input type="number" name="priceS" id="priceS" placeholder="20,000" />

            <label htmlFor="priceM">중형견</label>
            <input type="number" name="priceM" id="priceM" placeholder="30,000" />

            <label htmlFor="priceL">대형견</label>
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
              type="button"
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
            <p>이미지를 등록하지 않는 경우 기본 이미지로 변경됩니다!</p>
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
          <button className="registration">정보수정</button>
        </form>
      </div>
    </>
  );
}

export default JoinExpert;
