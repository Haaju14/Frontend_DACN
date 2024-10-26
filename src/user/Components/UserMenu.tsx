import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { logout } from "../../redux/reducers/userReducer";
import useRoute from "../../hook/useRoute";
import { NavLink } from "react-router-dom";

const UserMenu: React.FC = () => {
  const { navigate } = useRoute();
  const dispatch = useDispatch();
  const { userLogin } = useSelector((state: RootState) => state.userReducer);
  
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const handleMenuToggle = () => {
    setShowMenu((prev) => !prev); // Toggle menu visibility
  };

  const handleLogOut = () => {
    dispatch(logout());
    navigate("/"); // Navigate to home page after logout
  };

  const handleManage = () => {
    navigate("/user/profile"); // Navigate to user info page
  };

  const handleManageAdmin = () => {
    navigate("/user/profile"); // Navigate to admin management page
  };

  const handleTabSwitch = (tab: "login" | "register") => {
    const targetTab = document.querySelector(`#${tab}-tab`) as HTMLAnchorElement;
    targetTab?.click(); // Simulate tab switching
  };

  const renderPopup = () => {
    if (userLogin && userLogin.user) {
      return (
        <>
          <NavLink className="dropdown-item" onClick={handleManage} to={"/user/profile"}>
            Account Information
          </NavLink>
          {userLogin.user.Role === "admin" && (
            <NavLink className="dropdown-item" onClick={handleManageAdmin} to={"/user/profile"}>
              Manage Admin
            </NavLink>
          )}
          <NavLink className="dropdown-item" onClick={handleLogOut} to={"/"}>
            Log Out
          </NavLink>
        </>
      );
    } else {
      return (
        <>
          <NavLink
            className="dropdown-item"
            to="#"
            data-toggle="modal"
            data-target="#authModal"
            onClick={() => handleTabSwitch("login")}
          >
            Log In
          </NavLink>
          <NavLink
            className="dropdown-item"
            to="#"
            data-toggle="modal"
            data-target="#authModal"
            onClick={() => handleTabSwitch("register")}
          >
            Register
          </NavLink>
        </>
      );
    }
  };

  const renderLogin = () => {
    if (userLogin && userLogin.user) {
      return (
        <div
          className="dropdown-toggle nav-link"
          id="dropdownMenuButton"
          aria-haspopup="true"
          aria-expanded={showMenu}
          onClick={handleMenuToggle}
          style={{ cursor: "pointer" }}
        >
          <i className="fa fa-user" aria-hidden="true">
            <span style={{ paddingLeft: "10px" }}>{userLogin.user.TenDangNhap}</span>
          </i>
        </div>
      );
    } else {
      return (
        <button
          className="btn btn-secondary dropdown-toggle"
          type="button"
          id="dropdownMenuButton"
          aria-haspopup="true"
          aria-expanded={showMenu}
          onClick={handleMenuToggle}
          style={{ marginTop: "0px" }}
        >
          <i className="fa fa-user" aria-hidden="true"></i>
        </button>
      );
    }
  };

  return (
    <div className="dropdown">
      {renderLogin()}
      <div
        className={`dropdown-menu ${showMenu ? "show" : ""}`}
        aria-labelledby="dropdownMenuButton"
      >
        {renderPopup()}
      </div>
    </div>
  );
};

export default UserMenu;
