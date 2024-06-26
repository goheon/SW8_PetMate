import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { setAllPetSitterOrderList } from '../../store';
import { fetchGetPetSitterBookList, fetchGetSitterInfo } from './util/APIrequest';
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
  const addressList = props.sitteraddress ? props.sitteraddress.split(' ') : undefined;
  const formedSitterAddress = addressList ? `${addressList[0]} ${addressList[1]}` : undefined;

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
          </div>
        </div>
      </div>
    </li>
  );
};

function Reservation() {
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const loginUserInfo = useSelector((state) => state.loginUserInfo);
  const allOrderList = useSelector((state) => state.allPetSitterOrderList);
  const [filteredOrderList, setFilteredOrderList] = useState([]);
  const [sitterInfo, setSitterInfo] = useState();
  const dispatch = useDispatch();
  const nav = useNavigate();
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
    if (loginUserInfo) {
      //펫시터 회원이 아닌 경우
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

    // form 값 설정
  }, [loginUserInfo]);

  useEffect(() => {
    getBookList();

    async function getBookList() {
      if (sitterInfo) {
        const responseBook = await fetchGetPetSitterBookList(sitterInfo.sitterId);
        if (!responseBook.ok) throw new Error('Network response was not ok');
        const { data } = await responseBook.json();

        dispatch(setAllPetSitterOrderList(data));
      }
    }
  }, [sitterInfo, dispatch]);

  useEffect(() => {
    let tempPetSitterReservation = [...allOrderList];

    // Select 필터
    if (selectedOption.value !== 0) {
      tempPetSitterReservation = tempPetSitterReservation.filter(reservation => reservation.state === selectedOption.label);
    }

    // 날짜 필터
    if (startDate && endDate) {
      tempPetSitterReservation = tempPetSitterReservation.filter((reservation) => {
        const reservationDate = new Date(reservation.createdAt).getTime();
        return reservationDate >= startDate.setHours(0, 0, 0) && reservationDate <= endDate.setHours(23, 59, 59);
      });
    }

    // 검색 쿼리 필터링
    if (searchQuery) {
      tempPetSitterReservation = tempPetSitterReservation.filter(reservation =>
        reservation.sittername.includes(searchQuery)
        || reservation.petSitterInfo.sitterInfo.title.includes(searchQuery)
      );
    }

    tempPetSitterReservation.reverse();
    setFilteredOrderList(tempPetSitterReservation);

  }, [selectedOption, allOrderList, startDate, endDate, searchQuery]);

  return (
    <>
      <div className="mypage-reservation">
        <h4>펫시터 예약내역</h4>
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
