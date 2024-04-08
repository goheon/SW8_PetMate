import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import Select from 'react-select';

import 'react-datepicker/dist/react-datepicker.css';

const Day = () => {
  const [startDate, setStartDate] = useState(new Date());
  return <DatePicker showIcon dateFormat="yyyy/MM/dd" selected={startDate} onChange={(date) => setStartDate(date)} />;
};

const options = [
  { value: 'all', label: '전체상품' },
  { value: 'ongoing', label: '진행중' },
  { value: 'completion', label: '완료' },
  { value: 'cancellation', label: '취소' },
];

function Reservation() {
  const [selectedOption, setSelectedOption] = useState(null);

  return (
    <>
      <div className="mypage-reservation">
        <h4>예약내역</h4>
        <ul className="mypage-board">
          <li>
            <p>진행중</p>
            <strong>0</strong>
          </li>
          <li>
            <p>완료된 시팅</p>
            <strong>0</strong>
          </li>
          <li>
            <p>취소된 시팅</p>
            <strong>0</strong>
          </li>
        </ul>
        <div className="mypage-filter">
          <div className="mypage-filter_state">
            <Select className='mypage-filter_state-options' placeholder={"전체상품"} options={options} onChange={setSelectedOption} defaultValue={selectedOption} />
          </div>
          <div className="mypage-filter_start-day">
            <Day />
          </div>
          <div className="mypage-filter_end-day">
            <Day />
          </div>
          <div className='mypage-filter_search'>
            <input type="text" placeholder='검색어입력' />
          </div>
          <button>조회</button>
        </div>
        <ul className="mypage-reservation-list">
          <li>
            <div className="mypage-reservation-list_state">
              <h6>완료</h6>
              <p>
                예약일시
                <span>24.04.04 21:30</span>
              </p>
            </div>
            <div className="mypage-reservation-list_info">
              <div className="img-box">
                <img src="https://d1cd60iwvuzqnn.cloudfront.net/page/ede014a198634e058c55cab16fa36387.jpg" alt="" />
              </div>
              <div className="mypage-reservation-list_info_right">
                <div className="text-box">
                  <p className="title">
                    <span>#1681082</span>
                    사랑이넘치는1:1맞춤케어😍
                  </p>
                  <h5>20,000원</h5>
                  <h6>서울 동작구 파트너 · 정◯선 님</h6>
                </div>
                <div className="btn-box">
                  <Link to={'/mypage/order-view/1'}>상세내용</Link>
                  <Link>리뷰쓰기</Link>
                </div>
              </div>
            </div>
          </li>
          <li>
            <div className="mypage-reservation-list_state">
              <h6>완료</h6>
              <p>
                예약일시
                <span>24.04.04 21:30</span>
              </p>
            </div>
            <div className="mypage-reservation-list_info">
              <div className="img-box">
                <img src="https://d1cd60iwvuzqnn.cloudfront.net/page/ede014a198634e058c55cab16fa36387.jpg" alt="" />
              </div>
              <div className="mypage-reservation-list_info_right">
                <div className="text-box">
                  <p className="title">
                    <span>#1681082</span>
                    사랑이넘치는1:1맞춤케어😍
                  </p>
                  <h5>20,000원</h5>
                  <h6>서울 동작구 파트너 · 정◯선 님</h6>
                </div>
                <div className="btn-box">
                  <Link>상세내용</Link>
                  <Link>리뷰쓰기</Link>
                </div>
              </div>
            </div>
          </li>
          <li>
            <div className="mypage-reservation-list_state">
              <h6>완료</h6>
              <p>
                예약일시
                <span>24.04.04 21:30</span>
              </p>
            </div>
            <div className="mypage-reservation-list_info">
              <div className="img-box">
                <img src="https://d1cd60iwvuzqnn.cloudfront.net/page/ede014a198634e058c55cab16fa36387.jpg" alt="" />
              </div>
              <div className="mypage-reservation-list_info_right">
                <div className="text-box">
                  <p className="title">
                    <span>#1681082</span>
                    사랑이넘치는1:1맞춤케어😍
                  </p>
                  <h5>20,000원</h5>
                  <h6>서울 동작구 파트너 · 정◯선 님</h6>
                </div>
                <div className="btn-box">
                  <Link>상세내용</Link>
                  <Link>리뷰쓰기</Link>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Reservation;
