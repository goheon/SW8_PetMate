import React, { useState } from 'react';
import Header from '../components/Header';
import './signUp.scss';
import Footer from '../components/Footer';
import AddressAPI from '../components/AddressAPI';
import Swal from 'sweetalert2';

function validateName(name) {
  // 한글, 알파벳 대소문자만 허용하는 정규식
  const re = /^[가-힣A-Za-z]+$/;
  // 정규식 테스트 결과를 반환
  return re.test(name);
}

function validateEmail(email) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validatePassword(password) {
  // 정규식: 8~16자의 영문 대소문자, 숫자, 특수문자가 1개 이상 조합
  const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,16}$/;
  return regex.test(password);
}

function SignUp() {
  const [isOpen, setIsOpen] = useState(false);

  const [inputValues, setInputValues] = useState({
    name: '',
    email: '',
    password: '',
    postcode: '',
    address: '',
    addressDetail: '',
  });

  const [touchedInputs, setTouchedInputs] = useState({
    name: false,
    email: false,
    password: false,
    postcode: false,
    address: false,
    addressDetail: false,
  });

  const handleInputChange = (e) => {
    setInputValues({
      ...inputValues,
      [e.target.name]: e.target.value,
    });

    setTouchedInputs({
      ...touchedInputs,
      [e.target.name]: true,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;
    const address = e.target.address.value;
    const addressDetail = e.target.addressDetail.value;
    const password = e.target.password.value;

    if (!name || !email || !address || !addressDetail || !password) {
      Swal.fire({
        title: '필수값을 입력해주세요.',
        text: `이름, 번호, 이메일, 주소, 비밀번호 모두 입력하세요`,
        icon: 'warning',
        customClass: {
          container: 'custom-popup',
        },
      });
      return;
    }
  };

  return (
    <>
      <Header />
      <section className="sing-up">
        <div className="sing-up_inner">
          <h3>펫메이트에 오신 것을 환영합니다</h3>

          <div className="sing-up_wrap">
            <form
              onSubmit={handleSubmit}
              action="http://localhost:3000/api/v1/auth/sign-up"
              method="post"
            >
              <div
                className={`name-wrap ${touchedInputs.name && !validateName(inputValues.name) ? 'invalid' : ''} ${
                  touchedInputs.name && validateName(inputValues.name) ? 'valid' : ''
                }`}
              >
                <p>
                  이름
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
                  </svg>
                </p>
                <input
                  value={inputValues.name}
                  onChange={handleInputChange}
                  className="sing-up_name"
                  type="text"
                  name="name"
                />
              </div>

              <div
                className={`email-wrap email-wrap-01 ${
                  touchedInputs.email && !validateEmail(inputValues.email) ? 'invalid' : ''
                } ${touchedInputs.email && validateEmail(inputValues.email) ? 'valid' : ''}`}
              >
                <p>
                  이메일
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
                  </svg>
                </p>
                <input
                  value={inputValues.email}
                  onChange={handleInputChange}
                  className="sing-up_email-01"
                  type="email"
                  name="email"
                  placeholder="예) kream@kream.co.kr"
                />
              </div>

              <div
                className={`password-wrap ${
                  touchedInputs.password && !validatePassword(inputValues.password) ? 'invalid' : ''
                } ${touchedInputs.password && validatePassword(inputValues.password) ? 'valid' : ''}`}
              >
                <p>
                  비밀번호
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
                  </svg>
                </p>
                <input
                  value={inputValues.password}
                  onChange={handleInputChange}
                  className="sing-up_password-01"
                  type="password"
                  name="password"
                  maxLength="16"
                />
                <p className="input_error">영문, 숫자, 특수문자를 조합해서 입력해주세요. (8-16자)</p>
              </div>

              <div className="address-wrap">
                <p>
                  주소
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
                  </svg>
                </p>
                <input
                  value={inputValues.postcode}
                  onChange={handleInputChange}
                  id="sing-up_postcode"
                  className="sing-up_postcode"
                  type="text"
                  name="postcode"
                  placeholder="우편번호"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(true);
                  }}
                  className="ja_find"
                >
                  우편번호 찾기
                </button>
                <input
                  value={inputValues.address}
                  id="sing-up_address"
                  className="sing-up_address"
                  type="text"
                  name="address"
                  placeholder="주소"
                />
              </div>

              <div className="address-wrap-2">
                <p>
                  상세주소
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
                  </svg>
                </p>
                <input
                  value={inputValues.addressDetail}
                  onChange={handleInputChange}
                  className="sing-up_detailAddress"
                  type="text"
                  name="addressDetail"
                  placeholder="상세주소"
                  id="sing-up_detailAddress"
                />
              </div>

              <input className="sing-up_submit" type="submit" value="회원가입" />
            </form>
          </div>
        </div>
      </section>
      {isOpen && <AddressAPI setIsOpen={setIsOpen} setInputValues={setInputValues} />}
      <Footer />
    </>
  );
}

export default SignUp;
