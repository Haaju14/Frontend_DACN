import React, { useState } from "react";
import { Pagination } from "antd";
import "react-datepicker/dist/react-datepicker.css";
import useRoute from "../../../hook/useRoute";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../util/fetchfromAPI";
import Loading from "../Antd/Loading";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux"; // Assuming you're using Redux to store the token
import { RootState } from "../../../redux/store"; // Adjust path based on your store setup

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

const KhoaHocAll: React.FC = () => {
  const { navigate } = useRoute();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 6;

  // Get the token from the Redux store or localStorage (based on your auth strategy)
  const token = useSelector((state: RootState) => state.userReducer.token); 

  // Fetch KhoaHoc data using react-query
  const fetchKhoaHoc = async () => {
    const response = await axios.get(`${BASE_URL}/khoa-hoc`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the Authorization header
      },
    });
    return response.data.data; // Adjust this line based on the actual API response
  };

  const { data: KhoaHocList = [], isLoading, isError } = useQuery<KhoaHocData[]>({
    queryKey: ["KhoaHoc"],
    queryFn: fetchKhoaHoc,
    enabled: !!token, // Only run the query if the token exists
  });

  // Check if data is loading
  if (isLoading) {
    return <Loading />;
  }

  // Check if there is an error
  if (isError) {
    return <div>Error loading courses.</div>;
  }

  // Calculate total and paginate
  const total = KhoaHocList.length;
  const paginatedKhoaHoc = KhoaHocList.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="col-lg-9">
      <div className="row">
        {paginatedKhoaHoc.map((KhoaHoc) => (
          <div className="col-sm col-md-6 col-lg-4 ftco-animate" key={KhoaHoc.IDKhoaHoc}>
            <div className="khoa-hoc-item">
              <NavLink
                to={`/detail/${KhoaHoc.IDKhoaHoc}`}
                className="img d-flex justify-content-center align-items-center"
                style={{ backgroundImage: `url(${KhoaHoc.HinhAnh})` }}
              >
                <div className="icon d-flex justify-content-center align-items-center">
                  <span className="icon-search2" />
                </div>
              </NavLink>
              <div className="text p-3 text-center">
                <h3 className="mb-3 truncated-title">
                  <NavLink to={`/detail/${KhoaHoc.IDKhoaHoc}`}>{KhoaHoc.TenKhoaHoc}</NavLink>
                </h3>
                <p>
                  <span className="price mr-2">{KhoaHoc.GiaTien}</span>
                </p>
                <ul className="list">
                  <li>
                    <span>Views:</span> {KhoaHoc.LuotXem}
                  </li>
                  <li>
                    <span>Discount:</span> {KhoaHoc.GiamGia}%
                  </li>
                </ul>
                <hr />
                <p className="pt-1">
                  <NavLink to={`/detail/${KhoaHoc.IDKhoaHoc}`} className="btn-custom">
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
        onChange={setCurrentPage} // Directly pass the setCurrentPage function
      />
    </div>
  );
};

export default KhoaHocAll;
