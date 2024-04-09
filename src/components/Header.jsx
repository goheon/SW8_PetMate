import { Link } from 'react-router-dom';
import './Header.scss';
import { getCookie } from '../util/constants';

function Header() {
  const JWT = getCookie('jwt');

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
                <Link to={'/'}>로그아웃</Link>
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
