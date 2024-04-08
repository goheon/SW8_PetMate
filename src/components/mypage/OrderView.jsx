function OrderView() {
  return (
    <>
      <div className="mypage-order-view">
        <h4>주문 상세 내역</h4>
        <div>
          <h5>구매자 정보</h5>
          <p>주문번호 <span>202403301402520001</span></p>
          <p>예약일시 <span>2024.03.30 14:03</span> </p>
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
                <td>반려동물 정보</td>
                <td>
                  <p>강아지 / 말티즈 / 3세 / 소형</p>
                </td>
              </tr>
              <tr>
                <td>요청사항</td>
                <td>
                  <p>저희 강아지는 물어요</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default OrderView;
