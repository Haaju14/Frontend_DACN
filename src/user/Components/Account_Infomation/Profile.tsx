import React, { useState } from "react";
import { useFormik } from "formik";
import { BASE_URL } from "../../../util/fetchfromAPI";
import axios from "axios";

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
  const [showPasswordModal, setShowPasswordModal] = useState(false); // Modal cho đổi mật khẩu
  const [notification, setNotification] = useState("");
  const [passwordNotification, setPasswordNotification] = useState("");
  const [userData, setUserData] = useState(user);
  const [, setSelectedFile] = useState<File | null>(null);

  const formik = useFormik({
    initialValues: {
      TenDangNhap: userData.TenDangNhap || "",
      Email: userData.Email || "",
      HoTen: userData.HoTen || "",
      SDT: userData.SDT || "",
      AnhDaiDien: userData.AnhDaiDien || "",
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.put(
          `${BASE_URL}/user/profile`,
          {
            TenDangNhap: values.TenDangNhap,
            Email: values.Email,
            HoTen: values.HoTen,
            SDT: values.SDT,
            AnhDaiDien: values.AnhDaiDien,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUserData({
          ...userData,
          TenDangNhap: response.data.TenDangNhap,
          Email: response.data.Email,
          HoTen: response.data.HoTen,
          SDT: response.data.SDT,
          AnhDaiDien: response.data.AnhDaiDien,
        });

        setNotification("Cập nhật thông tin cá nhân thành công, vui lòng đăng nhập lại để cập nhật thông tin!");
        setShowModal(false);
      } catch (error) {
        console.error("Error updating user profile:", error);
        setNotification("Lỗi khi cập nhật thông tin cá nhân!");
      }
    },
  });

  const passwordFormik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: async (values) => {
      if (values.newPassword !== values.confirmPassword) {
        setPasswordNotification("Mật khẩu mới và xác nhận mật khẩu không khớp.");
        return;
      }

      try {
        const token = localStorage.getItem("token");
        await axios.post(
          `${BASE_URL}/change-password`,
          {
            oldPassword: values.oldPassword,
            newPassword: values.newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPasswordNotification("Đổi mật khẩu thành công!");
        setTimeout(() => setPasswordNotification(""), 3000); 
        setShowPasswordModal(false); 
      } catch (error) {
        setPasswordNotification("Lỗi khi đổi mật khẩu!");
        console.error("Error changing password:", error);
      }
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files && event.currentTarget.files[0]) {
      const file = event.currentTarget.files[0];
      setSelectedFile(file);
    }
  };

  return (
    <div>
      
      {passwordNotification && (
        <div className="alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3">
          {passwordNotification}
        </div>
      )}
      <div className="profile card p-3">
        <div className="profile-header d-flex align-items-center">
          <div>
            <div
              className="profile-picture bg-secondary rounded-circle d-flex justify-content-center align-items-center"
              style={{ width: "100px", height: "100px" }}
            >
              <img
                src={userData.AnhDaiDien || "/default-avatar.png"}
                alt="Profile Picture"
                className="rounded-circle"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            <span
              className="update-photo"
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              Change Avatar
            </span>
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <div className="profile-verification ml-auto d-flex flex-column align-items-start">
            <span className="badge badge-success mb-2">Thành tựu</span>
            <span className="badge badge-primary">Học viên chăm chỉ</span>
            <span className="badge badge-primary">Học viên nhiều đóng góp</span>
            <span className="badge badge-primary">Học viên chăm chỉ</span>
          </div>
        </div>
        <div className="profile-info mt-3">
          <h2>Hello, I'm {userData.TenDangNhap}</h2>
          <p>Join in 2024</p>
          <button className="btn btn-outline-primary" onClick={() => setShowModal(true)}>
            Edit profile
          </button>
          <button className="btn btn-outline-secondary ml-2" onClick={() => setShowPasswordModal(true)}>
            Đổi mật khẩu
          </button>
        </div>
      </div>

      {notification && <div className="alert alert-info">{notification}</div>}

      {showModal && (
        <>
          <div className="modal-backdrop" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}></div>
          <div className="modal fade show d-block" tabIndex={-1} role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Profile</h5>
                  <button type="button" className="close" onClick={() => setShowModal(false)} aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <form onSubmit={formik.handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="TenDangNhap">Tên đăng nhập</label>
                      <input
                        type="text"
                        className="form-control"
                        id="TenDangNhap"
                        name="TenDangNhap"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.TenDangNhap}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="Email">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        id="Email"
                        name="Email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.Email}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="HoTen">Họ tên</label>
                      <input
                        type="text"
                        className="form-control"
                        id="HoTen"
                        name="HoTen"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.HoTen}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="SDT">Số điện thoại</label>
                      <input
                        type="text"
                        className="form-control"
                        id="SDT"
                        name="SDT"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.SDT}
                      />
                    </div>
                    <div className="modal-footer">
                      <button type="submit" className="btn btn-primary">Update</button>
                      <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
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

      {showPasswordModal && (
        
        <div className="modal fade show d-block" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Đổi mật khẩu</h5>
                <button type="button" className="close" onClick={() => setShowPasswordModal(false)} aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={passwordFormik.handleSubmit}>
                  <div className="form-group">
                    <label>Mật khẩu cũ</label>
                    <input
                      type="password"
                      className="form-control"
                      name="oldPassword"
                      onChange={passwordFormik.handleChange}
                      value={passwordFormik.values.oldPassword}
                    />
                  </div>
                  <div className="form-group">
                    <label>Mật khẩu mới</label>
                    <input
                      type="password"
                      className="form-control"
                      name="newPassword"
                      onChange={passwordFormik.handleChange}
                      value={passwordFormik.values.newPassword}
                    />
                  </div>
                  <div className="form-group">
                    <label>Xác nhận mật khẩu mới</label>
                    <input
                      type="password"
                      className="form-control"
                      name="confirmPassword"
                      onChange={passwordFormik.handleChange}
                      value={passwordFormik.values.confirmPassword}
                    />
                  </div>
                  {passwordNotification && <div className="alert alert-info">{passwordNotification}</div>}
                  <div className="modal-footer">
                    <button type="submit" className="btn btn-primary">Đổi mật khẩu</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowPasswordModal(false)}>
                      Hủy
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
