import { useQuery } from "@tanstack/react-query";
import { BASE_URL, getRegisteredCoursesAPI } from "../../../util/fetchfromAPI";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import Profile from "./Profile";
import RegisteredCourse from "./RegisteredCourse";
import axios from "axios";
import { useEffect, useState } from "react";

interface KhoaHocData {
  IDKhoaHoc: string;
  TenKhoaHoc: string;
  MoTaKhoaHoc: string;
  HinhAnh: string;
  Video: string;
  NgayDang: string;
  LuotXem: number;
  BiDanh: string;
  MaNhom: string;
  SoLuongHocVien: number;
  GiamGia: number;
  GiaTien: string;
}

const UserProfilePage: React.FC = () => {
  const { userLogin } = useSelector((state: RootState) => state.userReducer);

  // Gán giá trị mặc định cho userId
  const userId = userLogin?.user?.IDNguoiDung ?? 0; // Nếu không có IDNguoiDung, gán là 0
  const getRegisteredCoursesAPI = async (userId: number, p0: string,) => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${BASE_URL}/khoa-hoc-dang-ky?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Khóa học đã đăng ký trả về:', response.data);
    return response.data; // Trả về danh sách khóa học đã đăng ký
  };

  // Fetch registered courses
  const { data: registeredCourses = [], isLoading, isError } = useQuery({
    queryKey: ["registeredCourses", userId],
    queryFn: () => getRegisteredCoursesAPI(userId, userLogin?.token!), // Sử dụng token
    enabled: !!userLogin, // Chỉ chạy nếu userLogin không phải null
  });

  if (!userLogin) {
    return <div>User is not logged in. Please log in to access this page.</div>;
  }

  const userData = { ...userLogin.user };

  return (
    <div className="user-profile-page container">
      <div className="row">
        <div className="col-md-4">
          <Profile user={userData} />
        </div>
        <div className="col-md-8">
          <div className="registered-courses">
            <h2>Khóa Học Đã Đăng Ký</h2>
            {isLoading && <p>Đang tải khóa học...</p>}
            {isError && <p>Đã có lỗi xảy ra khi tải khóa học.</p>}
            {Array.isArray(registeredCourses) && registeredCourses.length > 0 ? (
              registeredCourses.map((course: KhoaHocData) => (
                <RegisteredCourse 
                  key={course.IDKhoaHoc.toString()} 
                  userCourseData={{
                    IDKhoaHoc: course.IDKhoaHoc.toString(),
                    TenKhoaHoc: course.TenKhoaHoc,
                    MoTaKhoaHoc: course.MoTaKhoaHoc,
                    HinhAnh: course.HinhAnh,
                    SoLuongHocVien: course.SoLuongHocVien,
                    GiaTien: course.GiaTien,
                  }}
                />
              ))
            ) : (
              <p>Chưa có khóa học nào được đăng ký.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
