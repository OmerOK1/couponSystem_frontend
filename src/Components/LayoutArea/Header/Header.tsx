import AuthMenu from "../../AuthArea/AuthMenu/AuthMenu";
import Clock from "../../SharedArea/Clock/Clock";
import Logo from "../../SharedArea/Logo/Logo";
import "./Header.css";

function Header(): JSX.Element {
    return (
        <div className="Header flex-around">
            <Logo/>
			<h1>OK Coupons</h1>
            <AuthMenu/>
        </div>
    );
}

export default Header;
