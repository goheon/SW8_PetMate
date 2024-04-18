import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { setAllOrderList, setAllPetSitterOrderList } from '../../store';
import {
  fetchGetBookList,
  fetchGetPetSitterBookList,
  fetchGetSitterInfo,
  fetchOrderAccept,
  fetchOrderReject,
} from './util/APIrequest';

function OrderView() {
  const { id } = useParams();
  const allOrderList = useSelector((state) => state.allOrderList);
  const allPetSitterOrderList = useSelector((state) => state.allPetSitterOrderList);
  const loginUserInfo = useSelector((state) => state.loginUserInfo);
  const [sitterInfo, setSitterInfo] = useState();
  const [order, setOrder] = useState(allOrderList.find((el) => el.orderId == id));
  const dispatch = useDispatch();
  const nav = useNavigate();

  //회원 예약목록 우선 조회
  useEffect(() => {
    async function getBookList() {
      const response = await fetchGetBookList();
      if (!response.ok) throw new Error('Network response was not ok');
      const { data } = await response.json();
      dispatch(setAllOrderList(data));
    }
    getBookList();
    setOrder(allOrderList.find((el) => el.orderId == id));
  }, [dispatch]);

  useEffect(() => {
    //회원의 예약목록인 경우
    const selectedOrder = allOrderList.find((el) => el.orderId === id);
    if (selectedOrder) {
      setOrder(selectedOrder);
    } else {
      //시터의 예약목록인 경우
      //로그인정보로 시터정보 조회
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
  }, [id, allOrderList]);

  useEffect(() => {
    //시터의 예약목록 조회
    async function getPestSitterBookList(sitterInfo) {
      console.log(sitterInfo);
      const response = await fetchGetPetSitterBookList(sitterInfo.sitterInfo.sitterId);
      if (!response.ok) throw new Error('Network response was not ok');
      const { data } = await response.json();
      dispatch(setAllPetSitterOrderList(data));
    }
    getPestSitterBookList(sitterInfo);
    //시터예약목록에서 주문 반환
    const selectedOrder = allPetSitterOrderList.find((el) => el.orderId === id);
    setOrder(selectedOrder);
  }, [sitterInfo]);

  if (!order) {
    return;
  }

  const startObject = new Date(order.startDate);
  const endObject = new Date(order.endDate);
  const createdAtObject = new Date(order.createdAt);

  const handleAccept = async () => {
    const response = await fetchOrderAccept(order.orderId);
    if (!response.ok) throw new Error('Network response was not ok');
    Swal.fire({
      title: '확정완료',
      text: '',
      icon: 'success',
      customClass: { container: 'custom-popup' },
    }).then((result) => nav(-1));
  };

  const handleReject = async () => {
    const response = await fetchOrderReject(order.orderId);
    if (!response.ok) throw new Error('Network response was not ok');
    Swal.fire({
      title: '거절완료',
      text: '',
      icon: 'success',
      customClass: { container: 'custom-popup' },
    }).then((result) => nav(-1));
  };

  return (
    <>
      <div className="mypage-order-view">
        <h4>주문 상세 내역</h4>
        <div>
          <h5>주문 정보</h5>
          <table>
            <tbody>
              <tr>
                <td>주문번호</td>
                <td>
                  <p>{order.orderId}</p>
                </td>
              </tr>
              <tr>
                <td>예약일시</td>
                <td>
                  <p>
                    {createdAtObject.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}{' '}
                    {createdAtObject.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                  </p>
                </td>
              </tr>
              <tr>
                <td>예약상태</td>
                <td>
                  <p>{order.state}</p>
                </td>
              </tr>
              <tr>
                <td>시팅시간</td>
                <td>
                  <p>
                    {startObject.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}{' '}
                    {startObject.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}~{' '}
                    {endObject.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}{' '}
                    {endObject.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}{' '}
                  </p>
                </td>
              </tr>
              <tr>
                <td>반려동물 정보</td>
                <td>
                  {order.pets.map((obj, i) => {
                    return (
                      <p key={i} style={{ width: '100%' }}>
                        {obj.type} / {obj.count}
                      </p>
                    );
                  })}
                </td>
              </tr>
              <tr>
                <td>요청사항</td>
                <td>
                  <p>{order.detailInfo}</p>
                </td>
              </tr>

              <tr>
                <td>가격</td>
                <td>
                  <p>{order.totalPrice.toLocaleString()}원</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <h5>구매자 정보</h5>
          <table>
            <tbody>
              <tr>
                <td>이름</td>
                <td>
                  <p>{order.username}</p>
                </td>
              </tr>
              <tr>
                <td>연락처</td>
                <td>
                  <p>{order.userphone}</p>
                </td>
              </tr>
              <tr>
                <td>주소</td>
                <td>
                  <p>{`${order.useraddress} ${order.userdetailaddress}`}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <h5>펫시터 정보</h5>
          <table>
            <tbody>
              <tr>
                <td>이름</td>
                <td>
                  <p>{order.sittername}</p>
                </td>
              </tr>
              <tr>
                <td>연락처</td>
                <td>
                  <p>{order.sitterphone}</p>
                </td>
              </tr>
              <tr>
                <td>주소</td>
                <td>
                  <p>{order.sitteraddress}</p>
                </td>
              </tr>
              <tr>
                <td>반려 경험 및 경력</td>
                <td>
                  <ul>
                    {order.petSitterInfo.sitterInfo.experience.map((el) => {
                      return (
                        <li>
                          <p>{el}</p>
                        </li>
                      );
                    })}
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* && 담당 펫시터에게만 노출 */}
        {order.state === '예약요청' && loginUserInfo.userId === order.petSitterInfo.sitterInfo.userId ? (
          <div className="accept-reject-buttons">
            <button type="button" onClick={handleAccept}>
              예약 확정
            </button>
            <button type="button" onClick={handleReject}>
              예약 거절
            </button>
          </div>
        ) : undefined}
      </div>
    </>
  );
}

export default OrderView;
