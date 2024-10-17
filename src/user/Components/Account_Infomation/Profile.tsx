import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { UserAPI } from "../../../util/fetchfromAPI";

interface ProfileProps {
  user: {
    IDNguoiDung: number;
    TenDangNhap: string;
    Email: string;
    HoTen: string;
    SDT: string;
    GioiTinh: boolean;
    AnhDaiDien?: string; 
  };
}

const Profile: React.FC<ProfileProps> = ({ user }) => {

  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState("");

  const formik = useFormik({
    initialValues: {
        TenDangNhap: user.TenDangNhap || '',
        Email: user.Email || '',
        HoTen: user.HoTen || '',
        SDT: user.SDT || '',
        GioiTinh: user.GioiTinh || '', 
        AnhDaiDien: user.AnhDaiDien || '', 
    },  
    onSubmit: async (values) => {
      try {
        // Send updated user data to the API
        const updatedUser = await UserAPI({
          IDNguoiDung: user.IDNguoiDung, // User ID
          TenDangNhap: values.TenDangNhap,
          Email: values.Email,
          HoTen: values.HoTen,
          SDT: values.SDT,
          AnhDaiDien: values.AnhDaiDien,
          GioiTinh: false
        });
            setNotification("Cập nhật thông tin cá nhân thành công!");
            // Optionally update local user state here if needed
        } catch (error) {
            setNotification("Lỗi khi cập nhật thông tin cá nhân!");
            console.error("Update Profile Error:", error);
        }
    },
});



return (
  <div>
      <div className="profile card p-3">
          <div className="profile-header d-flex align-items-center">
              <div>
                  <div
                      className="profile-picture bg-secondary rounded-circle d-flex justify-content-center align-items-center"
                      style={{ width: "100px", height: "100px" }}
                  >
                      <img
                          src={user.AnhDaiDien || '/default-avatar.png'} // Default avatar if none exists
                          alt="Profile Picture"
                          className="rounded-circle"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                  </div>
                  <span className="update-photo" onClick={() => console.log('Change Avatar')}>
                      Change Avatar
                  </span>
              </div>
              <div className="profile-verification ml-auto d-flex flex-column align-items-start">
                  <span className="badge badge-success mb-2">
                      Identity verification
                  </span>
                  <span className="badge badge-primary">Email address</span>
              </div>
          </div>
          <div className="profile-info mt-3">
              <h2>Hello, I am {user.HoTen}</h2>
              <p>Start participating in 2024</p>
              <button className="btn btn-outline-primary" onClick={() => setShowModal(true)}>
                  Edit profile
              </button>
          </div>
      </div>

      {/* Notification */}
      {notification && <div className="alert alert-info">{notification}</div>}

      {/* Bootstrap Modal for Editing Profile */}
      {showModal && (
          <>
              <div
                  className="modal-backdrop"
                  style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
              ></div>
              <div
                  className="modal fade show d-block"
                  tabIndex={-1}
                  role="dialog"
                  style={{ display: showModal ? "block" : "none" }}
              >
                  <div className="modal-dialog" role="document">
                      <div className="modal-content">
                          <div className="modal-header">
                              <h5 className="modal-title">Edit Profile</h5>
                              <button
                                  type="button"
                                  className="close"
                                  onClick={() => setShowModal(false)}
                                  aria-label="Close"
                              >
                                  <span aria-hidden="true">&times;</span>
                              </button>
                          </div>
                          <div className="modal-body">
                              <form onSubmit={formik.handleSubmit}>
                                  <div className="form-group">
                                      <label htmlFor="TenDangNhap">Username</label>
                                      <input
                                          type="text"
                                          className="form-control rounded-input"
                                          id="TenDangNhap"
                                          placeholder="Enter username"
                                          name="TenDangNhap"
                                          onChange={formik.handleChange}
                                          onBlur={formik.handleBlur}
                                          value={formik.values.TenDangNhap}
                                      />
                                  </div>
                                  <div className="form-group">
                                      <label htmlFor="Email">Email address</label>
                                      <input
                                          type="email"
                                          className="form-control rounded-input"
                                          id="Email"
                                          placeholder="Enter email"
                                          name="Email"
                                          onChange={formik.handleChange}
                                          onBlur={formik.handleBlur}
                                          value={formik.values.Email}
                                      />
                                  </div>
                                  <div className="form-group">
                                      <label htmlFor="HoTen">Full Name</label>
                                      <input
                                          type="text"
                                          className="form-control rounded-input"
                                          id="HoTen"
                                          placeholder="Enter full name"
                                          name="HoTen"
                                          onChange={formik.handleChange}
                                          onBlur={formik.handleBlur}
                                          value={formik.values.HoTen}
                                      />
                                  </div>
                                  <div className="form-group">
                                      <label htmlFor="SDT">Phone</label>
                                      <input
                                          type="text"
                                          className="form-control rounded-input"
                                          id="SDT"
                                          placeholder="Enter phone"
                                          name="SDT"
                                          onChange={formik.handleChange}
                                          onBlur={formik.handleBlur}
                                          value={formik.values.SDT}
                                      />
                                  </div>
                                  <div className="form-group">
                                      <label htmlFor="GioiTinh">Gender</label>                                                                      
                                  </div>
                                  <div className="modal-footer">
                                      <button type="submit" className="btn btn-primary">
                                          Update
                                      </button>
                                      <button
                                          type="button"
                                          className="btn btn-secondary"
                                          onClick={() => setShowModal(false)}
                                      >
                                          Cancel
                                      </button>
                                  </div>
                              </form>
                          </div>
                      </div>
                  </div>
              </div>
          </>
      )}
  </div>
);
};

export default Profile;
