import { Link } from "react-router-dom";
import "./Header.scss";

function Header() {
	return (
		<header className="header">
			<div className="header_inner">
				<h1>
					<Link to={"/"}>
						<span>Pet</span>
						<span>Sitter.</span>
					</Link>
				</h1>
				<ul>
					<li>
						<Link to={"/pet"}>펫시터</Link>
					</li>
					<li>
						<Link to={"/"}>이용후기</Link>
					</li>
					<li>
						<Link to={"/login"}>로그인</Link>
					</li>
					<li>
						<Link to={"/"}>회원가입</Link>
					</li>
				</ul>
			</div>
		</header>
	);
}

export default Header;
