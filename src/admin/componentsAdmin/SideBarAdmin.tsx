import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const SideBar: React.FC = () => {
  const { userLogin } = useSelector((state: RootState) => state.userReducer);

  // Kiểm tra role người dùng
  const renderMenuForRole = () => {
    if (userLogin && userLogin.user) {
      if (userLogin.user.Role === "admin") {
        return (
          <>
            <li className="nav-item">
              <NavLink to="/admin/Manage-User" className="nav-link">
                <i className="fas fa-users" />
                <p>Manage Users</p>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/admin/Manage-Course" className="nav-link">
                <i className="fas fa-book" />
                <p>Manage Courses</p>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/admin/Manage-Black-List" className="nav-link">
                <i className="fas fa-ban" />
                <p>Manage BlackList</p>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/admin/Manage-Comment" className="nav-link">
                <i className="fas fa-comment" />
                <p>Manage Comments</p>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/admin/Manage-Censor" className="nav-link">
                <i className="fas fa-cogs" />
                <p>Manage Censorship</p>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/admin/Manage-Category" className="nav-link">
                <i className="fas fa-cogs" />
                <p>Manage Category</p>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/admin/Manage-Promotion" className="nav-link">
                <i className="fas fa-cogs" />
                <p>Manage Promotion</p>
              </NavLink>
            </li>

            

          </>
        );
      } else if (userLogin.user.Role === "giangvien") 
        return (
          <>
            <li className="nav-item">
              <NavLink to="/admin/Manage-Course" className="nav-link">
                <i className="fas fa-chalkboard-teacher" />
                <p>Manage Courses</p>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/admin/Manage-Followers" className="nav-link">
                <i className="fas fa-comments" />
                <p>Manage Followers</p>
              </NavLink>
            </li>
          </>
        );
       
    }
    return null; // Không hiển thị menu nếu không có thông tin người dùng
  };

  return (
    <div className="sidebar" data-background-color="dark">
      <div className="sidebar-logo">
        <div className="logo-header" data-background-color="dark">
          <NavLink to="/" className="logo">
            <span>Manage</span>
          </NavLink>
          <div className="nav-toggle">
            <button className="btn btn-toggle toggle-sidebar">
              <i className="gg-menu-right" />
            </button>
            <button className="btn btn-toggle sidenav-toggler">
              <i className="gg-menu-left" />
            </button>
          </div>
        </div>
      </div>

      <div className="sidebar-wrapper scrollbar scrollbar-inner">
        <div className="sidebar-content">
          <ul className="nav nav-secondary">
            {renderMenuForRole()}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
