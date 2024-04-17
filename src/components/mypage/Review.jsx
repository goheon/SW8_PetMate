import Stars from '../Stars';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Select from 'react-select';
import 'react-datepicker/dist/react-datepicker.css';

//필터 옵션
const options = [
  { value: '0', label: '전체리뷰' },
  { value: '1', label: <Stars rating={1} /> },
  { value: '2', label: <Stars rating={2} /> },
  { value: '3', label: <Stars rating={3} /> },
  { value: '4', label: <Stars rating={4} /> },
  { value: '5', label: <Stars rating={5} /> },
];

function Review() {
  const [selectedOption, setSelectedOption] = useState(options[0]); // 드롭다운 옵션
  const [startDate, setStartDate] = useState(); // 날짜 필터
  const [endDate, setEndDate] = useState();
  const [activeExpandId, setActiveExpandId] = useState('');

  // 리뷰 확장 토글
  const toggleExpand = (reviewId) => {
    setActiveExpandId((preReviewId) => preReviewId === reviewId ? '' : reviewId)
  };

  useEffect(() => {
    let beginTime = new Date();
    beginTime.setHours(0, 0, 0);
    setStartDate(beginTime);

    let endTime = new Date();
    endTime.setHours(23, 59, 59);
    setEndDate(endTime);
  }, []);

  return (
    <>
      <div className="mypage-review">
        <h4>리뷰관리</h4>

        <ul className="mypage-board">
          <li>
            <p>리뷰 수</p>
            <strong>
              3
            </strong>
          </li>
          <li>
            <p>평균 별점</p>
            <strong>
              4.9
            </strong>
          </li>
        </ul>

        <div className="mypage-filter">
          <div className="mypage-filter_state">
            <Select
              className="mypage-filter_state-options"
              placeholder={'전체리뷰'}
              options={options}
              onChange={setSelectedOption}
              defaultValue={selectedOption}
            />
          </div>
          <div className="mypage-filter_start-day">
            <Day
              inputDate={startDate} setInputDate={setStartDate}
            />
          </div>
          <div className="mypage-filter_end-day">
            <Day
              inputDate={endDate} setInputDate={setEndDate}
            />
          </div>
          <div className="mypage-filter_search">
            <input type="text" placeholder="검색어입력" />
          </div>

          <button
          // onClick={() => {
          //   const filterArr = allOrderList.filter((el) => {
          //     if (selectedOption.value === 'all' || selectedOption.label === el.state) {
          //       const createdAtObject = new Date(el.createdAt);
          //       if (
          //         startDate.getTime() <= createdAtObject.getTime() &&
          //         createdAtObject.getTime() <= endDate.getTime()
          //       ) {
          //         return true;
          //       }
          //     }

          //     return false;
          //   });
          //   setOnFilter(true);
          //   setFilterOrderList(filterArr);
          // }}
          >
            조회
          </button>
        </div>

        {/* <div>
          사진 리뷰만 보기
        </div> */}

        <ul className="mypage-review-list">
          {
            [1, 2].map((el, i) => {
              return (
                <ReviewList
                  key={i}
                  isExpanded={activeExpandId === i}
                  onToggleExpand={() => toggleExpand(i)}
                />
              )
            })
          }

          {/* <PetSitterReviewList /> */}
          {/* {allOrderList.length < 1 && <p className="noReview">리뷰내역이 없습니다.</p>} */}
        </ul>
      </div>

    </>
  );
}

// 리뷰 리스트 컴포넌트
const ReviewList = (props) => {
  return (
    <li onClick={props.onToggleExpand}>
      <div className="mypage-review-list_state">
        <div className="review_user-profile">
          <div>
            <span className="review_petsitter-title">안전하게 돌봐드립니다!&nbsp;&gt;</span>
            <Stars rating={5} />
          </div>
        </div>
        <p>
          작성일시
          <span>2024. 04. 11.</span>
        </p>
      </div>
      <div className="text-box">
        <div className='title'>
          <h5>여기가 제목입니다</h5>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24">
              <path d="M17.721,3,16.308,1.168A3.023,3.023,0,0,0,13.932,0H10.068A3.023,3.023,0,0,0,7.692,1.168L6.279,3Z" /><circle cx="12" cy="14" r="4" />
              <path d="M19,5H5a5.006,5.006,0,0,0-5,5v9a5.006,5.006,0,0,0,5,5H19a5.006,5.006,0,0,0,5-5V10A5.006,5.006,0,0,0,19,5ZM12,20a6,6,0,1,1,6-6A6.006,6.006,0,0,1,12,20Z" />
            </svg>
            사진
          </span>
        </div>
        <p className={props.isExpanded && 'expand'}>여기서 보이는 리뷰 글자수는 2줄로 제한을 뒀고요, 클릭하면 확장되면서 짤린 텍스트와 첨부한 사진을 보여줍니당!
          펫시터가 답글 달아주는 기능 넣을거면 여기에 추가하고 상세페이지에선 화면에 뿌리기만하죠!! 이제 글자짤림 길게 적어서 테스트 하겠습니당 길게길게길게길게길게길게길게길게길게</p>
      </div>
      {props.isExpanded && (
        <div className='image-box'>
          <img src="/public/main02_review_02.jpg" />
          <img src="/public/main02_review_01.jpg" />
          <img src="/public/main02_review_02.jpg" />
        </div>
      )}
    </li>
  );
};

//날짜 설정 컴포넌트
const Day = ({ inputDate, setInputDate }) => {
  const [DatePicker, setDatePicker] = useState(null);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('react-datepicker')
        .then((module) => {
          setDatePicker(() => module.default);
        })
        .catch((err) => console.log(err));
    }
  }, []);
  if (!DatePicker) return <div>Loading date picker...</div>;
  return <DatePicker showIcon dateFormat="yyyy/MM/dd" selected={inputDate} onChange={(date) => setInputDate(date)} />;
};

export default Review;