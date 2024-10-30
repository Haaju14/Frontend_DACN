import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../../util/fetchfromAPI"; 
import axios from "axios";
import { NavLink } from "react-router-dom";
import { message } from "antd";
import Loading from "../Antd/Loading";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

interface KhoaHocData {
  IDKhoaHoc: number;
  TenKhoaHoc: string;
  MoTaKhoaHoc: string;
  HinhAnh: string;
  NgayDang: string;
  LuotXem: number;
  GiamGia: number;
  GiaTien: string;
}

const Favorites: React.FC = () => {
  const [favoriteCourses, setFavoriteCourses] = useState<KhoaHocData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { userLogin } = useSelector((state: RootState) => state.userReducer);
  const userId = userLogin?.user?.IDNguoiDung;

  // Hàm lấy danh sách khóa học yêu thích
  const getFavoritesCourseAPI = async (token: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/favorites`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Danh sách khóa học yêu thích:", response.data); // Log the data received from the API
      return response.data;
    } catch (error: any) {
      console.error("Lỗi khi lấy khóa học yêu thích:", error);
      message.error("Không thể tải danh sách yêu thích.");
    }
  };

  // Hàm để xóa khóa học khỏi danh sách yêu thích
  const deleteFavoritesCourseAPI = async (IDKhoaHoc: number) => {
    const token = localStorage.getItem('token');
    if (!token) return message.error("Không tìm thấy token.");

    try {
      await axios.delete(`${BASE_URL}/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { IDNguoiDung: userId, IDKhoaHoc },
      });
      setFavoriteCourses(favoriteCourses.filter(course => course.IDKhoaHoc !== IDKhoaHoc));
      message.success("Đã xóa khóa học khỏi danh sách yêu thích!");
    } catch (error) {
      console.error("Lỗi khi xóa khóa học yêu thích:", error);
      message.error("Không thể xóa khóa học.");
    }
  };

  useEffect(() => {
    const fetchFavoriteCourses = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (token) {
        const courses = await getFavoritesCourseAPI(token);
        setFavoriteCourses(courses);
      }
      setLoading(false);
    };
    fetchFavoriteCourses();
  }, [userId]); 

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="user-profile-page container">
      <div className="row">
        <div className="col-md-8">
          <div className="favorite-courses">
            <h2>Khóa Học Yêu Thích</h2>
            <div className="course-grid">
              {favoriteCourses && favoriteCourses.length > 0 ? (
                favoriteCourses.map((course: any) => (
                  <div key={course.IDKhoaHoc} className="product-card">
                    <NavLink to={`/khoa-hoc/xem-chi-tiet/${course.IDKhoaHoc}`}>
                      <img
                        src={course.HinhAnh || "https://via.placeholder.com/150"}
                        alt={course.TenKhoaHoc}
                        className="product-image"
                      />
                    </NavLink>
                    <div className="card-content">
                      <NavLink to={`/khoa-hoc/xem-chi-tiet/${course.IDKhoaHoc}`} className="product-title-link">
                        <h3 className="product-title">{course.TenKhoaHoc}</h3>
                      </NavLink>
                      <span className="product-description">{course.MoTaKhoaHoc}</span> 
                      <div className="product-price">               
                        <span className="original-price">
                          {(parseFloat(course.GiaTien) + 200000).toFixed(2)} VND
                        </span>
                        <span className="current-price">{course.GiaTien || 'Chưa có giá'} VND</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>Chưa có khóa học yêu thích nào.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Favorites;
