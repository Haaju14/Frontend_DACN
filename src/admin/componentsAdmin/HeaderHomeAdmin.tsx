import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { DispatchType, RootState } from "../../redux/store";
import useRoute from "../../hook/useRoute";
import { logout } from "../../redux/reducers/userReducer";

const HeaderHomeAdmin: React.FC = () => {
  const { navigate } = useRoute();
  const dispatch: DispatchType = useDispatch();

  const { userLogin } = useSelector((state: RootState) => state.userReducer);

  const handleLogOut = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="main-header">
      <div className="main-header-logo">
        {/* Logo Header */}
        <div className="logo-header" data-background-color="dark">
          <button className="topbar-toggler more">
            <i className="gg-more-vertical-alt" />
          </button>
        </div>
        {/* End Logo Header */}
      </div>
      {/* Navbar Header */}
      <nav className="navbar navbar-header navbar-header-transparent navbar-expand-lg border-bottom">
        <div className="container-fluid">
          <nav className="navbar navbar-header-left navbar-expand-lg navbar-form nav-search p-0 d-none d-lg-flex"></nav>
          <ul className="navbar-nav topbar-nav ms-md-auto align-items-center">
            <li className="nav-item topbar-user dropdown hidden-caret">
              <a
                className="dropdown-toggle profile-pic"
                data-bs-toggle="dropdown"
                href="#"
                aria-expanded="false"
              >
                <span className="profile-username">
                  <span className="op-7">Hi,</span>
                  <span className="fw-bold">{userLogin?.user.name}</span>
                </span>
              </a>
              <ul className="dropdown-menu dropdown-user animated fadeIn">
                <div className="dropdown-user-scroll scrollbar-outer">
                  <li>
                    <div className="user-box">
                      <div className="u-text">
                        <h4>{userLogin?.user.name}</h4>
                        <p className="text-muted">{userLogin?.user.email}</p>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="dropdown-divider" />
                    <a
                      className="dropdown-item"
                      onClick={() => {
                        navigate("/info-user");
                      }}
                    >
                      My Profile
                    </a>
                    <div className="dropdown-divider" />
                    <a className="dropdown-item" onClick={handleLogOut}>
                      Logout
                    </a>
                  </li>
                </div>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
      {/* End Navbar */}
    </div>
  );
};

export default HeaderHomeAdmin;
