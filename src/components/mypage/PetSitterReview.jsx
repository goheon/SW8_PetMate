import Stars from '../Stars';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import 'react-datepicker/dist/react-datepicker.css';
import { fetchPetSitterReviews } from './util/APIrequest';

//필터 옵션
const options = [
    { value: '0', label: '전체리뷰' },
    { value: '1', label: <Stars rating={1} /> },
    { value: '2', label: <Stars rating={2} /> },
    { value: '3', label: <Stars rating={3} /> },
    { value: '4', label: <Stars rating={4} /> },
    { value: '5', label: <Stars rating={5} /> },
];

function PetSitterReview() {
    const loginUserInfo = useSelector((state) => state.loginUserInfo);
    const petSitterInfo = useSelector((state) => state.petSitterInfo);
    const [petSitterReviews, setPetSitterReviews] = useState([]); // 리뷰 데이터
    const [selectedOption, setSelectedOption] = useState(options[0]); // 드롭다운 옵션
    const [startDate, setStartDate] = useState(); // 날짜 필터
    const [endDate, setEndDate] = useState();
    const [activeExpandId, setActiveExpandId] = useState(''); // 현재 확장된 리뷰

    // 리뷰 확장 토글
    const toggleExpand = (reviewId) => {
        setActiveExpandId((preReviewId) => preReviewId === reviewId ? '' : reviewId)
    };

    // 평점 계산
    const averageStars = petSitterReviews.length === 0 ? "-" :
        (petSitterReviews.reduce((acc, review) => acc + review.starRate, 0) / petSitterReviews.length).toFixed(1);

        // useEffect(() => {
    //     if (loginUserInfo) {
    //         //펫시터 회원이 아닌 경우
    //         if (!loginUserInfo.isRole) {
    //             Swal.fire({
    //                 title: '권한이 없습니다!',
    //                 text: '',
    //                 icon: 'warning',
    //                 customClass: { container: 'custom-popup' },
    //             }).then((result) => nav('/', { replace: true }));
    //         }

    //         const getSitterInfo = async () => {
    //             const response = await fetchGetSitterInfo();
    //             if (!response.ok) {
    //                 throw new Error('Network response was not ok');
    //             }
    //             const data = await response.json();
    //             setSitterInfo(data);
    //         };

    //         getSitterInfo();
    //     }

    //     // form 값 설정
    // }, [loginUserInfo]);

    useEffect(() => {
        const init = async () => {
            const data = await fetchPetSitterReviews('nj3QeK4l3tGE1C2nMOlB0');
            setPetSitterReviews(data);

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
                <h4>펫시터 리뷰관리</h4>

                <ul className="mypage-board">
                    <li>
                        <p>리뷰 수</p>
                        <strong>
                            {petSitterReviews.length}
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

                    <button>조회</button>
                </div>

                <ul className="mypage-review-list">
                    {
                        [...petSitterReviews].reverse().map((el) => {
                            return (
                                <PetSitterReviewList
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
const PetSitterReviewList = (props) => {
    return (
        <li onClick={props.onToggleExpand}>
            <div className="mypage-review-list_state">
                <div className="review_user-profile">
                    <img
                        alt="user-img"
                        className="review_user-profile_img"
                        src="https://tmpfiles.nohat.cc/abstract-user-flat-3.svg"
                    />
                    <div>
                        <span className="review_user-profile_name">{props.review.username}</span>
                        <Stars rating={props.review.starRate} />
                    </div>
                </div>
                <p>
                    작성일시
                    <span>{new Date(props.review.createdAt).toLocaleDateString()}</span>
                </p>
            </div>
            <div className="text-box">
                <div className='title'>
                    <h5>{props.review.title}</h5>
                    {
                        props.review.image.length > 0 &&
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
                <p className={props.isExpanded && 'expand'}>{props.review.comment}</p>
            </div>
            {props.isExpanded && (
                <div className='image-box'>
                    {
                        props.review.image.map((el) => {
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

export default PetSitterReview;