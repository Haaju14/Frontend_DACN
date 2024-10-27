import axios from 'axios';
import { data } from 'jquery';
import { TOKEN_AUTHOR } from './utilMethod';

export const BASE_URL = 'http://localhost:8080';
export const BASE_URL_IMG = 'http://localhost:8080/public/imgs/';



// User 


export const signUpAPI = async () => {
  const { data } = await axios.post(`${BASE_URL}/signup`,);
  return data;
};

export const UserAPI = async (p0: {
  IDNguoiDung: number;
  TenDangNhap: string;
  Email: string;
  HoTen: string;
  SDT: string;
  GioiTinh: boolean;
  AnhDaiDien?: string;
}) => {
  try {

    const response = await axios.put(`${BASE_URL}/user/profile`, {
      IDNguoiDung: p0.IDNguoiDung,
      TenDangNhap: p0.TenDangNhap,
      Email: p0.Email,
      HoTen: p0.HoTen,
      SDT: p0.SDT,
      AnhDaiDien: p0.AnhDaiDien,
    });

    return response.data; // Return the response data directly
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error; // Rethrow the error for handling in the calling function
  }
};

export const getUser = async () => {
  const response = await axios.get(`${BASE_URL}/user/profile`,);
  return response.data;
};

// quên mật khẩu
export const forgotPasswordAPI = async (email: any) => {
  try {
    const response = await axios.post(`${BASE_URL}/forgot-password`, {
      email,
    });
    return response.data;
  } catch (error) {
    console.error("Error sending forgot password request:", error);
    throw error; 
  }
};

//lấy danh sách khóa học
export const KhoaHocAPI = async (buyCourse?: any) => {
  const response = await axios.get(`${BASE_URL}/khoa-hoc`,);
  return response.data;
};

// đăng ký khóa học
export const postRegisteredCoursesAPI = async (_IDKhoaHoc: string) => {
  const response = await axios.post(`${BASE_URL}/khoa-hoc-dang-ky/:id`,);
  return response.data;
};

//lấy danh sách các khóa học đăng ký theo IDNguoiDung
export const getRegisteredCoursesAPI = async (userId: string, token: string) => {
  try {
    // Gọi API để lấy khóa học đã đăng ký
    const response = await axios.get(`${BASE_URL}/khoa-hoc-dang-ky?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Khóa học đã đăng ký trả về:', response.data); // Log dữ liệu trả về
    return response.data; // Trả về danh sách khóa học đã đăng ký
  } catch (error: any) {
    console.error('Lỗi khi gọi API lấy khóa học đã đăng ký:', error.response || error.message);
    throw new Error(error.response ? error.response.data.message : error.message);
  }
};

//lấy tất cả các khóa học đã đăng ký (not hocvien)
export const getAllRegisteredCoursesAPI = async () => {
  const response = await axios.get(`${BASE_URL}/khoa-hoc-dang-ky/all`,);
  return response.data;
};

//lấy danh sách khóa học miễn phí
export const getFreeCoursesAPI = async () => {
  const response = await axios.get(`${BASE_URL}/khoa-hoc-mien-phi`,);
  return response.data;
};

// lấy danh sách khóa học trả phí
export const getPayCoursesAPI = async () => {
  const response = await axios.get(`${BASE_URL}/khoa-hoc-tra-phi`,);
  return response.data;
};

// lấy danh sách khóa học top ( 1 -5 )
export const getHotCourses = async (token: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/khoa-hoc/top`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching top courses:', error);
    throw error;
  }
};

// lấy danh sach khóa học trending (6-10)
export const getTrendingCourses = async (token: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/khoa-hoc/trending`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching top courses:', error);
    throw error;
  }
};

// Xem chi tiết khóa học theo IDKhoaHoc
export const getCourseDetailAPI = async (id: string, token: string) => {
  const response = await axios.get(`${BASE_URL}/khoa-hoc/xem-chi-tiet/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`, 
    },
  });
  return response.data;
};

// Thêm khóa học yêu thích
export const postFavoritesCourseAPI = async (id:number, token: string) => {
  const response = await axios.post(`${BASE_URL}/favorite/add/${id}`,{
    headers: {
      Authorzation: `Bearer ${token}`,
    },
  });
  return response.data;
};

// bỏ khóa học yêu thích
export const deleteFavoritesCourseAPI = async (id:number, token: string) => {
  const response = await axios.delete(`${BASE_URL}/favorites/${id}`,{
    headers: {
      Authorzation: `Bearer ${token}`,
    },
  });
  return response.data;
};

//lấy danh sách khóa học yêu thích theo người dùng
export const getFavoritesCourseAPI = async (token: string) => {
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
// lấy bình luận theo ID khóa học
export const getCommentIdCourse = async (id:number, token: string) => {
  const response = await axios.get(`${BASE_URL}/binh-luan/get/${id}`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}