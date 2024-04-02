import Header from '../components/Header';
import './Login.scss';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

function validateEmail(email) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validPassword(password) {
  // 정규식: 8~16자의 영문 대소문자, 숫자, 특수문자가 1개 이상 조합
  const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,16}$/;
  return regex.test(password);
}

function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [isInputStarted, setIsInputStarted] = useState(false);

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
    setIsInputStarted(true);
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
    setIsInputStarted(true);
  };

  const handleSumit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!email || !password) {
      Swal.fire({
        title: '아이디, 비밀번호 모두 입력하세요',
        icon: 'warning',
        customClass: {
          container: 'custom-popup',
        },
      });
      return;
    }
  };

  useEffect(() => {
    if (isInputStarted) {
      setIsValidEmail(validateEmail(email));
    }
  }, [email]);

  useEffect(() => {
    if (isInputStarted) {
      setIsValidPassword(validPassword(password));
    }
  }, [password]);

  return (
    <>
      <Header />
      <section className="login">
        <div className="login_inner">
          <h3>
            <span>Pet</span>
            <span>Mate</span>
          </h3>
          <p>반려동물 케어 파트너 펫메이트</p>

          <div className="login_wrap">
            <form onSubmit={handleSumit} action="" method="post">
              <div className={'login-email-wrap ' + `${isValidEmail}`}>
                <p>이메일</p>
                <input
                  value={email}
                  onChange={handleChangeEmail}
                  className="login_email"
                  type="email"
                  name="email"
                  placeholder="예) kream@kream.co.kr"
                />
                <p className="input_error">이메일 주소를 정확히 입력해주세요.</p>
              </div>

              <div className={'login-password-wrap ' + `${isValidPassword}`}>
                <p>비밀번호</p>
                <input
                  value={password}
                  onChange={handleChangePassword}
                  className="login_password"
                  type="password"
                  name="password"
                  maxLength="16"
                />
                <p className="input_error">영문, 숫자, 특수문자를 조합해서 입력해주세요. (8-16자)</p>
              </div>

              <input className="login_submit" type="submit" value="이메일 로그인" />
            </form>

            <ul className="login_route">
              <li>
                <a href="/join/">회원 가입</a>
              </li>
              <li>
                <a href="">비밀번호 찾기</a>
              </li>
            </ul>

            <ul className="login_sns">
              <li>
                <Link className="kakao-login">
                  <span>
                    <svg viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg">
                      <path
                        fill="#000000"
                        d="M255.5 48C299.345 48 339.897 56.5332 377.156 73.5996C414.415 90.666 443.871 113.873 465.522 143.22C487.174 172.566 498 204.577 498 239.252C498 273.926 487.174 305.982 465.522 335.42C443.871 364.857 414.46 388.109 377.291 405.175C340.122 422.241 299.525 430.775 255.5 430.775C241.607 430.775 227.262 429.781 212.467 427.795C148.233 472.402 114.042 494.977 109.892 495.518C107.907 496.241 106.012 496.15 104.208 495.248C103.486 494.706 102.945 493.983 102.584 493.08C102.223 492.177 102.043 491.365 102.043 490.642V489.559C103.126 482.515 111.335 453.169 126.672 401.518C91.8486 384.181 64.1974 361.2 43.7185 332.575C23.2395 303.951 13 272.843 13 239.252C13 204.577 23.8259 172.566 45.4777 143.22C67.1295 113.873 96.5849 90.666 133.844 73.5996C171.103 56.5332 211.655 48 255.5 48Z"
                      ></path>
                    </svg>
                    카카오로 시작
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Login;
