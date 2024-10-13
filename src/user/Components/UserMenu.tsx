import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { DispatchType } from "../../redux/store";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/reducers/userReducer";
import useRoute from "../../hook/useRoute";
import { NavLink } from "react-router-dom";

const UserMenu: React.FC = () => {
  const { navigate } = useRoute();

  const dispatch: DispatchType = useDispatch();
  const { userLogin } = useSelector((state: RootState) => state.userReducer);

  const [showMenu, setShowMenu] = useState<boolean>(false);

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleLogOut = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleManage = () => {
    navigate("/info-user");
  };

  const handleManageAdmin = () => {
    navigate("/admin/table-user");
  };

  const handleTabSwitch = (tab: "login" | "register") => {
    setTimeout(() => {
      const targetTab = document.querySelector(
        `#${tab}-tab`
      ) as HTMLAnchorElement;
      targetTab?.click();
    }, 0);
  };

  const renderPopup = () => {
    if (userLogin) {
      if (userLogin.user.role === "ADMIN") {
        return (
          <>
            <NavLink className="dropdown-item" onClick={handleManage} to={"/info-user"}>
              Account Information
            </NavLink>
            <NavLink className="dropdown-item" onClick={handleManageAdmin} to={"/admin/table-user"}>
              Manage admin
            </NavLink>
            <NavLink className="dropdown-item" onClick={handleLogOut} to={"/"}>
              Log out
            </NavLink>
          </>
        );
      } else {
        return (
          <>
            <NavLink className="dropdown-item" onClick={handleManage} to={"/info-user"}>
            Account Information
            </NavLink>
            <NavLink className="dropdown-item" onClick={handleLogOut} to={"/"}>
              Log out
            </NavLink>
          </>
        );
      }
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
            Log in
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
    if (userLogin) {
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
            <span style={{ paddingLeft: "10px" }}>{userLogin.user?.name}</span>
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
