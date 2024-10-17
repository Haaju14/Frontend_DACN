import React, { useState, useEffect } from "react";
import Profile from "./Profile";
import "../../../css/UserProfilePage.css";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Pagination } from "antd";

interface User {
  IDNguoiDung: number;
  TenDangNhap: string;
  Email: string;
  MatKhau: string;
  HoTen: string;
  GioiTinh: boolean;
  SDT: string;
  Role: string;
  AnhDaiDien?: string;
}

export interface UserReducerType {
  userLogin: UserLogin | null;
}

export interface UserLogin {
  user: User;
  token: string;
}

const UserProfilePage: React.FC = () => {
  const { userLogin } = useSelector((state: RootState) => state.userReducer);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Add logging to check userLogin value
  useEffect(() => {
    console.log("userLogin:", userLogin);
  }, [userLogin]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle case when user is not logged in
  if (!userLogin) {
    return <div>User is not logged in. Please log in to access this page.</div>;
  }

  const userData: User = {
    IDNguoiDung: userLogin.user?.IDNguoiDung,
    TenDangNhap: userLogin.user?.TenDangNhap,
    Email: userLogin.user?.Email,
    MatKhau: userLogin.user?.MatKhau,
    HoTen: userLogin.user?.HoTen,
    GioiTinh: userLogin.user?.GioiTinh,
    SDT: userLogin.user?.SDT,
    Role: userLogin.user?.Role,
    AnhDaiDien: userLogin.user?.AnhDaiDien,
  };

  return (
    <div className="user-profile-page container">
      <div className="row">
        <div className="col-md-4">
          <Profile user={userData} />
        </div>
        <div className="col-md-8">
          <div className="rented-rooms">
            <h2>Course List</h2>
            {/* Add course list content here */}
          </div>
          <Pagination
            align="center"
            current={currentPage}
            pageSize={6}
            onChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
