import React, {  } from "react";
import "../../../css/UserProfilePage.css";
import Loading from "../Antd/Loading";
import useRoute from "../../../hook/useRoute";
import { BASE_URL } from "../../../util/fetchfromAPI";
import { useDispatch } from "react-redux";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios from "axios";

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

interface RegisteredCourseProps {
  userCourseData: {
    IDKhoaHoc: string;
    TenKhoaHoc: string;
    MoTaKhoaHoc: string;
    HinhAnh: string;
    SoLuongHocVien: number;
    GiaTien: string;
  };
}

const RegisteredCourse: React.FC<RegisteredCourseProps> = ({ userCourseData }) => {
  const { navigate } = useRoute();
  const dispatch = useDispatch();

  const getRegisteredCoursesAPI = async (userId: string): Promise<KhoaHocData[]> => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${BASE_URL}/khoa-hoc-dang-ky/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Khóa học đã đăng ký trả về:', response.data);
    return response.data; // Trả về danh sách khóa học đã đăng ký
  };
  // Fetch course detail by ID
  const getCourseDetailAPI = async (courseId: string) => {
    const token = localStorage.getItem("token"); // Lấy token từ localStorage 
    const response = await axios.get(`${BASE_URL}/khoa-hoc/xem-chi-tiet/${courseId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };

  // Fetch course data using react-query
  const queryResultCourseByID: UseQueryResult<KhoaHocData> = useQuery({
    queryKey: ["courseByID", userCourseData?.IDKhoaHoc],
    queryFn: () => getCourseDetailAPI(userCourseData?.IDKhoaHoc),
    refetchOnWindowFocus: true,
    enabled: !!userCourseData?.IDKhoaHoc, // Chỉ gọi API nếu có ID khóa học
  });

  // Loading state
  if (queryResultCourseByID.isLoading) {
    return <Loading />;
  }

  // Error state
  if (queryResultCourseByID.isError) {
    return <div>Error: {queryResultCourseByID.error?.message}</div>;
  }

  // Handle the course selection and dispatch
  const handleCourseByID = () => {
    if (!queryResultCourseByID.data) return;

    const registeredCourse = {
      idLocation: queryResultCourseByID.data?.IDKhoaHoc || 0,
    };

    // Dispatch action to Redux store
    dispatch({
      type: "SET_REGISTERED_COURSE",
      payload: registeredCourse,
    });

    // Navigate to the course detail page
    navigate(`/khoa-hoc/xem-chi-tiet/${queryResultCourseByID.data?.IDKhoaHoc}`);
  };

  return (
    <div className="course-card card mb-3" onClick={handleCourseByID}>
      <div className="row no-gutters">
        <div className="col-md-4">
          <img
            src={userCourseData.HinhAnh}
            className="card-img"
            alt={userCourseData.TenKhoaHoc}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title">{userCourseData.TenKhoaHoc}</h5>
            <p className="card-text">{userCourseData.MoTaKhoaHoc}</p>
            <p className="card-text">
              <small className="text-muted">Students: {userCourseData.SoLuongHocVien}</small>
            </p>
            <p className="card-text">{userCourseData.GiaTien}$</p>
          </div>
        </div>
      </div>
    </div>
  );
};


export default RegisteredCourse;
