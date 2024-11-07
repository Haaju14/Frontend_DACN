import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { message } from "antd";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { BASE_URL } from "../../util/fetchfromAPI";
import Loading from "../Components/Antd/Loading";

interface KhoaHocData {
    IDKhoaHoc: number;
    TenKhoaHoc: string;
    MoTaKhoaHoc: string;
    HinhAnh: string;
    NgayDang: string;
    LuotXem: number;
    GiamGia: number;
    GiaTien: string;
    LoaiKhoaHoc: string;
}

const KhoaHocCombinedComponent: React.FC = () => {
    const [favoriteCourses, setFavoriteCourses] = useState<number[]>([]);
    const [registeredCourses, setRegisteredCourses] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>(""); // Từ khóa tìm kiếm
    const [selectedType, setSelectedType] = useState<string>(""); // Loại khóa học
    const navigate = useNavigate();

    // Lấy danh sách khóa học
    const fetchKhoaHocAPI = async () => {
        const { data } = await axios.get(`${BASE_URL}/khoa-hoc`);
        return data.content;
    };

    // Lấy danh sách khóa học đã đăng ký
    const fetchRegisteredCoursesAPI = async () => {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`${BASE_URL}/khoa-hoc-dang-ky`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return data.content.map((item: { IDKhoaHoc: number }) => item.IDKhoaHoc);
    };

    // Lấy danh sách khóa học yêu thích
    const fetchFavoriteCoursesAPI = async () => {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`${BASE_URL}/favorites`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return data.content.map((item: { IDKhoaHoc: number }) => item.IDKhoaHoc);
    };

    const { data: KhoaHocList = [], isLoading, isError } = useQuery<KhoaHocData[]>({
        queryKey: ["KhoaHoc"],
        queryFn: fetchKhoaHocAPI,
    });

    const { data: favoriteCoursesData = [], isLoading: isLoadingFavorites } = useQuery<number[]>({
        queryKey: ["favoriteCourses"],
        queryFn: fetchFavoriteCoursesAPI,
    });

    const { data: registeredCoursesData = [], isLoading: isLoadingRegistered } = useQuery<number[]>({
        queryKey: ["registeredCourses"],
        queryFn: fetchRegisteredCoursesAPI,
    });

    useEffect(() => {
        if (!isLoadingFavorites && favoriteCoursesData.length > 0) {
            setFavoriteCourses(favoriteCoursesData);
        }
    }, [isLoadingFavorites, favoriteCoursesData]);

    useEffect(() => {
        if (!isLoadingRegistered && registeredCoursesData.length > 0) {
            setRegisteredCourses(registeredCoursesData);
        }
    }, [isLoadingRegistered, registeredCoursesData]);

    // Điều hướng đến chi tiết khóa học
    const handleViewDetails = (id: number) => {
        navigate(`/khoa-hoc/xem-chi-tiet/${id}`);
    };

    // Toggle yêu thích
    const toggleFavoritesCourseAPI = async (id: number) => {
        if (favoriteCourses.includes(id)) {
            try {
                const token = localStorage.getItem("token");
                await axios.delete(`${BASE_URL}/favorites/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFavoriteCourses((prev) => prev.filter(courseId => courseId !== id));
                message.success("Đã xóa khóa học khỏi danh sách yêu thích.");
            } catch (error) {
                console.error("Error removing favorite course:", error);
                message.error("Có lỗi xảy ra khi xóa khỏi yêu thích.");
            }
        } else {
            try {
                const token = localStorage.getItem("token");
                await axios.post(
                    `${BASE_URL}/favorite/add/${id}`,
                    { IDNguoiDung: 1, IDKhoaHoc: id },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setFavoriteCourses((prev) => [...prev, id]);
                message.success("Đã thêm khóa học vào yêu thích.");
            } catch (error) {
                console.error("Error adding favorite course:", error);
                message.error("Có lỗi xảy ra khi thêm vào yêu thích.");
            }
        }
    };

    // Lọc khóa học theo từ khóa tìm kiếm và loại khóa học
    const filteredCourses = KhoaHocList.filter((KhoaHoc) => {
        const isInFavoriteOrRegistered =
            favoriteCourses.includes(KhoaHoc.IDKhoaHoc) || registeredCourses.includes(KhoaHoc.IDKhoaHoc);

        const matchesSearchTerm =
            KhoaHoc.TenKhoaHoc.toLowerCase().includes(searchTerm.toLowerCase()) ||
            KhoaHoc.MoTaKhoaHoc.toLowerCase().includes(searchTerm.toLowerCase()); // Tìm kiếm trong tên và mô tả

        const matchesType =
            selectedType === "Like" ? favoriteCourses.includes(KhoaHoc.IDKhoaHoc) : 
            selectedType === "Registed" ? registeredCourses.includes(KhoaHoc.IDKhoaHoc) : true;

        return isInFavoriteOrRegistered && matchesSearchTerm && matchesType;
    });

    if (isLoading || isLoadingFavorites || isLoadingRegistered) {
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
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Tìm kiếm khóa học theo tên"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <span>Danh sách khóa học</span>
                                    <div className="form-group">
                                        <div className="select-wrap one-third">
                                            <select
                                                className="form-control"
                                                value={selectedType}
                                                onChange={(e) => setSelectedType(e.target.value)}
                                            >
                                                <option value="">Tất cả khóa học</option>
                                                <option value="Like">Khóa học đã yêu thích</option>
                                                <option value="Registed">Khóa học đã đăng ký</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="col-md-8">
                        <div className="khoa-hoc-list">
                            <div className="row">
                                {filteredCourses.length > 0 ? (
                                    filteredCourses.map((KhoaHoc) => (
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
                                                    <strong>Giá:</strong> {KhoaHoc.GiaTien} VND
                                                </p>
                                                <p>
                                                    <strong>Ngày đăng:</strong> {KhoaHoc.NgayDang}
                                                </p>
                                                <p>
                                                    <strong>Lượt xem:</strong> {KhoaHoc.LuotXem}
                                                </p>
                                                <p>
                                                    <strong>Giảm giá:</strong> {KhoaHoc.GiamGia}%
                                                </p>
                                                <p>
                                                    <strong>Loại:</strong> {KhoaHoc.LoaiKhoaHoc}
                                                </p>
                                                <div className="button-group" style={{ display: "flex", justifyContent: "space-between" }}>
                                                    <button
                                                        className="btn btn-primary"
                                                        onClick={() => handleViewDetails(KhoaHoc.IDKhoaHoc)}
                                                        style={{ marginRight: "75px" }}
                                                    >
                                                        Xem chi tiết
                                                    </button>
                                                    <span
                                                        onClick={() => toggleFavoritesCourseAPI(KhoaHoc.IDKhoaHoc)}
                                                        style={{ cursor: "pointer", fontSize: "24px" }}
                                                    >
                                                        {favoriteCourses.includes(KhoaHoc.IDKhoaHoc) ? (
                                                            <HeartFilled style={{ color: "red" }} />
                                                        ) : (
                                                            <HeartOutlined />
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>Bạn chưa có khóa học yêu thích hoặc đã đăng ký nào.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default KhoaHocCombinedComponent;
