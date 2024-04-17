import { useState } from 'react';
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

  //펫시터 메뉴 클릭의 Pmenu 핸들링
  const handleButton = () => {
    loginUserInfo.isRole === '1' ? setIsPmenuOn(!isPmenuOn) : nav('/mypage/join-expert');
  };

  const handleProfileImgEdit = () => {
    setIsModalOn((isModalOn) => !isModalOn);
  };

  //펫시터 메뉴 내부 상태
  const PetSitterMenu = ({ isPmenuOn }) => {
    const [isMenuOn, setIsMenuOn] = useState(isPmenuOn);

    if (isPmenuOn !== isMenuOn) {
      setIsMenuOn(isPmenuOn);
    }
    return (
      <>
        {isMenuOn && (
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
        )}
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

              <div className="mypage-expert">
                <button type="button" onClick={handleButton}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M32 96l320 0V32c0-12.9 7.8-24.6 19.8-29.6s25.7-2.2 34.9 6.9l96 96c6 6 9.4 14.1 9.4 22.6s-3.4 16.6-9.4 22.6l-96 96c-9.2 9.2-22.9 11.9-34.9 6.9s-19.8-16.6-19.8-29.6V160L32 160c-17.7 0-32-14.3-32-32s14.3-32 32-32zM480 352c17.7 0 32 14.3 32 32s-14.3 32-32 32H160v64c0 12.9-7.8 24.6-19.8 29.6s-25.7 2.2-34.9-6.9l-96-96c-6-6-9.4-14.1-9.4-22.6s3.4-16.6 9.4-22.6l96-96c9.2-9.2 22.9-11.9 34.9-6.9s19.8 16.6 19.8 29.6l0 64H480z" />
                  </svg>
                  {loginUserInfo.isRole !== '1' ? (
                    <p>펫시터 전환</p>
                  ) : isPmenuOn === false ? (
                    <p>펫시터 메뉴 열기</p>
                  ) : (
                    <p>펫시터 메뉴 닫기</p>
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
                <PetSitterMenu isPmenuOn={isPmenuOn} />
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
