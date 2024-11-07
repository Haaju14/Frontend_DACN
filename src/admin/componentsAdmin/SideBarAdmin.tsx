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
              <a
                data-bs-toggle="collapse"
                onClick={() => {
                  navigate("/admin/table-user");
                }}
              >
                <i className="fas fa-layer-group" />
                <p>Manage User</p>
              </a>
            </li>
            
            <li className="nav-item">
              <a
                data-bs-toggle="collapse"
                onClick={() => {
                  navigate("/admin/Manage-Course");
                }}
              >
                <i className="fas fa-pen-square" />
                <p>Manage Course</p>
              </a>
            </li>
            
            
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SideBarAdmin;
