import { useRef, useState } from 'react';
import Select from 'react-select';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { API_URL } from '../../util/constants';
import Stars from '../Stars';

//필터 옵션
const options = [
  { value: '1', label: <Stars rating={1} /> },
  { value: '2', label: <Stars rating={2} /> },
  { value: '3', label: <Stars rating={3} /> },
  { value: '4', label: <Stars rating={4} /> },
  { value: '5', label: <Stars rating={5} /> },
];

function ReviewWrite() {
  const { id } = useParams();
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [preview, setPreview] = useState();
  const fileInput = useRef();
  const nav = useNavigate();

  const handleImageUpload = (e) => {
    let reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleSummit = (e) => {
    e.preventDefault();

    //작성이 안된 경우
    if (e.target.title.value.length < 1 || e.target.reviewText.value < 1) {
      Swal.fire({
        title: '제목, 내용을 적어주세요.',
        icon: 'warning',
        confirmButtonText: '확인',
        customClass: { container: 'custom-popup' },
      });
      return;
    }

    let formData = new FormData();
    formData.append('img', fileInput.current.files[0]);
    formData.append('title', e.target.title.value);
    formData.append('comment', e.target.reviewText.value);
    formData.append('starRate', Number(selectedOption.value));
    postReview(formData);
  };

  async function postReview(data) {
    try {
      const response = await fetch(`${API_URL}/booklist/review/${id}`, {
        method: 'POST',
        body: data,
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Network response was not ok');

      Swal.fire({
        title: '리뷰 작성 완료',
        text: '',
        icon: 'success',
        customClass: { container: 'custom-popup' },
      }).then((result) => nav(-1));
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <>
      <div className="mypage-review-write">
        <h4>리뷰작성 </h4>
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
              className="mypage-review-write_title"
              type="text"
              name="title"
              id="title"
              placeholder="제목을 입력해주세요"
            />
          </div>
          <div>
            <div className="review-write_wrap">
              <h6>리뷰 작성</h6>
              <div className="mypage-review-write_stars">
                <Select
                  className="mypage-review-write_stars-rate"
                  placeholder={'전체상품'}
                  options={options}
                  onChange={setSelectedOption}
                  defaultValue={selectedOption}
                />
              </div>
            </div>
            <textarea id="reviewText" cols="30" rows="10" placeholder="리뷰 본문을 작성해주세요"></textarea>
          </div>
          <button className="registration">리뷰 등록</button>
        </form>
      </div>
    </>
  );
}

export default ReviewWrite;
