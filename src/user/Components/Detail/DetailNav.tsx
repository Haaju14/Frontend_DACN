import React from "react";
import { NavLink } from "react-router-dom";

const DetailNav: React.FC = () => {
  return (
    <div
      className="hero-wrap"
      style={{ backgroundImage: 'url("/user/images/bg_1.jpg")' }}
    >
      <div className="overlay" />
      <div className="container">
        <div className="row no-gutters slider-text d-flex align-itemd-end justify-content-center">
          <div className="col-md-9 ftco-animate text-center d-flex align-items-end justify-content-center">
            <div className="text">
              <p
                className="breadcrumbs mb-2"
                data-scrollax="properties: { translateY: '30%', opacity: 1.6 }"
              >
                <span className="mr-2">
                  <NavLink to="/">Home</NavLink>
                </span>{" "}
                <span className="mr-2">
                  <NavLink to="/khoa-hoc">Course</NavLink>
                </span>{" "}
                <span>Course Detail</span>
              </p>
              <h1 className="mb-4 bread">Course Detail</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailNav;
