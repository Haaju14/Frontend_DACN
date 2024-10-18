import React from "react";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { BASE_URL, KhoaHocAPI } from "../../../util/fetchfromAPI";  // Thay thế API tương ứng
import Loading from "../Antd/Loading";  // Component loading
import { useDispatch, useSelector } from "react-redux";
import useRoute from "../../../hook/useRoute";

interface KhoaHocData {
  IDKhoaHoc: number;
  IDDanhMuc: number;
  TenKhoaHoc: string;
  MoTaKhoaHoc: string;
  HinhAnh: string;
  Video: string;
  NgayDang: string;
  LuotXem: number;
  SoLuongHocVien: number;
  GiamGia: number;
  GiaTien: string;
  LoaiKhoaHoc: string;
}

const SectionIcon: React.FC = () => {
  const dispatch = useDispatch();
  const { navigate } = useRoute();
  
  
  const KhoaHocAPI = async () => {
    const response = await fetch(`${BASE_URL}/khoa-hoc`);
  
    if (!response.ok) {
      throw new Error('Failed to fetch');
    }
  
    const data = await response.json();
    console.log("API response:", data); // In ra để xem phản hồi từ API
    return data;
  };
  

  
  const queryResult: UseQueryResult<KhoaHocData[], Error> = useQuery({
    queryKey: ["CourseListApi"],
    queryFn: KhoaHocAPI, // Hàm fetch từ API
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });
  console.log("Query Result:", queryResult); // In ra log để kiểm tra dữ liệu fetch được

  // Hiển thị loading khi đang fetch
  if (queryResult.isLoading) {
    return <Loading />;
  }

  // Hiển thị lỗi nếu có lỗi
  if (queryResult.error) {
    return <div>Error: {queryResult.error.message}</div>;
  }

  const courses = Array.isArray(queryResult.data) ? queryResult.data : [];
  console.log("Courses data:", courses); // Log để xem kết quả cuối cùng

  const top4Result = courses.slice(0, 4);

  // Hàm xử lý khi nhấn vào khóa học
  const handleKhoaHocClick = (id: number) => {
    // Ví dụ cách điều hướng khi nhấn vào một khóa học
    navigate(`/khoahoc/${id}`);
  };

  return (
    <section className="ftco-section">
      <div className="container d-flex justify-content-center">
      {courses.length === 0 ? (
        <div>No courses available.</div> // Kiểm tra nếu không có dữ liệu
      ) : (
        <div className="row d-flex justify-content-center">
          {top4Result.map((khoaHoc) => (
            <div
              key={khoaHoc.IDKhoaHoc}
              className="col-md-3 d-flex align-self-stretch ftco-animate"
            >
              <div
                className="media block-6 services py-4 d-block text-center"
                style={{ cursor: "pointer" }}
                onClick={() => handleKhoaHocClick(khoaHoc.IDKhoaHoc)}
              >
                <div className="d-flex justify-content-center">
                  <div className="icon d-flex align-items-center justify-content-center">
                    <img
                      src={khoaHoc.HinhAnh}
                      alt={khoaHoc.TenKhoaHoc}
                      style={{
                        width: 100,
                        height: 100,
                        borderRadius: 10,
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                      }}
                    />
                  </div>
                </div>
                <div className="media-body p-2 mt-2">
                  <h3 className="heading mb-3">{khoaHoc.TenKhoaHoc}</h3>
                  <p>{khoaHoc.MoTaKhoaHoc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </section>
  );
};

export default SectionIcon;
