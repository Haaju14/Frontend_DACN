import React from "react";
import { NavLink } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="ftco-footer ftco-bg-dark ftco-section">
      <div className="container">
        <div className="row mb-5">
          <div className="col-md">
            <div className="ftco-footer-widget mb-4">
              <h2 className="ftco-heading-2">H&H</h2>
              <p>
                text 123891273981273982173
              </p>
              <ul className="ftco-footer-social list-unstyled float-md-left float-lft mt-5">
                <li className="ftco-animate">
                  <NavLink to="#">
                    <span className="icon-twitter" />
                  </NavLink>
                </li>
                <li className="ftco-animate">
                  <NavLink to="https://www.facebook.com/hau.nguyen.1410" target="_blank">
                    <span className="icon-facebook" />
                  </NavLink>
                </li> 
                <li className="ftco-animate">
                  <NavLink to="https://www.instagram.com/haaju14.10/" target="_blank">
                    <span className="icon-instagram" />
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-md">
            <div className="ftco-footer-widget mb-4 ml-md-5">
              <h2 className="ftco-heading-2">Useful Links</h2>
              <ul className="list-unstyled">
                <li>
                  <a href="#" className="py-2 d-block">
                    Blog
                  </a>
                </li>
                <li>
                  <NavLink to="/" className="py-2 d-block"  >
                    Course
                  </NavLink>
                </li>
                <li>
                  <a href="#" className="py-2 d-block">
                    Amenities
                  </a>
                </li>
                <li>
                  <a href="#" className="py-2 d-block">
                    Gift Card
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-md">
            <div className="ftco-footer-widget mb-4">
              <h2 className="ftco-heading-2">Privacy</h2>
              <ul className="list-unstyled">
                <li>
                  <a href="#" className="py-2 d-block">
                    Career
                  </a>
                </li>
                <li>
                  <a href="#" className="py-2 d-block">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="py-2 d-block">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="py-2 d-block">
                    Services
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-md">
            <div className="ftco-footer-widget mb-4">
              <h2 className="ftco-heading-2">Have a Questions?</h2>
              <div className="block-23 mb-3">
                <ul>
                  <li>
                    <span className="icon icon-map-marker" />
                    <span className="text">
                      6C Đ. Số 8, Linh Tây, Thủ Đức, Hồ Chí Minh 71310
                    </span>
                  </li>
                  <li>
                    <a href="#">
                      <span className="icon icon-phone" />
                      <span className="text">+0961 051 014</span>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <span className="icon icon-envelope" />
                      <span className="text">info@yourdomain.com</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 text-center">
            <p>
              Copyright © All rights reserved
              <i
                className="icon-heart color-danger pl-1 pr-1"
                aria-hidden="true"
              />{" "}
              by
              <NavLink to="/" target="_blank">
                H&H
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
