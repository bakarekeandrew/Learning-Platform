import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import img1 from "../images/user.png";
import './SideBar.css';

function SideBar(props) {
  const { current } = props;
  const navigate = useNavigate();

  // Logout function
  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    localStorage.removeItem("id");
    localStorage.removeItem("profileImage");
    navigate("/"); // Redirect to home or login page
  };

  return (
    <div id="sidebar">
      <Link to={"/dashboard"} className="brand a">
        <img src={img1} alt="" />
        <span className="text" id="admin">
          LMS Admin
        </span>
      </Link>

      <ul className="side-menu">
        <li className={current === "dashboard" ? "active" : ""}>
          <Link to={"/dashboard"} className="a">
            <i className="bx bxs-dashboard" id="i"></i>
            <span className="text">Dashboard</span>
          </Link>
        </li>
        <li className={current === "user" ? "active" : ""}>
          <Link to={"/Dusers"} className="a">
            <i className="bx bxs-group" id="i"></i>
            <span className="text">Users</span>
          </Link>
        </li>
        <li className={current === "courses" ? "active" : ""}>
          <Link to={"/DCourses"} className="a">
            <i className="bx bxs-book" id="i"></i>
            <span className="text">Courses</span>
          </Link>
        </li>

        {/* Logout button */}
        <br /><br />
        <li>
          <button onClick={handleLogOut} className="logout-button">
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}

export default SideBar;
