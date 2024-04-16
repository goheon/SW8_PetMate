import { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import Swal from 'sweetalert2';
import Stars from '../Stars';
import { fetchPostReview } from './util/APIrequest';

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
    const files = e.target.files;
    const maxFiles = 3;
    const previews = [];

    if (files.length > maxFiles) {
      alert(`최대 ${maxFiles}개의 이미지만 업로드할 수 있습니다.`);
      // file input을 초기화하거나
      fileInput.value = '';
      return;
    }
    for (let i = 0; i < Math.min(files.length, 3); i++) {
      let reader = new FileReader();

      // 각 파일이 로드 완료되면 previews 배열에 결과 추가
      reader.onloadend = () => {
        previews.push(reader.result);

        // 모든 선택된 파일이 로드 완료되었는지 확인
        if (previews.length === Math.min(files.length, 3)) {
          // setPreview 함수를 호출하여 상태 업데이트
          // 이 예제에서는 setPreview가 여러 이미지 URL을 처리할 수 있다고 가정
          setPreview(previews);
        }
      };

      reader.readAsDataURL(files[i]);
    }
  };

  const handleSummit = async (e) => {
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
    for (let i = 0; i < fileInput.current.files.length && i < 3; i++) {
      formData.append('img', fileInput.current.files[i]);
    }
    formData.append('title', e.target.title.value);
    formData.append('comment', e.target.reviewText.value);
    formData.append('starRate', Number(selectedOption.value));

    Swal.fire({
      title: '리뷰를 작성중입니다...',
      text: '잠시만 기다려주세요.',
      icon: 'info',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(); // 로딩 애니메이션을 보여줌
      },
    });

    const response = await fetchPostReview(formData, id);

    if (!response.ok) {
      Swal.fire({
        title: '오류 발생',
        text: '리뷰를 전송하는 동안 문제가 발생했습니다.',
        icon: 'error',
        customClass: { container: 'custom-popup' },
      });
      throw new Error('Network response was not ok');
    }

    //response가 정상일 경우 로딩창 닫기, 응답이 빠르면 로딩창이 반짝여서 0.5초 대기
    setTimeout(() => {
      Swal.close();
      //완료 알림
      Swal.fire({
        title: '리뷰 작성 완료',
        text: '',
        icon: 'success',
        customClass: { container: 'custom-popup' },
      }).then((result) => nav('/mypage/review'));
    }, 500);
  };

  return (
    <>
      <div className="mypage-review-write">
        <h4>리뷰작성 </h4>
        <form action="" onSubmit={handleSummit}>
          <div>
            <h6>이미지 업로드</h6>
            <input type="file" accept="image/*" onChange={handleImageUpload} ref={fileInput} multiple />

            {preview && (
              <div className="file_img-box">
                {preview.map((el) => (
                  <span>
                    <img src={el} alt="preview" />
                  </span>
                ))}
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
