import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Swal from 'sweetalert2';

import { setUserInfo } from '../../store';
import { API_URL } from '../../util/constants';

function Account() {
  const nav = useNavigate();
  const loginUserInfo = useSelector((state) => state.loginUserInfo);
  const [name, setName] = useState(loginUserInfo ? loginUserInfo.username : '');
  const [email, setEmail] = useState(loginUserInfo ? loginUserInfo.email : '');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    if (loginUserInfo) {
      setName(loginUserInfo.username);
      setEmail(loginUserInfo.email);
    }
  }, [loginUserInfo]);

  const [isNameModify, setIsNameModify] = useState(false);
  const [isEmailModify, setIsEmailModify] = useState(false);
  const [isPassWordModify, setIsPassWordModify] = useState(false);

  //로그아웃
  const logout = () => {
    document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    dispatch(setUserInfo(null));
  };

  //수정요청
  async function updateUser(userInfo) {
    try {
      const response = await fetch(`${API_URL}/mypage`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userInfo),
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Network response was not ok');

      Swal.fire({
        title: '수정 완료',
        text: '',
        icon: 'success',
        customClass: { container: 'custom-popup' },
      });
    } catch (error) {
      console.error('Error:', error);
    }
  }

  //이름수정 버튼 핸들링
  const updateName = () => {
    const userInfo = {
      ...loginUserInfo,
      username: name,
    };
    dispatch(setUserInfo(userInfo));
    setIsNameModify(false);
    updateUser({ username: name });
  };

  //이메일 수정 버튼 핸들링
  const updateEmail = () => {
    const userInfo = {
      ...loginUserInfo,
      email: email,
    };
    dispatch(setUserInfo(userInfo));
    setIsEmailModify(false);
    updateUser({ email: email });
  };

  //비밀번호 수정 버튼 핸들링
  const updatePassword = () => {
    const userInfo = {
      ...loginUserInfo,
      password: CryptoJS.SHA256(password).toString(),
    };
    dispatch(setUserInfo(userInfo));
    setIsPassWordModify(false);
    updateUser({ password: CryptoJS.SHA256(password).toString() });
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
        try {
          //탈퇴요청
          const response = await fetch(`${API_URL}/mypage/resign`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          });

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
        } catch (error) {
          console.error('Error:', error);
        }
      }
    });
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
                      <button onClick={updateName}>수정</button>
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
                <td>이메일</td>
                <td>
                  {isEmailModify ? (
                    <>
                      <input
                        type="text"
                        name="eamil"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                      />
                      <button
                        onClick={() => {
                          setEmail(loginUserInfo ? loginUserInfo.email : '');
                          setIsEmailModify(false);
                        }}
                        className="cancel"
                      >
                        취소
                      </button>
                      <button onClick={updateEmail}>수정</button>
                    </>
                  ) : (
                    <>
                      <p>{loginUserInfo ? loginUserInfo.email : ''}</p>
                      <svg
                        onClick={() => {
                          setIsEmailModify(true);
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
                      <button onClick={updatePassword}>수정</button>
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
