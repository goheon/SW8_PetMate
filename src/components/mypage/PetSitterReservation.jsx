import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { setAllPetSitterOrderList } from '../../store';
import { fetchGetPetSitterBookList, fetchGetSitterInfo } from './util/APIrequest';
import 'react-datepicker/dist/react-datepicker.css';
//
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

//필터 옵션
const options = [
  { value: 'all', label: '전체상품' },
  { value: 'request', label: '예약요청' },
  { value: 'ongoing', label: '진행중' },
  { value: 'completion', label: '완료' },
  { value: 'cancellation', label: '취소' },
];

//예약내역 리스트 컴포넌트
const OrderList = (props) => {
  const addressList = props.sitteraddress ? props.sitteraddress.split(' ') : undefined;
  const formedSitterAddress = addressList ? `${addressList[0]} ${addressList[1]}` : undefined;

  const handleComplete = async (e) => {
    // const orderId = e.target.value;
    //주문 상태 변경 API 연결(진행중 -> 완료)
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
            <p className="title">{props.petSitterInfo.title}</p>
            <h5>{props.totalPrice.toLocaleString()}원</h5>
            <h6>
              {formedSitterAddress} 파트너 · {props.sittername} 님
            </h6>
          </div>
          <div className="btn-box">
            <Link to={`/mypage/order-view/${props.orderId}`}>상세내용</Link>
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
  const loginUserInfo = useSelector((state) => state.loginUserInfo);
  const allOrderList = useSelector((state) => state.allPetSitterOrderList);
  const [onFilter, setOnFilter] = useState(false);
  const [filterOrderList, setFilterOrderList] = useState([]);
  const [sitterInfo, setSitterInfo] = useState();
  const dispatch = useDispatch();
  const nav = useNavigate();
  //필터 날짜
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

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
    let beginTime = new Date();
    beginTime.setHours(0, 0, 0);
    setStartDate(beginTime);

    let endTime = new Date();
    endTime.setHours(23, 59, 59);
    setEndDate(endTime);

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

  return (
    <>
      <div className="mypage-reservation">
        <h4>펫시터 예약내역</h4>
        <ul className="mypage-board">
          <li>
            <p>예약요청</p>
            <strong>
              {onFilter
                ? filterOrderList.filter((el) => el.state === '예약요청').length
                : allOrderList.filter((el) => el.state === '예약요청').length}
            </strong>
          </li>
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
                if (selectedOption.value === 'all' || selectedOption.label === el.state) {
                  const createdAtObject = new Date(el.createdAt);
                  if (
                    startDate.getTime() <= createdAtObject.getTime() &&
                    createdAtObject.getTime() <= endDate.getTime()
                  ) {
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
          {allOrderList.length > 0 &&
            (onFilter
              ? filterOrderList.map((el) => <OrderList key={el.orderId} {...el} />)
              : allOrderList.map((el) => <OrderList key={el.orderId} {...el} />))}
        </ul>
      </div>
    </>
  );
}

export default Reservation;
