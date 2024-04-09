import { Link, useNavigate } from 'react-router-dom';
import './Header.scss';
import { getCookie } from '../util/constants';

function Header() {
  const nav = useNavigate();
  const JWT = getCookie('jwt');

  const logout = () => {
    document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  };

  return (
    <header className="header">
      <div className="header_inner">
        <h1>
          <Link to={'/'}>
            <span>Pet</span>
            <span>Sitter.</span>
          </Link>
        </h1>
        <ul>
          <li>
            <Link to={'/pet-sitter'}>펫시터</Link>
          </li>
          <li>
            <Link to={'/'}>이용후기</Link>
          </li>
          {JWT ? (
            <>
              <li>
                <Link to={'/mypage/reservation'}>마이페이지</Link>
              </li>
              <li>
                <a
                  href=""
                  onClick={(e) => {
                    e.preventDefault();
                    logout();
                    nav('/', { replace: true });
                  }}
                >
                  로그아웃
                </a>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to={'/login'}>로그인</Link>
              </li>
              <li>
                <Link to={'/sign-up'}>회원가입</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
}

export default Header;
