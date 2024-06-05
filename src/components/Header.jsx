import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import './Header.scss';
import { getCookie } from '../util/constants';
import { setUserInfo } from '../store';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = useNavigate();
  const JWT = getCookie('jwt');
  const dispatch = useDispatch();
  const menuRef = useRef(null);
  const toggleRef = useRef(null);

  const logout = () => {
    document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    dispatch(setUserInfo(null));
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleClickOutside = (event) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      toggleRef.current &&
      !toggleRef.current.contains(event.target)
    ) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <div className="header_inner">
        <h1>
          <Link to={'/'}>
            <span>Pet</span>
            <span>Mate.</span>
          </Link>
        </h1>
        <button ref={toggleRef} className="menu-toggle" onClick={toggleMenu}>
          ☰
        </button>
        <ul ref={menuRef} className={menuOpen ? 'active' : ''}>
          <li>
            <Link to={'/pet-sitter'}>펫시터</Link>
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
