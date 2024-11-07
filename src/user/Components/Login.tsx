import React, { useState, useEffect } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup"; // For validation
import { useDispatch } from "react-redux";
import { login } from "../../redux/reducers/userReducer"; // Import action login
import useRoute from "../../hook/useRoute"; // Custom hook to manage routing
import { BASE_URL } from "../../util/fetchfromAPI";

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { navigate } = useRoute();

  // Toggle visibility of password
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Formik for form handling and validation
  const formik = useFormik({
    initialValues: {
      Email: "",   // Correct case for consistency
      MatKhau: "", // Correct case for consistency
    },
    validationSchema: Yup.object({
      Email: Yup.string().email("Invalid email address").required("Required"),
      MatKhau: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post(`${BASE_URL}/login`, {
          Email: values.Email,
          MatKhau: values.MatKhau,
        });

        if (response.status === 200) {
          const token = response.data.content.token; // Lấy token từ content
          const user = response.data.content.user; // Lấy thông tin người dùng từ response

          // Dispatch action login với user và token
          dispatch(login({ user, token }));

          // Lưu token vào localStorage
          localStorage.setItem("token", token);

          // Kiểm tra vai trò của người dùng và điều hướng tương ứng
          if (user.Role === "admin" || user.Role === "giangvien") {
            // Chuyển hướng đến trang quản lý nếu là admin hoặc giảng viên
            navigate("/");
          } else {
            // Giữ nguyên trang cho học viên
            setMessage("Login successful!");
            navigate("/");
          }

          // Reload lại trang sau khi đăng nhập thành công
          window.location.reload();
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            setMessage(error.response.data.message || "Login failed with server error");
          } else if (error.request) {
            setMessage("No response from server. Please try again later.");
          }
        } else {
          setMessage("An unexpected error occurred: " + (error as Error).message);
        }
      }
    },
  });

  // Log for specific field changes
  useEffect(() => {
    console.log("Email value changed:", formik.values.Email);
  }, [formik.values.Email]);

  useEffect(() => {
    console.log("MatKhau value changed:", formik.values.MatKhau);
  }, [formik.values.MatKhau]);

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={formik.handleSubmit}>

        {/* Email Input */}
        <div className="form-group">
          <label htmlFor="loginEmail">Email</label>
          <input
            type="email"
            className="form-control"
            id="loginEmail"
            placeholder="Enter email"
            name="Email" // Updated to match formik values
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.Email}
          />
          {formik.touched.Email && formik.errors.Email && (
            <div className="text-danger">{formik.errors.Email}</div>
          )}
        </div>

        {/* Password Input */}
        <div className="form-group">
          <label htmlFor="loginPassword">Password</label>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              id="loginPassword"
              placeholder="Password"
              name="MatKhau" // Updated to match formik values
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.MatKhau}
            />
            <div className="input-group-append">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={togglePasswordVisibility}
              >
                <i className={`fa ${showPassword ? "fa-eye" : "fa-eye-slash"}`}></i>
              </button>
            </div>
          </div>
          {formik.touched.MatKhau && formik.errors.MatKhau && (
            <div className="text-danger">{formik.errors.MatKhau}</div>
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary">
          Login
        </button>

        {/* Error or Success Message */}
        {message && <div className="mt-3">{message}</div>}

      </form>
    </div>
  );
};

export default Login;
