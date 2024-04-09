import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import { useSelector } from 'react-redux';

import 'react-datepicker/dist/react-datepicker.css';

//날짜 설정 컴포넌트
const Day = ({ inputDate, setInputDate }) => {
  return <DatePicker showIcon dateFormat="yyyy/MM/dd" selected={inputDate} onChange={(date) => setInputDate(date)} />;
};

//필터 옵션
const options = [
  { value: 'all', label: '전체상품' },
  { value: 'ongoing', label: '진행중' },
  { value: 'completion', label: '완료' },
  { value: 'cancellation', label: '취소' },
];

//예약내역 리스트 컴포넌트
const OrderList = ({ orderId, state, createdAt, totalPrice }) => {
  return (
    <li key={orderId}>
      <div className="mypage-reservation-list_state">
        <h6>{state}</h6>
        <p>
          예약일시
          <span>{createdAt.toLocaleDateString()}</span>
        </p>
      </div>
      <div className="mypage-reservation-list_info">
        <div className="img-box">
          <img src="https://d1cd60iwvuzqnn.cloudfront.net/page/ede014a198634e058c55cab16fa36387.jpg" alt="" />
        </div>
        <div className="mypage-reservation-list_info_right">
          <div className="text-box">
            <p className="title">
              <span>#{orderId}</span>
              사랑이넘치는1:1맞춤케어😍
            </p>
            <h5>{totalPrice.toLocaleString()}원</h5>
            <h6>서울 동작구 파트너 · 정◯선 님</h6>
          </div>
          <div className="btn-box">
            <Link to={`/mypage/order-view/${orderId}`}>상세내용</Link>
            <Link>리뷰쓰기</Link>
          </div>
        </div>
      </div>
    </li>
  );
};

function Reservation() {
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const loginUserInfo = useSelector((state) => state.loginUserInfo);
  const allOrderList = useSelector((state) => state.allOrderList);

  const [onFilter, setOnFilter] = useState(false);
  const [filterOrderList, setFilterOrderList] = useState([]);

  //필터 날짜
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
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
      <div className="mypage-reservation">
        <h4>예약내역</h4>
        <ul className="mypage-board">
          <li>
            <p>진행중</p>
            <strong>
              {onFilter
                ? filterOrderList.filter((el) => el.state === '진행중').length
                : allOrderList.filter((el) => el.state === '진행중').length}
            </strong>
          </li>
          <li>
            <p>완료된 시팅</p>
            <strong>
              {onFilter
                ? filterOrderList.filter((el) => el.state === '완료').length
                : allOrderList.filter((el) => el.state === '완료').length}
            </strong>
          </li>
          <li>
            <p>취소된 시팅</p>
            <strong>
              {onFilter
                ? filterOrderList.filter((el) => el.state === '취소').length
                : allOrderList.filter((el) => el.state === '취소').length}
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
            <Day inputDate={startDate} setInputDate={setStartDate} />
          </div>
          <div className="mypage-filter_end-day">
            <Day inputDate={endDate} setInputDate={setEndDate} />
          </div>
          <div className="mypage-filter_search">
            <input type="text" placeholder="검색어입력" />
          </div>
          <button
            onClick={() => {
              const filterArr = allOrderList.filter((el) => {
                if (selectedOption.value === 'all'|| selectedOption.label === el.state) {
                  if (startDate.getTime() <= el.createdAt.getTime() && el.createdAt.getTime() <= endDate.getTime()) {
                    return true;
                  }
                }

                return false;
              });
              setOnFilter(true);
              setFilterOrderList(filterArr);
            }}
          >
            조회
          </button>
        </div>
        <ul className="mypage-reservation-list">
          {onFilter
            ? filterOrderList.map((el) => <OrderList {...el} />)
            : allOrderList.map((el) => <OrderList {...el} />)}
        </ul>
      </div>
    </>
  );
}

export default Reservation;
