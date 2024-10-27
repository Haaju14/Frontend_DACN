import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../../util/fetchfromAPI"; // Chỉ cần import BASE_URL
import axios from "axios";

interface KhoaHocData {
  IDKhoaHoc: number;
  TenKhoaHoc: string;
  MoTaKhoaHoc: string;
  HinhAnh: string;
  GiaTien: string;
}

interface FavoritesProps {
  IDNguoiDung: number; // ID người dùng
}

const Favorites: React.FC<FavoritesProps> = ({ IDNguoiDung }) => {
  const [favoriteCourses, setFavoriteCourses] = useState<KhoaHocData[]>([]);
  const [notification, setNotification] = useState("");

  // Hàm để lấy danh sách khóa học yêu thích
  const getFavoritesCourseAPI = async (token: string) => {
    try {
      // Gọi API để lấy khóa học đã yêu thích
      
      const response = await axios.get(`${BASE_URL}/favorites`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Khóa học đã yêu thích trả về:', response.data); // Log dữ liệu trả về
      return response.data; // Trả về danh sách khóa học đã yêu thích
    } catch (error: any) {
      console.error('Lỗi khi gọi API lấy khóa học đã yêu thích:', error.response || error.message);
      throw new Error(error.response ? error.response.data.message : error.message);
    }
  };

  // Hàm để xóa khóa học khỏi danh sách yêu thích
  const deleteFavoritesCourseAPI = async (IDKhoaHoc: number) => {
    try {
      const token = localStorage.getItem('token');

      await axios.delete(`${BASE_URL}/favorites`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          IDNguoiDung,
          IDKhoaHoc,
        },
      });

      // Cập nhật lại danh sách khóa học yêu thích
      setFavoriteCourses(favoriteCourses.filter(course => course.IDKhoaHoc !== IDKhoaHoc));
      setNotification("Đã xóa khóa học khỏi danh sách yêu thích!");
    } catch (error) {
      console.error("Error removing favorite course:", error);
      setNotification("Lỗi khi xóa khóa học khỏi danh sách yêu thích!");
    }
  };

  // Lấy danh sách khóa học yêu thích khi component được mount
  useEffect(() => {
    const fetchFavoriteCourses = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const courses = await getFavoritesCourseAPI(token);
          setFavoriteCourses(courses);
        } catch (error) {
          setNotification("Lỗi khi tải danh sách khóa học yêu thích!");
        }
      }
    };
  
    fetchFavoriteCourses();
  }, [IDNguoiDung]);
  return (
    <div>
      <h1>Khóa học yêu thích</h1>
      {notification && <div className="alert alert-info">{notification}</div>}
      <div className="row">
        {favoriteCourses.length > 0 ? (
          favoriteCourses.map(course => (
            <div className="col-md-4" key={course.IDKhoaHoc}>
              <div className="course-item">
                <img
                  src={course.HinhAnh}
                  alt={course.TenKhoaHoc}
                  style={{ width: "100%", height: "auto", maxHeight: "200px" }}
                />
                <h3>{course.TenKhoaHoc}</h3>
                <p>{course.MoTaKhoaHoc}</p>
                <p>
                  <strong>Price:</strong> {course.GiaTien}
                </p>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteFavoritesCourseAPI(course.IDKhoaHoc)}
                >
                  Remove from Favorites
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Không có khóa học yêu thích nào.</p>
        )}
      </div>
    </div>
  );
};

export default Favorites;
