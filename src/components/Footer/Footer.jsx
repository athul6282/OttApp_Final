
import "./Footer.css";
import logo from '../../assets/Logo.png'
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-left">
        <span className="footer-logo"><img src={logo} alt="Logo" /></span>
      </div>

      <div className="footer-center">
        © 2022, Application, may contain information not intended for minors
      </div>

      <div className="footer-right">
        <FaFacebookF />
        <FaTwitter />
        <FaLinkedinIn />
      </div>
    </footer>
  );
};

export default Footer;
