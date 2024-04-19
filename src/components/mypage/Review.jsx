import Stars from '../Stars';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import Swal from 'sweetalert2';
import { fetchReviews } from './util/APIrequest';

//필터 옵션
const options = [
  { value: 0, label: '전체리뷰' },
  { value: 1, label: <Stars rating={1} /> },
  { value: 2, label: <Stars rating={2} /> },
  { value: 3, label: <Stars rating={3} /> },
  { value: 4, label: <Stars rating={4} /> },
  { value: 5, label: <Stars rating={5} /> },
];

function Review() {
  const loginUserInfo = useSelector((state) => state.loginUserInfo);
  const [reviews, setReviews] = useState([]); // 리뷰 데이터
  const [filteredReviews, setFilteredReviews] = useState([]); // 필터링 데이터
  const [selectedOption, setSelectedOption] = useState(options[0]); // 드롭다운 옵션
  const [startDate, setStartDate] = useState(''); // 날짜 필터
  const [endDate, setEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // 검색어
  const [activeExpandId, setActiveExpandId] = useState(''); // 현재 확장된 리뷰

  // 리뷰 확장 토글
  const toggleExpand = (reviewId) => {
    setActiveExpandId((preReviewId) => preReviewId === reviewId ? '' : reviewId)
  };

  // 평점 계산
  const averageStars = reviews.length === 0 ? "-" :
    (reviews.reduce((acc, review) => acc + review.comment.starRate, 0) / reviews.length).toFixed(1);

  // 날짜 선택 핸들러
  const handleDateChange = (start, end) => {
    if (start && end && start > end) {
      Swal.fire({
        text: `종료 날짜는 시작 날짜보다 빠를 수 없습니다.`,
        icon: 'warning',
        customClass: { container: 'custom-popup' },
      });
      return;
    }
    setStartDate(start);
    setEndDate(end);
  };

  // 조회 버튼 클릭 핸들러
  const handleSearchClick = () => {
    const searchInputValue = document.querySelector('.search-button').value.trim();
    setSearchQuery(searchInputValue);
  };

  useEffect(() => {
    if (loginUserInfo) {
      const getReviews = async () => {
        const data = await fetchReviews(loginUserInfo.userId);
        setReviews(data);
      }
      getReviews();
    }
  }, [loginUserInfo]);

  useEffect(() => {
    let tempReviews = [...reviews];

    // Select 필터
    if (selectedOption.value !== 0) { // '전체리뷰' 선택 시 모든 리뷰 표시
      tempReviews = tempReviews.filter(review => review.comment.starRate === selectedOption.value);
    }

    // 날짜 필터
    if (startDate && endDate) {
      tempReviews = tempReviews.filter((review) => {
        const reviewDate = new Date(review.comment.createdAt).getTime();
        return reviewDate >= startDate.setHours(0, 0, 0) && reviewDate <= endDate.setHours(23, 59, 59);
      });
    }

    // 검색 쿼리 필터링
    if (searchQuery) {
      tempReviews = tempReviews.filter(review =>
        review.sitterTitle.includes(searchQuery)
        || review.comment.title.includes(searchQuery)
        || review.comment.title.includes(searchQuery)
      );
    }

    tempReviews.reverse();
    setFilteredReviews(tempReviews);

  }, [selectedOption, reviews, startDate, endDate, searchQuery]);

  return (
    <>
      <div className="mypage-review">
        <h4>리뷰관리</h4>

        <ul className="mypage-board">
          <li>
            <p>리뷰 수</p>
            <strong>
              {filteredReviews.length}
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
              inputDate={startDate}
              setInputDate={(date) => handleDateChange(date, endDate)}
              placeholder="조회 시작일"
            />
          </div>
          <div className="mypage-filter_end-day">
            <Day
              inputDate={endDate}
              setInputDate={(date) => handleDateChange(startDate, date)}
              placeholder="조회 종료일"
            />
          </div>
          <div className="mypage-filter_search">
            <input type="text" className="search-button" placeholder="검색어입력" />
          </div>

          <button onClick={handleSearchClick}>조회</button>
        </div>

        {/* <div>
          사진 리뷰만 보기
        </div> */}

        <ul className="mypage-review-list">
          {
            filteredReviews.map((el) => {
              return (
                <ReviewList
                  key={el.comment._id}
                  isExpanded={activeExpandId === el.comment._id}
                  onToggleExpand={() => toggleExpand(el.comment._id)}
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
  const navigate = useNavigate();

  // 클릭 이벤트 핸들러
  const handleClick = () => {
    navigate(`/pet-sitter/${props.review.comment.sitterId}`);
  };

  return (
    <li onClick={props.onToggleExpand}>
      <div className="mypage-review-list_state">
        <div className="review_user-profile">
          <div>
            <div className="review_petsitter-title" onClick={handleClick}>{props.review.sitterTitle}&nbsp;<span className="arrow" /></div>
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
        <p className={props.isExpanded ? 'expand' : null}>{props.review.comment.comment}</p>
      </div>
      {props.isExpanded && (
        <div className='image-box'>
          {
            props.review.comment.image.map((el) => {
              return (
                <img alt='user-img' className='review_images' src={el} />
              )
            })
          }
        </div>
      )}
    </li>
  );
};

//날짜 설정 컴포넌트
const Day = ({ inputDate, setInputDate, placeholder }) => {
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
  return (
    <DatePicker
      showIcon dateFormat="yyyy/MM/dd"
      selected={inputDate}
      onChange={(date) => setInputDate(date)}
      placeholderText={placeholder}
    />
  )
};

export default Review;