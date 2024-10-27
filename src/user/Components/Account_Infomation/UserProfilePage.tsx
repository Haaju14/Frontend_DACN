import React from "react";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../../util/fetchfromAPI";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import Profile from "./Profile";
import axios from "axios";
import Loading from "../Antd/Loading";
import { message } from "antd";

interface KhoaHocData {
  IDKhoaHoc: string;
  TenKhoaHoc: string;
  MoTaKhoaHoc: string;
  HinhAnh: string;
  NgayDang: string;
  LuotXem: number;
  GiamGia: number;
  GiaTien: string;
}

const UserProfilePage: React.FC = () => {
  const { userLogin } = useSelector((state: RootState) => state.userReducer);
  const userId = userLogin?.user?.IDNguoiDung; // Lấy ID người dùng

  const fetchRegisteredCoursesAPI = async () => {
    if (!userId) throw new Error("User ID is not available");

    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const response = await axios.get(`${BASE_URL}/khoa-hoc-dang-ky`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("API Response:", response.data); // Kiểm tra dữ liệu trả về từ API
    return response.data.content; // Trả về danh sách khóa học từ trường 'content'
  };

  const { data: registeredCourses = [], isLoading, isError } = useQuery<KhoaHocData[]>({
    queryKey: ["registeredCourses", userId],
    queryFn: fetchRegisteredCoursesAPI,
    enabled: !!userId, // Chỉ chạy nếu userId có giá trị
  });

  if (!userLogin) {
    return <div>User is not logged in. Please log in to access this page.</div>;
  }

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    message.error("Đã có lỗi xảy ra khi tải khóa học.");
    return <div>Error loading courses.</div>;
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
            {registeredCourses && registeredCourses.length > 0 ? (
              registeredCourses.map((course: any) => (
                <div key={course.IDKhoaHoc} className="product-card">
                  <img
                    src={course.IDKhoaHoc_KhoaHoc.HinhAnh || "https://via.placeholder.com/150"}
                    alt={course.IDKhoaHoc_KhoaHoc.TenKhoaHoc}
                    className="product-image"
                  />
                  <div className="card-content">
                    <h3 className="product-title">{course.IDKhoaHoc_KhoaHoc.TenKhoaHoc}</h3>
                    <div className="product-price">
                      <span className="current-price">{course.IDKhoaHoc_KhoaHoc.GiaTien || 'Chưa có giá'} VND</span>
                      <span className="original-price">
                        {(parseFloat(course.IDKhoaHoc_KhoaHoc.GiaTien) + 200000).toFixed(2)} VND
                      </span>
                    </div>
                    <p className="product-description">{course.IDKhoaHoc_KhoaHoc.MoTaKhoaHoc}</p>
                    <div className="card-body d-flex justify-content-between">
                      <a href={`/khoa-hoc/xem-chi-tiet/${course.IDKhoaHoc}`} className="btn btn-primary">Xem chi tiết</a>
                      <a href="#" className="btn btn-success"><i className="fa fa-heart"></i> Thêm yêu thích</a>
                    </div>
                  </div>
                </div>
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
