import Stars from '../Stars';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import 'react-datepicker/dist/react-datepicker.css';
import Swal from 'sweetalert2';
import { fetchPetSitterReviews, fetchGetSitterInfo } from './util/APIrequest';

//필터 옵션
const options = [
    { value: 0, label: '전체리뷰' },
    { value: 1, label: <Stars rating={1} /> },
    { value: 2, label: <Stars rating={2} /> },
    { value: 3, label: <Stars rating={3} /> },
    { value: 4, label: <Stars rating={4} /> },
    { value: 5, label: <Stars rating={5} /> },
];

function PetSitterReview() {
    const loginUserInfo = useSelector((state) => state.loginUserInfo);
    const [sitterInfo, setSitterInfo] = useState(); // sitterId
    const [petSitterReviews, setPetSitterReviews] = useState([]); // 리뷰 데이터
    const [filteredPetSitterReviews, setFilteredPetSitterReviews] = useState([]); // 필터링 데이터
    const [selectedOption, setSelectedOption] = useState(options[0]); // 드롭다운 옵션
    const [startDate, setStartDate] = useState(); // 날짜 필터
    const [endDate, setEndDate] = useState();
    const [searchQuery, setSearchQuery] = useState(''); // 검색어
    const [activeExpandId, setActiveExpandId] = useState(''); // 현재 확장된 리뷰

    // 리뷰 확장 토글
    const toggleExpand = (reviewId) => {
        setActiveExpandId((preReviewId) => preReviewId === reviewId ? '' : reviewId)
    };

    // 평점 계산
    const averageStars = petSitterReviews.length === 0 ? "-" :
        (petSitterReviews.reduce((acc, review) => acc + review.review.starRate, 0) / petSitterReviews.length).toFixed(1);

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
            // 펫시터 회원이 아닌 경우
            if (!loginUserInfo.isRole) {
                Swal.fire({
                    title: '권한이 없습니다!',
                    text: '',
                    icon: 'warning',
                    customClass: { container: 'custom-popup' },
                }).then((result) => nav('/', { replace: true }));
            }

            const getSitterInfo = async () => {
                const response = await fetchGetSitterInfo();
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setSitterInfo(data);
            };

            getSitterInfo();
        }
    }, [loginUserInfo]);

    useEffect(() => {
        if (sitterInfo) {
            const getPetSitterReviews = async () => {
                const data = await fetchPetSitterReviews(sitterInfo.sitterId);
                setPetSitterReviews(data);
            }
            getPetSitterReviews();
        }
    }, [sitterInfo])

    useEffect(() => {
        let tempPetSitterReviews = [...petSitterReviews];

        // Select 필터
        if (selectedOption.value !== 0) { // '전체리뷰' 선택 시 모든 리뷰 표시
            tempPetSitterReviews = tempPetSitterReviews.filter(review => review.review.starRate === selectedOption.value);
        }

        // 날짜 필터
        if (startDate && endDate) {
            tempPetSitterReviews = tempPetSitterReviews.filter((review) => {
                const reviewDate = new Date(review.review.createdAt).getTime();
                return reviewDate >= startDate.setHours(0, 0, 0) && reviewDate <= endDate.setHours(23, 59, 59);
            });
        }

        // 검색 쿼리 필터링
        if (searchQuery) {
            tempPetSitterReviews = tempPetSitterReviews.filter(review =>
                review.value.username.includes(searchQuery)
                || review.review.title.includes(searchQuery)
                || review.review.comment.includes(searchQuery)
            );
        }

        tempPetSitterReviews.reverse();
        setFilteredPetSitterReviews(tempPetSitterReviews);

    }, [selectedOption, petSitterReviews, startDate, endDate, searchQuery]);

    return (
        <>
            <div className="mypage-review">
                <h4>펫시터 리뷰관리</h4>

                <ul className="mypage-board">
                    <li>
                        <p>리뷰 수</p>
                        <strong>
                            {filteredPetSitterReviews.length}
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

                <ul className="mypage-review-list">
                    {
                        filteredPetSitterReviews.map((el) => {
                            return (
                                <PetSitterReviewList
                                    key={el.review._id}
                                    isExpanded={activeExpandId === el.review._id}
                                    onToggleExpand={() => toggleExpand(el.review._id)}
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
const PetSitterReviewList = (props) => {
    return (
        <li onClick={props.onToggleExpand}>
            <div className="mypage-review-list_state">
                <div className="review_user-profile">
                    <img
                        alt="user-img"
                        className="review_user-profile_img"
                        src={props.review.value.image}
                    />
                    <div>
                        <span className="review_user-profile_name">{props.review.value.username}</span>
                        <Stars rating={props.review.review.starRate} />
                    </div>
                </div>
                <p>
                    작성일시
                    <span>{new Date(props.review.review.createdAt).toLocaleDateString()}</span>
                </p>
            </div>
            <div className="text-box">
                <div className='title'>
                    <h5>{props.review.review.title}</h5>
                    {
                        props.review.review.image.length > 0 &&
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
                <p className={props.isExpanded ? 'expand' : null}>{props.review.review.comment}</p>
            </div>
            {props.isExpanded && (
                <div className='image-box'>
                    {
                        props.review.review.image.map((el) => {
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

export default PetSitterReview;