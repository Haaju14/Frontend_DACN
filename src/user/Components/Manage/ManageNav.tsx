import React from "react";

const ManageNav: React.FC = () => {
  return (
    <div
      className="hero-wrap"
      style={{ backgroundImage: 'url("user/images/bg_1.jpg")' }}
    >
      <div className="overlay" />
      <div className="container">
        <div className="row no-gutters slider-text d-flex align-itemd-end justify-content-center">
          <div className="col-md-9 ftco-animate text-center d-flex align-items-end justify-content-center">
            <div className="text">
              <h1 className="mb-4 bread">Manage</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageNav;
