import React from "react";
import "../../../css/UserProfilePage.css";
import Loading from "../Antd/Loading";
import useRoute from "../../../hook/useRoute";
import { getRegisteredCoursesAPI, KhoaHocAPI } from "../../../util/fetchfromAPI";
import { useDispatch } from "react-redux";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

interface CourseData {
  IDKhoaHoc: number;
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
    LoaiKhoaHoc: string;
    ngayBatDau?: string;
    ngayKetThuc?: string;
  };
}

const RegisteredCourse: React.FC<RegisteredCourseProps> = ({ userCourseData }) => {
  const { navigate } = useRoute();
  const dispatch = useDispatch();

  // Fetch course data by ID using react-query
  const queryResultCourseByID: UseQueryResult<CourseData> = useQuery({
    queryKey: ["courseByID", userCourseData?.IDKhoaHoc || ""],
    queryFn: () => getRegisteredCoursesAPI(userCourseData?.IDKhoaHoc?.toString() || ""),
    refetchOnWindowFocus: true,
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
      dateStart: userCourseData.ngayBatDau || "N/A",
      dateEnd: userCourseData.ngayKetThuc || "N/A",
      idLocation: queryResultCourseByID.data?.IDKhoaHoc || 0,
      totalStudents: userCourseData.SoLuongHocVien || 0,
    };

    // You should dispatch an action here instead of a plain object
    // Assuming there's a `setRegisteredCourse` action:
    dispatch({
      type: "SET_REGISTERED_COURSE",
      payload: registeredCourse,
    });

    // Navigate to the course detail page
    navigate(`/khoa-hoc/xem-chi-tiet/:id/${queryResultCourseByID.data?.IDKhoaHoc}`);
  };

  return (
    <div className="course-card card mb-3">
      <div className="row no-gutters">
        <div className="col-md-4">
          <img
            src={queryResultCourseByID.data?.HinhAnh}
            className="card-img"
            alt={queryResultCourseByID.data?.TenKhoaHoc}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onClick={handleCourseByID}
          />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title">{queryResultCourseByID.data?.TenKhoaHoc}</h5>
            <p className="card-text">
              {queryResultCourseByID.data?.MoTaKhoaHoc}
            </p>
            <p className="card-text">
              <small className="text-muted">
                Students: {queryResultCourseByID.data?.SoLuongHocVien}
              </small>
            </p>
            <p className="card-text">{queryResultCourseByID.data?.GiaTien}$</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisteredCourse;
