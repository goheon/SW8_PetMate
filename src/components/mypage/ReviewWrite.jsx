import { useRef, useState } from 'react';
import Stars from '../Stars';


function ReviewWrite() {
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
        <h4>리뷰작성</h4>
        <form action="" onSubmit={handleSummit}>
          <div>
            <h6>이미지 업로드</h6>
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
              placeholder="제목을 입력해주세요"
            />
          </div>
          <div>
            <h6>리뷰 작성</h6>
            <Stars rating={1} />
            <textarea
              id="introduction"
              cols="30"
              rows="10"
              placeholder="리뷰 본문을 작성해주세요"
            ></textarea>
          </div>
          <button className="registration">리뷰 등록</button>
        </form>
      </div>
    </>
  );
}

export default ReviewWrite;
