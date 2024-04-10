import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

function OrderView() {
  const { id } = useParams();
  const allOrderList = useSelector((state) => state.allOrderList);
  const order = allOrderList.find((el) => el.orderId == id);
  const startObject = new Date(order.start);
  const endObject = new Date(order.end);
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
                    const text = Object.values(obj).join(' / ');
                    return <p style={{ width: '100%' }}>{...text}</p>;
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
                  <p>이승철</p>
                </td>
              </tr>
              <tr>
                <td>연락처</td>
                <td>
                  <p>010-7252-7544</p>
                </td>
              </tr>
              <tr>
                <td>주소</td>
                <td>
                  <p>경기도 부천시 중동 쿵야마을</p>
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
                  <p>이승철</p>
                </td>
              </tr>
              <tr>
                <td>연락처</td>
                <td>
                  <p>010-7252-7544</p>
                </td>
              </tr>
              <tr>
                <td>주소</td>
                <td>
                  <p>경기도 부천시 중동 쿵야마을</p>
                </td>
              </tr>
              <tr>
                <td>반려 경험 및 경력</td>
                <td>
                  <ul>
                    <li>
                      <p>펫시터 전문가 교육 수료 전문</p>
                    </li>
                    <li>
                      <p>전문 펫시터 자격증 보유</p>
                    </li>
                    <li>
                      <p>강아지 반려 경험 (14년) 인증 완료</p>
                    </li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* && 담당 펫시터에게만 노출 */}
        {order.state === '예약 요청' ? (
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
