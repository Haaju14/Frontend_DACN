import React, { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup"; // For validation
import { BASE_URL } from "../../util/fetchfromAPI";

const Register: React.FC = () => {
    const [message, setMessage] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [avatar, setAvatar] = useState<File | null>(null); // State for avatar

    // API call for registration
    const signUpAPI = async (userData: {
        TenDangNhap: string;
        Email: string;
        MatKhau: string;
        HoTen: string;
        GioiTinh: boolean;
        SDT: string;
        Role: string; // default values
        AnhDaiDien: string; // Avatar field
    }) => {
        try {
            const response = await axios.post(`${BASE_URL}/signup`, userData);

            if (response.status === 201) {
                // Registration successful
                localStorage.setItem("token", response.data.token);
                setMessage("Sign up successful!");
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setMessage(error.response.data.message || "Sign up failed!");
            } else {
                setMessage("An unexpected error occurred.");
            }
        }
    };

    // Use Formik for form management
    const formik = useFormik({
        initialValues: {
            TenDangNhap: "",
            Email: "",
            MatKhau: "",
            HoTen: "",
            GioiTinh: true, // Default to male
            SDT: "",
            Role: "hocvien", // Default role
        },
        validationSchema: Yup.object({
            TenDangNhap: Yup.string().required("Username is required"),
            Email: Yup.string().email("Invalid email address").required("Email is required"),
            MatKhau: Yup.string().required("Password is required"),
            HoTen: Yup.string().required("Full name is required"),
            SDT: Yup.string().required("Phone number is required"),
            GioiTinh: Yup.boolean().required("Gender is required"),
            Role: Yup.string().oneOf(["hocvien"], "Role must be 'hocvien'").required("Role is required"),
        }),
        onSubmit: async (values) => {
            // Prepare data for API call
            const userData = {
                TenDangNhap: values.TenDangNhap,
                Email: values.Email,
                MatKhau: values.MatKhau,
                HoTen: values.HoTen,
                GioiTinh: values.GioiTinh,
                SDT: values.SDT,
                Role: values.Role,
                AnhDaiDien: avatar ? await uploadAvatar(avatar) : "", // Upload avatar and get the URL
            };
            signUpAPI(userData);
        },
    });

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Function to handle avatar upload
    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.currentTarget.files?.[0] || null;
        setAvatar(file);
    };

    // Mock function to simulate avatar upload
    const uploadAvatar = async (file: File): Promise<string> => {
        // You would normally upload the file to a server and return the URL
        // Here we just return a placeholder URL for demonstration
        return "https://example.com/path/to/avatar.jpg"; // Placeholder URL
    };

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className="form-group">
                <label htmlFor="registerName">Username</label>
                <input
                    type="text"
                    className="form-control rounded-input"
                    id="registerName"
                    placeholder="Enter username"
                    name="TenDangNhap"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.TenDangNhap}
                />
                {formik.touched.TenDangNhap && formik.errors.TenDangNhap ? (
                    <div className="text-danger">{formik.errors.TenDangNhap}</div>
                ) : null}
            </div>
            <div className="form-group">
                <label htmlFor="registerEmail">Email</label>
                <input
                    type="email"
                    className="form-control rounded-input"
                    id="registerEmail"
                    placeholder="Enter email"
                    name="Email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.Email}
                />
                {formik.touched.Email && formik.errors.Email ? (
                    <div className="text-danger">{formik.errors.Email}</div>
                ) : null}
            </div>
            <div className="form-group">
                <label htmlFor="registerPassword">Password</label>
                <div className="input-group">
                    <input
                        type={showPassword ? "text" : "password"}
                        className="form-control rounded-input"
                        id="registerPassword"
                        placeholder="Password"
                        name="MatKhau"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.MatKhau}
                    />
                    <div className="input-group-append">
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={togglePasswordVisibility}
                            style={{ marginTop: "0px" }}
                        >
                            <i
                                className={`fa ${showPassword ? "fa-eye" : "fa-eye-slash"}`}
                            ></i>
                        </button>
                    </div>
                </div>
                {formik.touched.MatKhau && formik.errors.MatKhau ? (
                    <div className="text-danger">{formik.errors.MatKhau}</div>
                ) : null}
            </div>
            <div className="form-group">
                <label htmlFor="registerFullName">Full Name</label>
                <input
                    type="text"
                    className="form-control rounded-input"
                    id="registerFullName"
                    placeholder="Full name"
                    name="HoTen"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.HoTen}
                />
                {formik.touched.HoTen && formik.errors.HoTen ? (
                    <div className="text-danger">{formik.errors.HoTen}</div>
                ) : null}
            </div>
            <div className="form-group">
                <label htmlFor="registerPhone">Phone</label>
                <input
                    type="text"
                    className="form-control rounded-input"
                    id="registerPhone"
                    placeholder="Phone number"
                    name="SDT"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.SDT}
                />
                {formik.touched.SDT && formik.errors.SDT ? (
                    <div className="text-danger">{formik.errors.SDT}</div>
                ) : null}
            </div>
            <div className="form-group">
                <label htmlFor="registerGender" className="mr-2">Gender</label>
                <div className="form-check form-check-inline">
                    <input
                        type="radio"
                        id="nam"
                        name="GioiTinh"
                        value="true"
                        className="form-check-input"
                        checked={formik.values.GioiTinh === true}
                        onChange={() => formik.setFieldValue("GioiTinh", true)}
                    />
                    <label className="form-check-label">Nam</label>
                </div>
                <div className="form-check form-check-inline">
                    <input
                        type="radio"
                        id="nu"
                        name="GioiTinh"
                        value="false"
                        className="form-check-input"
                        checked={formik.values.GioiTinh === false}
                        onChange={() => formik.setFieldValue("GioiTinh", false)}
                    />
                    <label className="form-check-label">Nữ</label>
                </div>
                {formik.touched.GioiTinh && formik.errors.GioiTinh ? (
                    <div className="text-danger">{formik.errors.GioiTinh}</div>
                ) : null}
            </div>
            <div className="form-group">
                <label htmlFor="registerRole">Role</label>
                <input
                  type="text"
                  className="form-control rounded-input"
                  id="registerRole"
                  name="Role"
                  value={formik.values.Role}
                  readOnly // Make the input read-only
                />
                {formik.touched.Role && formik.errors.Role ? (
                  <div className="text-danger">{formik.errors.Role}</div>
                ) : null}
              </div>
            <div className="form-group">
                <label htmlFor="registerAvatar">Avatar</label>
                <input
                    type="file"
                    className="form-control-file"
                    id="registerAvatar"
                    name="AnhDaiDien"
                    accept="image/*"
                    onChange={handleAvatarChange}
                />
                {avatar && <div className="mt-2">Selected file: {avatar.name}</div>}
            </div>
            <button type="submit" className="btn btn-primary">
                Register
            </button>
            {message && <div className="mt-3">{message}</div>}
        </form>
    );
};

export default Register;
