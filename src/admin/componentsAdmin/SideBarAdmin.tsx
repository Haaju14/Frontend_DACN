import React from "react";
import useRoute from "../../hook/useRoute";
import { NavLink } from "react-router-dom";

const SideBarAdmin: React.FC = () => {
  const { navigate } = useRoute();

  return (
    <div className="sidebar" data-background-color="dark">
      <div className="sidebar-logo">
        {/* Logo Header */}
        <div className="logo-header" data-background-color="dark">
          <NavLink to="/admin" className="logo">
            Manage
          </NavLink>
          <div className="nav-toggle">
            <button className="btn btn-toggle toggle-sidebar">
              <i className="gg-menu-right" />
            </button>
            <button className="btn btn-toggle sidenav-toggler">
              <i className="gg-menu-left" />
            </button>
          </div>
          <button className="topbar-toggler more">
            <i className="gg-more-vertical-alt" />
          </button>
        </div>
        {/* End Logo Header */}
      </div>
      <div className="sidebar-wrapper scrollbar scrollbar-inner">
        <div className="sidebar-content">
          <ul className="nav nav-secondary">
          <li className="nav-item">
              <NavLink
                to="/admin/Manage-User"
                className="nav-link"
                
              >
                <i className="fas fa-pen-square" />
                <p>Manage Users</p>
              </NavLink>
            </li>
            
            <li className="nav-item">
              <NavLink
                to="/admin/Manage-Course"
                className="nav-link"
                
              >
                <i className="fas fa-pen-square" />
                <p>Manage Courses</p>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/admin/Manage-Followers"
                className="nav-link"
                
              >
                <i className="fas fa-pen-square" />
                <p>Manage Followers</p>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/admin/Manage-Black-List"
                className="nav-link"
                
              >
                <i className="fas fa-pen-square" />
                <p>Manage BlackList</p>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/admin/Manage-Block-List"
                className="nav-link"
                
              >
                <i className="fas fa-pen-square" />
                <p>Manage BlockList</p>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/admin/Manage-Comment"
                className="nav-link"
                
              >
                <i className="fas fa-pen-square" />
                <p>Manage Comment</p>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/admin/Manage-Censor"
                className="nav-link"
                
              >
                <i className="fas fa-pen-square" />
                <p>Manage Censor</p>
              </NavLink>
            </li>

          </ul>
        </div>
      </div>
    </div>
  );
};

export default SideBarAdmin;
