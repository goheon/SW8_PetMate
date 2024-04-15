import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { setAllOrderList } from '../../store';
import { fetchGetBookList } from './util/APIrequest';
import Swal from 'sweetalert2';

function OrderView() {
  const { id } = useParams();
  const allOrderList = useSelector((state) => state.allOrderList);
  const loginUserInfo = useSelector((state) => state.loginUserInfo);
  const [order, setOrder] = useState(allOrderList.find((el) => el.orderId == id));
  const dispatch = useDispatch();

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
    if (allOrderList.length > 0) {
      const selectedOrder = allOrderList.find((el) => el.orderId === id);
      if (selectedOrder) {
        setOrder(selectedOrder);
      } else {
        // id에 해당하는 주문이 없는 경우 예외 처리
        console.log('Order not found');
      }
    }
  }, [id, allOrderList]);

  if (!order) {
    return;
  }

  const startObject = new Date(order.startDate);
  const endObject = new Date(order.endDate);
  const createdAtObject = new Date(order.createdAt);

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
                  {order.pets.map((obj) => {
                    return (
                      <p style={{ width: '100%' }}>
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
                  <p>{loginUserInfo.username}</p>
                </td>
              </tr>
              <tr>
                <td>연락처</td>
                <td>
                  <p>{loginUserInfo.phone}</p>
                </td>
              </tr>
              <tr>
                <td>주소</td>
                <td>
                  <p>{`${loginUserInfo.address} ${loginUserInfo.detailAddress}`}</p>
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
                    {order.petSitterInfo.experience.map((el) => {
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
        {order.state === '예약요청' && loginUserInfo.userId === order.petSitterInfo.userId ? (
          <div className="accept-reject-buttons">
            <button type="button">예약 확정</button>
            <button type="button">예약 거절</button>
          </div>
        ) : undefined}
      </div>
    </>
  );
}

export default OrderView;
