import Stars from '../Stars';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import 'react-datepicker/dist/react-datepicker.css';
import { fetchReviews } from './util/APIrequest';

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
  const loginUserInfo = useSelector((state) => state.loginUserInfo);
  const [reviews, setReviews] = useState([]); // 리뷰 데이터
  const [selectedOption, setSelectedOption] = useState(options[0]); // 드롭다운 옵션
  const [startDate, setStartDate] = useState(); // 날짜 필터
  const [endDate, setEndDate] = useState();
  const [activeExpandId, setActiveExpandId] = useState(''); // 현재 확장된 리뷰

  // 리뷰 확장 토글
  const toggleExpand = (reviewId) => {
    setActiveExpandId((preReviewId) => preReviewId === reviewId ? '' : reviewId)
  };

  // 평점 계산
  const averageStars = reviews.length === 0 ? "-" :
    (reviews.reduce((acc, review) => acc + review.comment.starRate, 0) / reviews.length).toFixed(1);


  useEffect(() => {
    const init = async () => {
      const data = await fetchReviews(loginUserInfo.userId);
      setReviews(data);

      let beginTime = new Date();
      beginTime.setHours(0, 0, 0);
      setStartDate(beginTime);

      let endTime = new Date();
      endTime.setHours(23, 59, 59);
      setEndDate(endTime);
    };

    init();
  }, []);

  return (
    <>
      <div className="mypage-review">
        <h4>리뷰관리</h4>

        <ul className="mypage-board">
          <li>
            <p>리뷰 수</p>
            <strong>
              {reviews.length}
            </strong>
          </li>
          <li>
            <p>평균 별점</p>
            <strong>
              {averageStars}
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

          <button>
            조회
          </button>
        </div>

        {/* <div>
          사진 리뷰만 보기
        </div> */}

        {
          console.log(reviews[0])
        }

        <ul className="mypage-review-list">
          {
            [...reviews].reverse().map((el) => {
              return (
                <ReviewList
                  key={el._id}
                  isExpanded={activeExpandId === el._id}
                  onToggleExpand={() => toggleExpand(el._id)}
                  review={el}
                />
              )
            })
          }
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
            <span className="review_petsitter-title">{props.review.sitterTitle}&nbsp;&gt;</span>
            <Stars rating={props.review.comment.starRate} />
          </div>
        </div>
        <p>
          작성일시
          <span>{new Date(props.review.comment.createdAt).toLocaleDateString()}</span>
        </p>
      </div>
      <div className="text-box">
        <div className='title'>
          <h5>{props.review.comment.title}</h5>
          {
            props.review.comment.image.length > 0 &&
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24">
                <path d="M17.721,3,16.308,1.168A3.023,3.023,0,0,0,13.932,0H10.068A3.023,3.023,0,0,0,7.692,1.168L6.279,3Z" /><circle cx="12" cy="14" r="4" />
                <path d="M19,5H5a5.006,5.006,0,0,0-5,5v9a5.006,5.006,0,0,0,5,5H19a5.006,5.006,0,0,0,5-5V10A5.006,5.006,0,0,0,19,5ZM12,20a6,6,0,1,1,6-6A6.006,6.006,0,0,1,12,20Z" />
              </svg>
              사진
            </span>
          }
        </div>
        <p className={props.isExpanded && 'expand'}>{props.review.comment.comment}</p>
      </div>
      {props.isExpanded && (
                <div className='image-box'>
                    {
                        props.review.comment.image.map((el) => {
                            return (
                                <img src={el} />
                            )
                        })
                    }
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