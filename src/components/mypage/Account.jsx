import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Swal from 'sweetalert2';

import AddressAPI from '../AddressAPI';
import { ButtonLoading } from '../Spinner';
import { setUserInfo } from '../../store';
import { fetchWithdrawal, fetchUpdateUser } from './util/APIrequest';

const phoneAutoHyphen = (target) => {
  target.value = target.value
    .replace(/[^0-9]/g, '')
    .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, '$1-$2-$3')
    .replace(/(\-{1,2})$/g, '');

  return target;
};

function Account() {
  const nav = useNavigate();
  const loginUserInfo = useSelector((state) => state.loginUserInfo);
  const [name, setName] = useState(loginUserInfo ? loginUserInfo.username : '');
  const [phone, setPhone] = useState(loginUserInfo ? loginUserInfo.phone : '');
  const [address, setAddress] = useState(loginUserInfo ? loginUserInfo.address : '');
  const [address2, setAddress2] = useState(loginUserInfo ? loginUserInfo.address : '');
  const [detailAddress, setDetailAddress] = useState(loginUserInfo ? loginUserInfo.detailAddress : '');
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    if (loginUserInfo) {
      setName(loginUserInfo.username);
      setPhone(loginUserInfo.phone);
      setAddress2(loginUserInfo.address);
      setDetailAddress(loginUserInfo.detailAddress);
    }
  }, [loginUserInfo]);

  useEffect(() => {
    setAddress2(address.address);
  }, [address]);

  const [isNameModify, setIsNameModify] = useState(false);
  const [isPhoneModify, setIsPhoneModify] = useState(false);
  const [isAddressModify, setIsAddressModify] = useState(false);
  const [isPassWordModify, setIsPassWordModify] = useState(false);

  const [nameLoadingState, setNameLoadingState] = useState(false);
  const [phoneLoadingState, setPhoneLoadingState] = useState(false);
  const [pwLoadingState, setPwLoadingState] = useState(false);
  const [addressLoadingState, setAddressLoadingState] = useState(false);

  //이름수정 버튼 핸들링
  const updateName = async () => {
    const userInfo = {
      ...loginUserInfo,
      username: name,
    };
    setNameLoadingState(true);
    dispatch(setUserInfo(userInfo));
    const response = await fetchUpdateUser({ username: name });
    if (!response.ok) throw new Error('Network response was not ok');
    setNameLoadingState(false);
    setIsNameModify(false);
    alertEditComplete();
  };

  //핸드폰번호 수정 버튼 핸들링
  const updatePhone = async () => {
    const userInfo = {
      ...loginUserInfo,
      phone: phone,
    };
    setPhoneLoadingState(true);
    dispatch(setUserInfo(userInfo));
    const response = await fetchUpdateUser({ phone: phone });
    if (!response.ok) throw new Error('Network response was not ok');
    setPhoneLoadingState(false);
    setIsPhoneModify(false);
    alertEditComplete();
  };

  //비밀번호 수정 버튼 핸들링
  const updatePassword = async () => {
    const userInfo = {
      ...loginUserInfo,
      password: CryptoJS.SHA256(password).toString(),
    };
    setPwLoadingState(true);
    dispatch(setUserInfo(userInfo));
    const response = await fetchUpdateUser({ password: CryptoJS.SHA256(password).toString() });
    if (!response.ok) throw new Error('Network response was not ok');
    setPwLoadingState(false);
    setIsPassWordModify(false);
    alertEditComplete();
  };

  //주소 수정 핸들링
  const updateAddress = async () => {
    const userInfo = {
      ...loginUserInfo,
      address: address2,
      detailAddress: detailAddress,
    };
    setAddressLoadingState(true);
    dispatch(setUserInfo(userInfo));
    const response = await fetchUpdateUser({ address: address2, detailAddress: detailAddress });
    if (!response.ok) throw new Error('Network response was not ok');
    setAddressLoadingState(false);
    setIsAddressModify(false);
    alertEditComplete();
  };

  //탈퇴버튼 핸들링
  const handleWithdrawal = () => {
    Swal.fire({
      title: '정말로 탈퇴하시겠습니까?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '확인',
      cancelButtonText: '취소',
      customClass: { container: 'custom-popup' },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await fetchWithdrawal();

        if (!response.ok) throw new Error('Network response was not ok');

        Swal.fire({
          title: '탈퇴완료',
          text: '서비스를 이용해주셔서 감사합니다.',
          icon: 'success',
          customClass: { container: 'custom-popup' },
        });

        //탈퇴 후 로그아웃, 홈 이동
        logout();
        nav('/', { replace: true });
      }
    });
  };

  //수정완료 알림
  function alertEditComplete() {
    Swal.fire({
      title: '수정 완료',
      text: '',
      icon: 'success',
      customClass: { container: 'custom-popup' },
    });
  }

  //로그아웃
  const logout = () => {
    document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    dispatch(setUserInfo(null));
  };

  return (
    <>
      <div className="mypage-account">
        <h4>계정설정</h4>
        <div className="mypage-account_setting">
          <table>
            <tbody>
              <tr>
                <td>이름</td>
                <td>
                  {isNameModify && loginUserInfo ? (
                    <>
                      <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                        }}
                      />
                      <button
                        onClick={() => {
                          setName(loginUserInfo ? loginUserInfo.username : '');
                          setIsNameModify(false);
                        }}
                        className="cancel"
                      >
                        취소
                      </button>
                      <button onClick={updateName}>
                        {nameLoadingState === true ? <ButtonLoading size={15} /> : '수정'}
                      </button>
                    </>
                  ) : (
                    <>
                      <p>{loginUserInfo ? loginUserInfo.username : ''}</p>
                      <svg
                        onClick={() => {
                          setIsNameModify(true);
                        }}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
                      </svg>
                    </>
                  )}
                </td>
              </tr>
              <tr>
                <td>핸드폰번호</td>
                <td>
                  {isPhoneModify ? (
                    <>
                      <input
                        type="text"
                        name="phone"
                        value={phone}
                        maxLength={13}
                        onChange={(e) => {
                          setPhone(phoneAutoHyphen(e.target).value);
                        }}
                      />
                      <button
                        onClick={() => {
                          setPhone(loginUserInfo ? loginUserInfo.phone : '');
                          setIsPhoneModify(false);
                        }}
                        className="cancel"
                      >
                        취소
                      </button>
                      <button onClick={updatePhone}>
                        {phoneLoadingState === true ? <ButtonLoading size={15} /> : '수정'}
                      </button>
                    </>
                  ) : (
                    <>
                      <p>{loginUserInfo ? loginUserInfo.phone : ''}</p>
                      <svg
                        onClick={() => {
                          setIsPhoneModify(true);
                        }}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
                      </svg>
                    </>
                  )}
                </td>
              </tr>
              <tr>
                <td>비밀번호</td>
                <td>
                  {isPassWordModify ? (
                    <>
                      <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                      />
                      <button
                        onClick={() => {
                          setPassword('');
                          setIsPassWordModify(false);
                        }}
                        className="cancel"
                      >
                        취소
                      </button>
                      <button onClick={updatePassword}>
                        {pwLoadingState === true ? <ButtonLoading size={15} /> : '수정'}
                      </button>
                    </>
                  ) : (
                    <>
                      <p>******</p>
                      <svg
                        onClick={() => {
                          setIsPassWordModify(true);
                        }}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
                      </svg>
                    </>
                  )}
                </td>
              </tr>
              <tr>
                <td>주소</td>
                <td>
                  {isAddressModify ? (
                    <>
                      <div className="address-wrap">
                        <input
                          value={address2}
                          disabled
                          id="edit-address"
                          type="text"
                          name="address"
                          placeholder="주소"
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
                        {isOpen && <AddressAPI setIsOpen={setIsOpen} setInputValues={setAddress} />}
                      </div>
                      <div className="address-wrap-2">
                        <br />
                        <input
                          type="text"
                          name="detailAdress"
                          value={detailAddress}
                          onChange={(e) => {
                            setDetailAddress(e.target.value);
                          }}
                        />

                        <button
                          onClick={() => {
                            setAddress(loginUserInfo ? `${loginUserInfo.address} ${loginUserInfo.detailAddress}` : '');
                            setIsAddressModify(false);
                            console.log(address, detailAddress);
                          }}
                          className="cancel"
                        >
                          취소
                        </button>
                        <button onClick={updateAddress}>
                          {addressLoadingState === true ? <ButtonLoading size={15} /> : '수정'}
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p>{loginUserInfo ? `${loginUserInfo.address} ${loginUserInfo.detailAddress}` : ''}</p>
                      <svg
                        onClick={() => {
                          setIsAddressModify(true);
                        }}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
                      </svg>
                    </>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <h4>계정탈퇴</h4>
        <table>
          <tbody>
            <tr>
              <td>계정탈퇴</td>
              <td>
                <p>탈퇴 후 복구할 수 없습니다. 신중하게 결정해주세요.</p>
                <br />
                <button className="withdrawal" onClick={handleWithdrawal}>
                  탈퇴하기
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Account;
