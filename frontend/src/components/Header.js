import "../css/Header.css";
import logo from "../images/logo32.png";

export default function Header () {
    return (
        <div className="header" >
        <img src={logo} className="logo" ></img>
        
        <h1>BiCo Course Review</h1>
        </div>
    );
}