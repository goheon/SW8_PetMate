import { useEffect, useState } from 'react';
import { useNavigate, Link, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileImageEditModal from '../components/mypage/ProfileImgEditModal';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { fetchUserInfo } from '../components/mypage/util/APIrequest';
import { setUserInfo } from '../store';
import './mypage.scss';

function Mypage() {
  const [isPmenuOn, setIsPmenuOn] = useState(false);
  const [isModalOn, setIsModalOn] = useState(false);
  const dispatch = useDispatch();
  const nav = useNavigate();

  const loginUserInfo = useSelector((state) => state.loginUserInfo) ?? setLoginUserInfo();

  async function setLoginUserInfo() {
    const resData = await fetchUserInfo();
    dispatch(setUserInfo(resData));
  }

  useEffect(() => {
    if (loginUserInfo.isRole === '1') {
      setIsPmenuOn(true);
    }
  }, [loginUserInfo]);

  //펫시터 메뉴 클릭의 Pmenu 핸들링
  const handleButton = () => {
    loginUserInfo.isRole === '1' ? null : nav('/mypage/join-expert');
  };

  const handleProfileImgEdit = () => {
    setIsModalOn((isModalOn) => !isModalOn);
  };

  //펫시터 메뉴 내부 상태
  const PetSitterMenu = () => {
    return (
      <>
        <>
          <li>
            <Link to={'/mypage/petSitter-reservation'}>펫시터 예약 관리</Link>
          </li>
          <li>
            <Link to={'/mypage/petssiter-info'}>펫시터 정보관리</Link>
          </li>
          <li>
            <Link to={'/mypage/petssiter-review'}>펫시터 리뷰관리</Link>
          </li>
        </>
      </>
    );
  };

  return (
    <>
      <Header />
      <section className="mypage">
        <div className="mypage_inner">
          <div className="mypage_left">
            <div className="mypage-info">
              <div>
                <div className="mypage-info_img">
                  <div className="mypage-info_img-box">
                    <img
                      className="defalut"
                      // src="https://elice-project2-pet-mate.s3.ap-northeast-2.amazonaws.com/contents/default_profile.png"
                      src={loginUserInfo.image ? `${loginUserInfo.image[0]}` : null}
                      alt=""
                    />
                  </div>
                  <div className="camera" onClick={handleProfileImgEdit}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                      <path d="M149.1 64.8L138.7 96H64C28.7 96 0 124.7 0 160V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H373.3L362.9 64.8C356.4 45.2 338.1 32 317.4 32H194.6c-20.7 0-39 13.2-45.5 32.8zM256 192a96 96 0 1 1 0 192 96 96 0 1 1 0-192z" />
                    </svg>
                  </div>
                  <ProfileImageEditModal isOpen={isModalOn} onClose={handleProfileImgEdit} />
                </div>
                <div className="mypage-info_text">
                  <h5>{loginUserInfo.username}</h5>
                  <p>{loginUserInfo.email}</p>
                </div>
              </div>

              <div className="mypage-point">
                <h5>Point</h5>
                <p>
                  {loginUserInfo.point ? loginUserInfo.point.toLocaleString() : 0} <span>P</span>
                </p>
              </div>

              <div className={`mypage-expert ${loginUserInfo.isRole == '1' ? 'on' : null} `}>
                <button type="button" onClick={handleButton}>
                  {loginUserInfo.isRole !== '1' ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path d="M32 96l320 0V32c0-12.9 7.8-24.6 19.8-29.6s25.7-2.2 34.9 6.9l96 96c6 6 9.4 14.1 9.4 22.6s-3.4 16.6-9.4 22.6l-96 96c-9.2 9.2-22.9 11.9-34.9 6.9s-19.8-16.6-19.8-29.6V160L32 160c-17.7 0-32-14.3-32-32s14.3-32 32-32zM480 352c17.7 0 32 14.3 32 32s-14.3 32-32 32H160v64c0 12.9-7.8 24.6-19.8 29.6s-25.7 2.2-34.9-6.9l-96-96c-6-6-9.4-14.1-9.4-22.6s3.4-16.6 9.4-22.6l96-96c9.2-9.2 22.9-11.9 34.9-6.9s19.8 16.6 19.8 29.6l0 64H480z" />
                      </svg>
                      <p>펫시터 전환</p>
                    </>
                  ) : (
                    <>
                      <div>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                          <path d="M269.4 2.9C265.2 1 260.7 0 256 0s-9.2 1-13.4 2.9L54.3 82.8c-22 9.3-38.4 31-38.3 57.2c.5 99.2 41.3 280.7 213.6 363.2c16.7 8 36.1 8 52.8 0C454.7 420.7 495.5 239.2 496 140c.1-26.2-16.3-47.9-38.3-57.2L269.4 2.9zM160 154.4c0-5.8 4.7-10.4 10.4-10.4h.2c3.4 0 6.5 1.6 8.5 4.3l40 53.3c3 4 7.8 6.4 12.8 6.4h48c5 0 9.8-2.4 12.8-6.4l40-53.3c2-2.7 5.2-4.3 8.5-4.3h.2c5.8 0 10.4 4.7 10.4 10.4V272c0 53-43 96-96 96s-96-43-96-96V154.4zM216 288a16 16 0 1 0 0-32 16 16 0 1 0 0 32zm96-16a16 16 0 1 0 -32 0 16 16 0 1 0 32 0z" />
                        </svg>
                        <p>펫시터회원</p>
                      </div>
                      <div>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                          <path d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416H416c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z" />
                        </svg>
                        <p className="bell-length">2</p>
                      </div>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="mypage-nav">
              <ul>
                <li>
                  <Link to={'/mypage/account'}>계정설정</Link>
                </li>
                <li>
                  <Link to={'/mypage/reservation'}>예약내역</Link>
                </li>
                <li>
                  <Link to={'/mypage/review'}>리뷰관리</Link>
                </li>
                <li>
                  <Link to={'/mypage/point'}>포인트관리</Link>
                </li>
                {/* 펫시터 회원 체크 후 아래 메뉴 노출 */}
                {isPmenuOn && <PetSitterMenu />}
              </ul>
            </div>
          </div>
          <div className="mypage_right">
            <Outlet></Outlet>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Mypage;
