import React, { useEffect } from "react";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import Loading from "../Antd/Loading";
import useRoute from "../../../hook/useRoute";
import { NavLink } from "react-router-dom";
import { BASE_URL, KhoaHocAPI } from "../../../util/fetchfromAPI";
import axios from "axios";

// Define KhoaHocData interface
interface KhoaHocData {
  id: any; // Consider changing to a more specific type if possible
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

const SectionOurRoom: React.FC = () => {
  useRoute();
  const fetchKhoaHocAPI = async () => {
    const { data } = await axios.get(`${BASE_URL}/khoa-hoc`);
    return data.content || []; // Xử lý khi không có dữ liệu
  };
  // Fetch course data
  const queryResult: UseQueryResult<KhoaHocData[]> = useQuery<KhoaHocData[]>({
    queryKey: ["KhoaHoc"],
    queryFn: KhoaHocAPI,  // Make sure this points to the correct function
    staleTime: 5 * 60 * 1000, 
    refetchOnWindowFocus: true,
  });

  // Log data for debugging
  console.log("Query result:", queryResult);

  // Handle loading and error states
  if (queryResult.isLoading) {
    return <Loading />;
  }

  if (queryResult.error) {
    console.error("Error fetching courses:", queryResult.error);
    return <div>Error: {queryResult.error.message}</div>;
  }

  // Limit results to the top 6 courses
  const top6Result = Array.isArray(queryResult.data) ? queryResult.data.slice(0, 6) :  [];

  return (
    <section className="ftco-section bg-light">
      <div className="container">
        <div className="row justify-content-center mb-5 pb-3">
          <div className="col-md-7 heading-section text-center ftco-animate">
            <h2 className="mb-4">Our Course</h2>
          </div>
        </div>
        <div className="row">
          {top6Result.map((KhoaHoc: KhoaHocData) => (
            <div
              key={KhoaHoc.IDKhoaHoc}
              className="col-sm col-md-6 col-lg-4 ftco-animate"
            >
              <div className="room">
                <NavLink
                  to={`/khoa-hoc/xem-chi-tiet/${KhoaHoc.IDKhoaHoc}`} // Fixed the URL format
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
                    <span className="price mr-2">{KhoaHoc.GiaTien}</span>
                  </p>
                  <hr />
                  <p className="pt-1 truncated-text">
                    <NavLink to={`/khoa-hoc/xem-chi-tiet/${KhoaHoc.IDKhoaHoc}`} className="btn-custom">
                      {KhoaHoc.MoTaKhoaHoc}
                    </NavLink>
                  </p>
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
