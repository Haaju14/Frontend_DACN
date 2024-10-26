import React from "react";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import Loading from "../Antd/Loading";
import useRoute from "../../../hook/useRoute";
import { NavLink } from "react-router-dom";
import { BASE_URL } from "../../../util/fetchfromAPI";
import axios from "axios";

// Define KhoaHocData interface
interface KhoaHocData {
  IDKhoaHoc: number;
  TenKhoaHoc: string;
  MoTaKhoaHoc: string;
  HinhAnh: string;
  GiaTien: string;
  XepLoai: string;
}

const SectionOurRoom: React.FC = () => {
  useRoute();

  const fetchKhoaHocAPI = async () => {
    const { data } = await axios.get(`${BASE_URL}/khoa-hoc`);
    return data.content || []; // Xử lý khi không có dữ liệu
  };

  // Fetch course data
  const queryResult: UseQueryResult<KhoaHocData[]> = useQuery<KhoaHocData[]>({
    queryKey: ["KhoaHoc"],
    queryFn: fetchKhoaHocAPI,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  // Handle loading and error states
  if (queryResult.isLoading) {
    return <Loading />;
  }

  if (queryResult.error) {
    console.error("Error fetching courses:", queryResult.error);
    return <div>Error: {queryResult.error.message}</div>;
  }

  // Kiểm tra xem queryResult.data có giá trị hay không
  const data = queryResult.data || []; // Sử dụng mảng rỗng nếu data không tồn tại

  // Lấy danh sách khóa học top (1-5) và trending (6-10)
  const topCourses = data.slice(0, 5); // Khóa học 1-5
  const trendingCourses = data.slice(5, 10); // Khóa học 6-10

  return (
    <section className="ftco-section bg-light">
      <div className="container">
        <div className="row justify-content-center mb-5 pb-3">
          <div className="col-md-7 heading-section text-center ftco-animate">
            <h2 className="mb-4">Courses</h2> {/* Tiêu đề chung */}
          </div>
        </div>
        
        <div className="row">
          <div className="col-md-12 heading-section text-center ftco-animate">
            <h4 className="mb-4">Top Courses</h4>
          </div>
        </div>
        <div className="row">
          {topCourses.map((KhoaHoc: KhoaHocData) => (
            <div key={KhoaHoc.IDKhoaHoc} className="col-sm col-md-6 col-lg-4 ftco-animate">
              <div className="course">
                <NavLink
                  to={`/khoa-hoc/xem-chi-tiet/${KhoaHoc.IDKhoaHoc}`} 
                  className="img d-flex justify-content-center align-items-center"
                  style={{ backgroundImage: `url(${KhoaHoc.HinhAnh})` }}
                >
                  <div className="icon d-flex justify-content-center align-items-center">
                    <span className="icon-search2" />                  
                  </div>
                </NavLink>
                <div className="text p-3 text-center">
                  <h3 className="mb-3 truncated-title">
                    <NavLink to={`/khoa-hoc/xem-chi-tiet/${KhoaHoc.IDKhoaHoc}`}>
                      {KhoaHoc.TenKhoaHoc}
                    </NavLink>
                  </h3>
                  <p>
                    <span className="price mr-2">{KhoaHoc.GiaTien} VND</span>
                  </p>
                  <p>
                    <span className="description">{KhoaHoc.MoTaKhoaHoc}</span>
                  </p>
                  <hr />
                  <button>
                    <NavLink to={`/khoa-hoc/xem-chi-tiet/${KhoaHoc.IDKhoaHoc}`}>
                      View Details
                    </NavLink>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row justify-content-center mb-5 pb-3">
          <div className="col-md-12 heading-section text-center ftco-animate">
            <h4 className="mb-4">Trending Courses</h4>
          </div>
        </div>
        <div className="row">
          {trendingCourses.map((KhoaHoc: KhoaHocData) => (
            <div key={KhoaHoc.IDKhoaHoc} className="col-sm col-md-6 col-lg-4 ftco-animate">
              <div className="course">
                <NavLink
                  to={`/khoa-hoc/xem-chi-tiet/${KhoaHoc.IDKhoaHoc}`} 
                  className="img d-flex justify-content-center align-items-center"
                  style={{ backgroundImage: `url(${KhoaHoc.HinhAnh})` }}
                >
                  <div className="icon d-flex justify-content-center align-items-center">
                    <span className="icon-search2" />                  
                  </div>
                </NavLink>
                <div className="text p-3 text-center">
                  <h3 className="mb-3 truncated-title">
                    <NavLink to={`/khoa-hoc/xem-chi-tiet/${KhoaHoc.IDKhoaHoc}`}>
                      {KhoaHoc.TenKhoaHoc}
                    </NavLink>
                  </h3>
                  <p>
                    <span className="price mr-2">{KhoaHoc.GiaTien} VND</span>
                  </p>
                  <p>
                    <span className="description">{KhoaHoc.MoTaKhoaHoc}</span>
                  </p>
                  <hr />
                  <button>
                    <NavLink to={`/khoa-hoc/xem-chi-tiet/${KhoaHoc.IDKhoaHoc}`}>
                      View Details
                    </NavLink>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectionOurRoom;
