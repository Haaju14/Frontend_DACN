import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword"; // Import ForgotPassword
import UserMenu from "./UserMenu";
import { NavLink } from "react-router-dom";

const Header: React.FC = () => {
  const [activeTab, setActiveTab] = useState("login"); // State để quản lý tab hiện tại

  const handleForgotPasswordClick = () => {
    setActiveTab("forgot-password"); // Chuyển sang tab quên mật khẩu
  };

  return (
    <>
      <nav
        className="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light"
        id="ftco-navbar"
      >
        <div className="container">
          <NavLink className="navbar-brand" to="/">
            H&H
          </NavLink>{" "}
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#ftco-nav"
            aria-controls="ftco-nav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="oi oi-menu" /> Menu
          </button>
          <div className="collapse navbar-collapse" id="ftco-nav">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <span className="nav-link">
                  <NavLink to="/">Home</NavLink>
                </span>{" "}
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link">
                  About
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link">
                  Service
                </a>
              </li>
              <li className="nav-item">
                <NavLink to="/khoa-hoc" className="nav-link">
                  Courses
                </NavLink>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link">
                  Contact
                </a>
              </li>
              <li className="nav-item d-flex align-items-center">
                <UserMenu />
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div
        className="modal fade"
        id="authModal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="authModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="authModalLabel">
                Login or Register
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <ul className="nav nav-tabs" id="authTab" role="tablist">
                <li className="nav-item">
                  <a
                    className={`nav-link ${activeTab === "login" ? "active" : ""}`}
                    id="login-tab"
                    onClick={() => setActiveTab("login")}
                    role="tab"
                    aria-controls="login"
                    aria-selected={activeTab === "login"}
                  >
                    Login
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${activeTab === "register" ? "active" : ""}`}
                    id="register-tab"
                    onClick={() => setActiveTab("register")}
                    role="tab"
                    aria-controls="register"
                    aria-selected={activeTab === "register"}
                  >
                    Register
                  </a>
                </li>
              </ul>
              <div className="tab-content" id="authTabContent">
                <div
                  className={`tab-pane fade ${activeTab === "login" ? "show active" : ""}`}
                  id="login"
                  role="tabpanel"
                  aria-labelledby="login-tab"
                >
                  <Login />
                  {/* Nút "Quên mật khẩu?" chỉ hiện ở tab Login */}
                  <div className="text-right mt-2">
                    <NavLink to="#" onClick={handleForgotPasswordClick} className="text-primary">
                      Quên mật khẩu?
                    </NavLink>
                  </div>
                </div>
                <div
                  className={`tab-pane fade ${activeTab === "register" ? "show active" : ""}`}
                  id="register"
                  role="tabpanel"
                  aria-labelledby="register-tab"
                >
                  <Register />
                </div>
                <div
                  className={`tab-pane fade ${activeTab === "forgot-password" ? "show active" : ""}`}
                  id="forgot-password"
                  role="tabpanel"
                  aria-labelledby="forgot-password-tab"
                >
                  <ForgotPassword />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
