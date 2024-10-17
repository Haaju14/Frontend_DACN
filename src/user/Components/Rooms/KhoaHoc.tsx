import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Loading from "../Antd/Loading";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import RangeSliderComponent from "./RangeSliderComponent";
import { BASE_URL } from "../../../util/fetchfromAPI";

 interface KhoaHocData {
  IDKhoaHoc: number;       
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
};

const KhoaHocComponent: React.FC = () => {
  const [selectedTag, setSelectedLocation] = useState<string>("");
  const [priceRange, setPriceRange] = useState<number[]>([0, 100]);
  
  const fetchKhoaHocAPI = async () => {
    const { data } = await axios.get(`${BASE_URL}/khoa-hoc`);
    return data.content; // Xử lý khi không có dữ liệu
  };
  

  const { data: KhoaHocList = [], isLoading, isError, error } = useQuery<KhoaHocData[]>({
    queryKey: ["KhoaHoc"],
    queryFn: fetchKhoaHocAPI,
  });

  const handleTagChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLocation(event.target.value);
  };

  const handlePriceRangeChange = (range: number[]) => {
    setPriceRange(range);
  };
  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <div>Error loading courses.</div>; 
  }
  


  return (
    <section className="ftco-section bg-light">
      <div className="container">
        <div className="row">
          <div className="col-lg-3 sidebar">
            <div className="sidebar-wrap bg-light ftco-animate">
              <form action="#">
                <div className="fields">
                  <h3 className="heading mb-4">Advanced Search</h3>
                  <div className="form-group">
                    <div className="select-wrap one-third">
                      <div className="icon">
                        <span className="ion-ios-arrow-down" />
                      </div>
                      <select
                        name=""
                        id=""
                        className="form-control"
                        value={selectedTag}
                        onChange={handleTagChange}
                      >
                        <option value="">All Khoa Học</option>
                        <option value="">Java</option>
                        <option value="">Python</option>
                        <option value="">Unity</option>
                        <option value="">Reactjs</option>
                        <option value="">C++</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <RangeSliderComponent onChange={handlePriceRangeChange} />
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="col-lg-9">
            <div className="khoa-hoc-list">
              <div className="row">
                {KhoaHocList.map((KhoaHoc) => (
                  <div className="col-md-4" key={KhoaHoc.IDKhoaHoc}>
                    <div className="khoa-hoc-item">
                      <img src={KhoaHoc.HinhAnh} alt={KhoaHoc.TenKhoaHoc} />
                      <h3>{KhoaHoc.TenKhoaHoc}</h3>
                      <p>{KhoaHoc.MoTaKhoaHoc}</p>
                      <p><strong>Price:</strong> {KhoaHoc.GiaTien}</p> {}
                      <p><strong>Posted On:</strong> {KhoaHoc.NgayDang}</p>
                      <p><strong>Views:</strong> {KhoaHoc.LuotXem}</p>
                      <p><strong>Discount:</strong> {KhoaHoc.GiamGia}%</p>
                      <button className="btn btn-primary">View Details</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


export default KhoaHocComponent;
