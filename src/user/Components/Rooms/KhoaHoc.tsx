import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Loading from "../Antd/Loading";
import RangeSliderComponent from "./RangeSliderComponent";
import { BASE_URL } from "../../../util/fetchfromAPI";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface KhoaHocData {
  IDKhoaHoc: number;
  TenKhoaHoc: string;
  MoTaKhoaHoc: string;
  HinhAnh: string;
  Video: string;
  NgayDang: string;
  LuotXem: number;
  GiamGia: number;
  GiaTien: string;
  LoaiKhoaHoc: string;
  IDDanhMuc: string; 
  XepLoai: string;
}

const KhoaHocComponent: React.FC = () => {
  const [selectedType, setSelectedLocation] = useState<string>("");
  const [priceRange, setPriceRange] = useState<number[]>([0, 100]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>(""); 
  const navigate = useNavigate();

  const fetchKhoaHocAPI = async () => {
    const { data } = await axios.get(`${BASE_URL}/khoa-hoc`);
    return data.content;
  };

  const { data: KhoaHocList = [], isLoading, isError } = useQuery<KhoaHocData[]>({
    queryKey: ["KhoaHoc"],
    queryFn: fetchKhoaHocAPI,
  });

  const handleTagChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLocation(event.target.value);
  };

  const handlePriceRangeChange = (range: number[]) => {
    setPriceRange(range);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value); 
  };

  const handleViewDetails = (id: number) => {
    navigate(`/khoa-hoc/xem-chi-tiet/${id}`);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <div>Error loading courses.</div>;
  }

  // Lọc danh sách khóa học theo tên, loại khóa học, và danh mục đã chọn
  const filteredKhoaHocList = KhoaHocList.filter((KhoaHoc) => {
    return (
      KhoaHoc.TenKhoaHoc.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedType === "" || KhoaHoc.LoaiKhoaHoc === selectedType) &&
      (selectedCategory === "" || KhoaHoc.IDDanhMuc.toString() === selectedCategory) 
    );
  });

  return (
    <section className="ftco-section bg-light">
      <div className="container">
        <div className="row">
          <div className="col-lg-3 sidebar">
            <div className="sidebar-wrap bg-light ftco-animate">
              <form action="#">
                <div className="fields">
                  <h3 className="heading mb-4">Tìm kiếm nâng cao</h3>

                  <span>Tìm kiếm theo tên</span>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  </div>
                  <span>Loại khóa học</span> 
                  <div className="form-group">
                    <div className="select-wrap one-third">
                      <select
                        className="form-control"
                        value={selectedType}
                        onChange={handleTagChange}
                      >
                        <option value="">Tất cả loại khóa học</option>
                        <option value="mien_phi">Miễn phí</option>
                        <option value="tra_phi">Trả phí</option>       
                      </select>
                    </div>
                  </div>
                  <span>Danh mục khóa học</span>
                  {/* Thêm ô chọn danh mục */}
                  <div className="form-group">
                    <div className="select-wrap one-third">
                      <select
                        className="form-control"
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                      >
                        <option value="">Tất cả danh mục</option>
                        <option value="1">Lập trình Java</option>
                        <option value="2">Lập trình Python</option>
                        <option value="3">Phát triển Web</option>
                        <option value="4">Lập trình C#</option>
                        <option value="5">Khoa học Dữ liệu</option>
                        <option value="6">Trí tuệ Nhân tạo</option>                    
                        <option value="7">Phát triển Ứng dụng Di động</option>
                        <option value="8">An ninh Mạng</option>
                        <option value="9">Phân tích Dữ liệu</option>
                        <option value="10">Máy học</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <span>Tầm giá</span>
                    <RangeSliderComponent onChange={handlePriceRangeChange} />
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="col-lg-9">
            <div className="khoa-hoc-list">
              <div className="row">
                {filteredKhoaHocList.map((KhoaHoc) => (
                  <div className="col-md-4" key={KhoaHoc.IDKhoaHoc}>
                    <div className="khoa-hoc-item">
                      <img
                        src={KhoaHoc.HinhAnh}
                        alt={KhoaHoc.TenKhoaHoc}
                        style={{ width: "100%", height: "auto", maxHeight: "200px" }}
                      />
                      <h3>{KhoaHoc.TenKhoaHoc}</h3>
                      <p>{KhoaHoc.MoTaKhoaHoc}</p>
                      <p>
                        <strong>Price:</strong> {KhoaHoc.GiaTien}
                      </p>
                      <p>
                        <strong>Posted On:</strong> {KhoaHoc.NgayDang}
                      </p>
                      <p>
                        <strong>Views:</strong> {KhoaHoc.LuotXem}
                      </p>
                      <p>
                        <strong>Discount:</strong> {KhoaHoc.GiamGia}%
                      </p>
                      <p>
                        <strong>Type:</strong> {KhoaHoc.LoaiKhoaHoc}
                      </p>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleViewDetails(KhoaHoc.IDKhoaHoc)}
                      >
                        View Details
                      </button>
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
