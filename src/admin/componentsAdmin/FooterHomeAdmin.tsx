import React from "react";
import { NavLink } from "react-router-dom";

const FooterHomeAdmin: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container-fluid d-flex justify-content-between">
        <nav className="pull-left">
          <ul className="nav">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                H&H
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
};

export default FooterHomeAdmin;
