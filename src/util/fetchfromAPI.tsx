import axios from 'axios';
import { data } from 'jquery';

export const BASE_URL = 'http://localhost:8080';
export const BASE_URL_IMG = 'http://localhost:8080/public/imgs/';



// User 


export const signUpAPI = async () => {
  const { data } = await axios.post(`${BASE_URL}/signup`,  );
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
        GioiTinh: p0.GioiTinh,
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
}

//lấy danh sách khóa học
export const KhoaHocAPI = async (buyCourse?: any) => {
 const response = await axios.get(`${BASE_URL}/khoa-hoc`, );
  return response.data;
}
// lấy  các khóa học đã đăng ký
export const getRegisteredCoursesAPI = async (_IDKhoaHoc :string) => {
        const response = await axios.get(`${BASE_URL}/khoa-hoc-dang-ky/:id`,);
        return response.data;
};
//lấy tất cả danh sách khóa học đã đăng ký
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
//Xem chi tiết khóa học theo IDKhoaHoc



export const getCourseDetailAPI = async (id: string, token: string) => {
  const response = await axios.get(`${BASE_URL}/khoa-hoc/xem-chi-tiet/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`, // Đảm bảo token được định dạng chính xác
    },
  });
  return response.data;
};
