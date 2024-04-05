const phoneAutoHyphen = (target) => {
  target.value = target.value
    .replace(/[^0-9]/g, '')
    .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, '$1-$2-$3')
    .replace(/(\-{1,2})$/g, '');
};

function JoinExpert() {
  return (
    <>
      <div className="mypage-join-expert">
        <h4>펫시터 전환</h4>
        <form action="">
          <div>
            <label htmlFor="phone">휴대폰 번호</label>
            <input type="text" name="phone" id="phone" placeholder="010-1234-5678" />
            <button className="phone-certified">휴대폰 번호인증</button>
            <input type="checkbox" name="" id="agreement" />
            <label className="agreement_label" htmlFor="agreement">
              펫메이트 이용약관에 동의합니다. (필수)
            </label>
          </div>
          <button className="registration">펫시터 등록</button>
        </form>
      </div>
    </>
  );
}

export default JoinExpert;
