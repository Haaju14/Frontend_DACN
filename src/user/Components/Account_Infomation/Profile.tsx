import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { BASE_URL } from "../../../util/fetchfromAPI"; // Chỉ cần import BASE_URL
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
  const [notification, setNotification] = useState("");
  const [userData, setUserData] = useState(user); // Lưu thông tin người dùng trong state
  const [, setSelectedFile] = useState<File | null>(null);



  const formik = useFormik({
    initialValues: {
      TenDangNhap: userData.TenDangNhap || '',
      Email: userData.Email || '',
      HoTen: userData.HoTen || '',
      SDT: userData.SDT || '',
      AnhDaiDien: userData.AnhDaiDien || '', 
    },  
    enableReinitialize: true, // Cho phép cập nhật giá trị khởi tạo khi userData thay đổi
    onSubmit: async (values) => {
      try {
        const token = localStorage.getItem('token');

        const response = await axios.put(`${BASE_URL}/user/profile`, {            
          TenDangNhap: values.TenDangNhap,
          Email: values.Email,
          HoTen: values.HoTen,
          SDT: values.SDT,
          AnhDaiDien: values.AnhDaiDien,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Cập nhật userData với thông tin mới từ API
        setUserData(response.data);
        setNotification("Cập nhật thông tin cá nhân thành công,vui lòng đăng nhập lại để cập nhật thông tin!");
        setShowModal(false); // Đóng modal sau khi cập nhật thành công
      } catch (error) {
        console.error("Error updating user profile:", error);
        setNotification("Lỗi khi cập nhật thông tin cá nhân!");
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
      <div className="profile card p-3">
        <div className="profile-header d-flex align-items-center">
          <div>
            <div
              className="profile-picture bg-secondary rounded-circle d-flex justify-content-center align-items-center"
              style={{ width: "100px", height: "100px" }}
            >
              <img
                src={userData.AnhDaiDien || '/default-avatar.png'} // Default avatar if none exists
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
            <span className="badge badge-success mb-2">
              Thành tựu
            </span>
            <span className="badge badge-primary">Email address</span>
          </div>
        </div>
        <div className="profile-info mt-3">
          <h2>Xin chào tôi là  {userData.TenDangNhap}</h2>
          <p>Bắt đầu tham gia vào 2024</p>
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
                      <label htmlFor="TenDangNhap">Tên đăng nhập</label>
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
                      <label htmlFor="Email">Email</label>
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
                      <label htmlFor="HoTen">Họ tên</label>
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
                      <label htmlFor="SDT">Số điện thoại </label>
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
