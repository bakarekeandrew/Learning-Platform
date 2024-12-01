import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import logo from "./images/logo.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faChalkboardUser } from "@fortawesome/free-solid-svg-icons";

function Navbar(props) {
  const { t } = useTranslation();
  const value = props.page;
  const navigate = useNavigate();
  const authToken = localStorage.getItem("token");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    localStorage.removeItem("id");
    localStorage.removeItem("profileImage");
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div>
      <nav>
        <div className="logo1">
          <img src={logo} alt="" />
        </div>
        <div className="navigation">
          <div id="menu-btn">
            <div className="menu-dash" onClick={toggleMobileMenu}>
              &#9776;
            </div>
          </div>
          <i
            id="menu-close"
            className="fas fa-times"
            onClick={closeMobileMenu}
          ></i>
          <ul className={isMobileMenuOpen ? "active" : ""}>
            {isMobileMenuOpen && (
              <li className="close-button">
                <button onClick={closeMobileMenu}>X</button>
              </li>
            )}
            {value === "home" ? (
              <li style={{ backgroundColor: "purple", borderRadius: "5px" }}>
                <Link to={"/"} style={{ color: "white", padding: "10px" }}>
                  {t('navbar.home')}
                </Link>
              </li>
            ) : (
              <li>
                <Link to={"/"}>{t('navbar.home')}</Link>
              </li>
            )}
            {value === "courses" ? (
              <li style={{ backgroundColor: "purple", borderRadius: "5px" }}>
                <Link
                  to={"/courses"}
                  style={{ color: "white", padding: "10px" }}
                >
                  {t('navbar.courses')}
                </Link>
              </li>
            ) : (
              <li>
                <Link to={"/courses"}>{t('navbar.courses')}</Link>
              </li>
            )}
            {authToken ? (
              value === "profile" ? (
                <li style={{ backgroundColor: "purple", borderRadius: "5px" }}>
                  <Link
                    to={"/profile"}
                    style={{ color: "white", padding: "10px" }}
                  >
                    {t('navbar.profile')}
                    <FontAwesomeIcon icon={faUser} />
                  </Link>
                </li>
              ) : (
                <li>
                  <Link to={"/profile"}>
                    {t('navbar.profile')}
                    <FontAwesomeIcon icon={faUser} />
                  </Link>
                </li>
              )
            ) : (
              <></>
            )}
            {authToken ? (
              value === "learnings" ? (
                <li style={{ backgroundColor: "purple", borderRadius: "5px" }}>
                  <Link
                    to={"/learnings"}
                    style={{ color: "white", padding: "10px" }}
                  >
                    {t('navbar.learnings')}
                    <FontAwesomeIcon icon={faChalkboardUser} />
                  </Link>
                </li>
              ) : (
                <li>
                  <Link to={"/learnings"}>
                    {t('navbar.learnings')}
                    <FontAwesomeIcon icon={faChalkboardUser} />
                  </Link>
                </li>
              )
            ) : (
              <></>
            )}
            {authToken !== null ? (
              <li>
                <button onClick={handleLogOut} className="sign-out-button">
                  {t('navbar.sign_out')}
                </button>
              </li>
            ) : (
              <li>
                <button onClick={() => navigate("/login")}>
                  {t('navbar.login_signup')}
                </button>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;