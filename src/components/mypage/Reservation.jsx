import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { setAllOrderList, setUserInfo } from '../../store';
import { ButtonLoading } from '../Spinner';
import { fetchGetBookList, fetchUserInfo, fetchOrderComplete, fetchPointRemittance } from './util/APIrequest';
import 'react-datepicker/dist/react-datepicker.css';

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

//필터 옵션
const options = [
  { value: 0, label: '전체상품' },
  { value: 1, label: '예약요청' },
  { value: 2, label: '진행중' },
  { value: 3, label: '완료' },
  { value: 4, label: '취소' },
];

//예약내역 리스트 컴포넌트
const OrderList = (props) => {
  const allOrderList = useSelector((state) => state.allOrderList);
  const loginUserInfo = useSelector((state) => state.loginUserInfo);
  const [loadingState, setLoadingState] = useState(false);
  const dispatch = useDispatch();
  const addressList = props.sitteraddress ? props.sitteraddress.split(' ') : undefined;
  const formedSitterAddress = addressList ? `${addressList[0]} ${addressList[1]}` : undefined;

  const handleComplete = async (e) => {
    Swal.fire({
      title: '완료하기',
      text: '펫시팅을 완료하고 포인트를 전송할까요?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: '확인',
      cancelButtonText: '취소',
      customClass: { container: 'custom-popup' },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const orderId = e.target.value;
        const orderInfo = allOrderList.filter((el) => el.orderId === orderId)[0];
        if (orderInfo.totalPrice > loginUserInfo.point) {
          Swal.fire({
            title: '포인트 잔액 부족',
            text: '포인트 충전 후 완료해주세요.',
            icon: 'warning',
            customClass: { container: 'custom-popup' },
          });
          return;
        }
        //주문 상태 변경 API 연결(진행중 -> 완료)
        //포인트 전송 처리 API 연결
        setLoadingState(true);
        const orderResponse = await fetchOrderComplete(orderId);
        if (!orderResponse.ok) throw new Error('orderResponse was not ok');
        const pointResponse = await fetchPointRemittance(orderId);
        if (!pointResponse.ok) throw new Error('pointResponse was not ok');
        const userInfoResponse = await fetchUserInfo();
        dispatch(setUserInfo(userInfoResponse));
        setLoadingState(false);
        Swal.fire({
          title: '완료 처리되었습니다.',
          icon: 'success',
          customClass: { container: 'custom-popup' },
        }).then(async (result) => {
          const response = await fetchGetBookList();
          if (!response.ok) throw new Error('Network response was not ok');
          const { data } = await response.json();
          dispatch(setAllOrderList(data));
        });
      }
    });
  };

  return (
    <li key={props.orderId}>
      <div className="mypage-reservation-list_state">
        <h6>{props.state}</h6>
        <p>
          예약일시
          <span>{new Date(props.createdAt).toLocaleDateString()}</span>
        </p>
      </div>
      <div className="mypage-reservation-list_info">
        <div className="img-box">
          <img src="https://d1cd60iwvuzqnn.cloudfront.net/page/ede014a198634e058c55cab16fa36387.jpg" alt="" />
        </div>
        <div className="mypage-reservation-list_info_right">
          <div className="text-box">
            <p className="title">{props.petSitterInfo.sitterInfo.title}</p>
            <h5>{props.totalPrice.toLocaleString()}원</h5>
            <h6>
              {formedSitterAddress} 파트너 · {props.sittername} 님
            </h6>
          </div>
          <div className="btn-box">
            <Link to={`/mypage/order-view/${props.orderId}`}>상세내용</Link>
            {props.state === '진행중' && new Date(props.endDate) < new Date() ? (
              <button type="button" value={props.orderId} onClick={handleComplete}>
                {loadingState === false ? '완료하기' : <ButtonLoading size={18} />}
              </button>
            ) : undefined}
            {props.state === '완료' && props.reviewWritten !== '1' ? (
              <Link to={`/mypage/review-write/${props.orderId}`}>리뷰작성</Link>
            ) : undefined}
          </div>
        </div>
      </div>
    </li>
  );
};

function Reservation() {
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const allOrderList = useSelector((state) => state.allOrderList);
  const [filteredOrderList, setFilteredOrderList] = useState([]);
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState(); // 필터 날짜
  const [endDate, setEndDate] = useState();
  const [searchQuery, setSearchQuery] = useState(''); // 검색어

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
    getBookList();

    async function getBookList() {
      const response = await fetchGetBookList();
      if (!response.ok) throw new Error('Network response was not ok');
      const { data } = await response.json();
      dispatch(setAllOrderList(data));
    }
  }, [dispatch]);

  useEffect(() => {
    setFilteredOrderList(allOrderList);
  }, [allOrderList]);

  useEffect(() => {
    let tempReservation = [...allOrderList];

    // Select 필터
    if (selectedOption.value !== 0) {
      tempReservation = tempReservation.filter(reservation => reservation.state === selectedOption.label);
    }

    // 날짜 필터
    if (startDate && endDate) {
      tempReservation = tempReservation.filter((reservation) => {
        const reservationDate = new Date(reservation.createdAt).getTime();
        return reservationDate >= startDate.setHours(0, 0, 0) && reservationDate <= endDate.setHours(23, 59, 59);
      });
    }

    // 검색 쿼리 필터링
    if (searchQuery) {
      tempReservation = tempReservation.filter(reservation =>
        reservation.sittername.includes(searchQuery)
        || reservation.petSitterInfo.sitterInfo.title.includes(searchQuery)
      );
    }

    tempReservation.reverse();
    setFilteredOrderList(tempReservation);

  }, [selectedOption, allOrderList, startDate, endDate, searchQuery]);

  return (
    <>
      <div className="mypage-reservation">
        <h4>예약내역</h4>
        <ul className="mypage-board">
          <li>
            <p>예약요청</p>
            <strong>
              {allOrderList.filter((el) => el.state === '예약요청').length}
            </strong>
          </li>
          <li>
            <p>진행중</p>
            <strong>
              {allOrderList.filter((el) => el.state === '진행중').length}
            </strong>
          </li>
          <li>
            <p>완료된 시팅</p>
            <strong>
              {allOrderList.filter((el) => el.state === '완료').length}
            </strong>
          </li>
          <li>
            <p>취소된 시팅</p>
            <strong>
              {allOrderList.filter((el) => el.state === '취소').length}
            </strong>
          </li>
        </ul>
        <div className="mypage-filter">
          <div className="mypage-filter_state">
            <Select
              className="mypage-filter_state-options"
              placeholder={'전체상품'}
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
        <ul className="mypage-reservation-list">
          {
            allOrderList.length > 0
              ? filteredOrderList.map((el) => <OrderList key={el.orderId} {...el} />)
              : <p className="noOrder">예약내역이 없습니다.</p>
          }
        </ul>
      </div>
    </>
  );
}

export default Reservation;
