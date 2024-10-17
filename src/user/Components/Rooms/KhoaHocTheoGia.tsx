import React, { useState, useMemo } from "react";
import { Pagination } from "antd";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import Loading from "../Antd/Loading";
import "react-datepicker/dist/react-datepicker.css";
import useRoute from "../../../hook/useRoute";
import { NavLink } from "react-router-dom";
import { KhoaHocAPI } from "../../../util/fetchfromAPI";

type KhoaHocData = {
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
};

interface KhoaHocTheoGiaProps {
  priceRange: [number, number];
  giaTien: number; // Adjusted to accept number instead of string
}

const KhoaHocTheoGia: React.FC<KhoaHocTheoGiaProps> = ({
  priceRange,
  giaTien
}) => {
  const { navigate } = useRoute();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 6;

  // Fetch courses using react-query
  const queryResultKhoaHoc: UseQueryResult<KhoaHocData[]> = useQuery({
    queryKey: ["khoaHocList"],
    queryFn: KhoaHocAPI,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const courses = queryResultKhoaHoc.data || [];

  // Filter courses based on price range
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const price = parseFloat(course.GiaTien); // Assuming GiaTien is a string, convert to float
      return price >= priceRange[0] && price <= priceRange[1];
    });
  }, [courses, priceRange]);

  // Pagination logic
  const paginatedCourses = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredCourses.slice(startIndex, endIndex);
  }, [currentPage, pageSize, filteredCourses]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (queryResultKhoaHoc.isLoading) {
    return <Loading />;
  }

  if (queryResultKhoaHoc.isError) {
    return <div>Error: {queryResultKhoaHoc.error?.message}</div>;
  }

  const total = filteredCourses.length;

  return (
    <div className="col-lg-9">
      <div className="row">
        {paginatedCourses.map((course) => (
          <div className="col-sm col-md-6 col-lg-4 ftco-animate" key={course.IDKhoaHoc}>
            <div className="khoa-hoc">
              <NavLink
                to={`/detail/${course.IDKhoaHoc}`}
                className="img d-flex justify-content-center align-items-center"
                style={{ backgroundImage: `url(${course.HinhAnh})` }}
              >
                <div className="icon d-flex justify-content-center align-items-center">
                  <span className="icon-search2" />
                </div>
              </NavLink>
              <div className="text p-3 text-center">
                <h3 className="mb-3 truncated-title">
                  <NavLink to={`/detail/${course.IDKhoaHoc}`}>{course.TenKhoaHoc}</NavLink>
                </h3>
                <p>
                  <span className="price mr-2">{course.GiaTien}</span>
                </p>
                <ul className="list">
                  <li>
                    <span>Views:</span> {course.LuotXem}
                  </li>
                  <li>
                    <span>Discount:</span> {course.GiamGia}%
                  </li>
                </ul>
                <hr />
                <p className="pt-1">
                  <NavLink to={`/detail/${course.IDKhoaHoc}`} className="btn-custom">
                    View Details <span className="icon-long-arrow-right" />
                  </NavLink>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Pagination
        align="center"
        current={currentPage}
        total={total}
        pageSize={pageSize}
        onChange={handlePageChange}
      />
    </div>
  );
};

export default KhoaHocTheoGia;
