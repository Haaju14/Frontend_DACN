import React from "react";

const Carousel: React.FC = () => {
  return (
    <section className="home-slider owl-carousel owl-theme">
      <div
        className="slider-item"
        style={{ backgroundImage: "url(user/images/bg_1.jpg)" }}
      >
        <div className="overlay" />
        <div className="container">
          <div className="row no-gutters slider-text align-items-center justify-content-center">
            <div className="col-md-12 ftco-animate text-center">
              <div className="text mb-5 pb-3">
                <h1 className="mb-3">Welcome To H&H</h1>
                <h2>Online Courses</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="slider-item"
        style={{ backgroundImage: "url(user/images/bg_2.jpg)" }}
      >
        <div className="overlay" />
        <div className="container">
          <div className="row no-gutters slider-text align-items-center justify-content-center">
            <div className="col-md-12 ftco-animate text-center">
              <div className="text mb-5 pb-3">
                <h1 className="mb-3">Experience Interesting Courses</h1>
                <h2>Join Now</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Carousel;
