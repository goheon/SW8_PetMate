function OrderView() {
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
                  <p>202403301402520001</p>
                </td>
              </tr>
              <tr>
                <td>예약일시</td>
                <td>
                  <p>2024.03.30 14:03</p>
                </td>
              </tr>
              <tr>
                <td>시팅시간</td>
                <td>
                  <p>2024.04.01 14:00 ~ 2024.04.01 16:00 (2시간)</p>
                </td>
              </tr>
              <tr>
                <td>반려동물 정보</td>
                <td>
                  <p>강아지 / 말티즈 / 3세 / 소형</p>
                </td>
              </tr>
              <tr>
                <td>특이사항</td>
                <td>
                  <p>저희 강아지는 물어요</p>
                </td>
              </tr>
              <tr>
                <td>요청사항</td>
                <td>
                  <p>방문산책</p>
                </td>
              </tr>

              <tr>
                <td>가격</td>
                <td>
                  <p>50,000원</p>
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
      </div>
    </>
  );
}

export default OrderView;
