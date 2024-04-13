import Stars from '../Stars';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

function Review() {
  return (
    <>
      <div className="mypage-review">
        <h4>리뷰관리</h4>

        <ul className="mypage-reservation-list">
          <ReviewList />
        </ul>
      </div>

    </>
  );
}

//예약내역 리스트 컴포넌트
const ReviewList = () => {
  return (
    <li>
      <div className="mypage-reservation-list_state">
        <h6>여기뭐넣죠</h6>
        <p>
          작성일시
          <span>2024. 04. 11.</span>
        </p>
      </div>
      <div className="mypage-reservation-list_info">
        <div className="img-box">
          <img src="https://d1cd60iwvuzqnn.cloudfront.net/page/ede014a198634e058c55cab16fa36387.jpg" alt="" />
        </div>
        <div className="mypage-reservation-list_info_right">
          <div className="text-box">
            <Stars rating={5}/>
            <p>리뷰 글자수 제한할지... 리뷰 상세보기(?) 를 또 만들어야할지.... 고민...... 상세보기를 만든다면 리뷰 삭제를 없애고 넣을지? 리뷰삭제 불가한 사이트들도 꽤 있긴함.. 예약관리랑 너무 비슷한가요? 보라색톤으로 바꿀까용 </p>
            <p className="title">
              <span>#1</span>
              사랑이넘치는1:1맞춤케어😍
            </p>
            <h6>서울 동작구 파트너 · 정◯선 님</h6>
          </div>
          <div className="btn-box">
            <Link to={`/mypage/review`}>리뷰수정</Link>
            <Link to={`/mypage/review`}>리뷰삭제</Link>
          </div>
        </div>
      </div>
    </li>
  );
};

export default Review;