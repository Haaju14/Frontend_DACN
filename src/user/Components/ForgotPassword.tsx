import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../util/fetchfromAPI";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [notification, setNotification] = useState("");

  const handleForgotPassword = async (event: React.FormEvent) => {
    event.preventDefault(); // Ngăn chặn reload trang

    try {
      const response = await axios.post(`${BASE_URL}/forgot-password`, {
        Email: email, // Gửi email người dùng đã nhập
      });
      setNotification(response.data.message || "Đã gửi yêu cầu khôi phục mật khẩu!");
    } catch (error) {
      console.error("Error sending forgot password email:", error);
      
      // Kiểm tra loại của error
      if (axios.isAxiosError(error)) {
        // Đây là lỗi Axios
        setNotification(error.response?.data.message || "Lỗi khi gửi yêu cầu khôi phục mật khẩu!");
      } else {
        // Các lỗi khác
        setNotification("Lỗi khi gửi yêu cầu khôi phục mật khẩu!");
      }
    }
  };

  return (
    <div>
      <h3>Quên Mật Khẩu</h3>
      <form onSubmit={handleForgotPassword}>
        <div className="form-group">
          <label htmlFor="email">Địa chỉ email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Nhập địa chỉ email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Cập nhật giá trị email
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Gửi yêu cầu khôi phục
        </button>
      </form>
      {notification && <div className="alert alert-info mt-3">{notification}</div>} {/* Hiển thị thông báo */}
    </div>
  );
};

export default ForgotPassword;
