import axios from 'axios';
import { message } from 'antd';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { BASE_URL } from '../../../util/fetchfromAPI';
import Loading from '../Antd/Loading';

interface KhoaHocData {
  IDKhoaHoc: number;
  IDDanhMuc: number;
  TenKhoaHoc: string;
  MoTaKhoaHoc: string;
  HinhAnh: string;
  NgayDang: string;
  LuotXem: number;
  SoLuongHocVien: number;
  GiamGia: number;
  LoaiKhoaHoc: string;
  GiaTien: string;
}

interface BinhLuanData {
  IDBinhLuan: number;
  IDKhoaHoc: number;
  NoiDung: string;
  IDNguoiDung: string; 
  ThoiGian: string; 
}

const Detail: React.FC = () => {
  const { id: IDKhoaHoc } = useParams();
    const { userLogin } = useSelector((state: RootState) => state.userReducer);
    const token = localStorage.getItem("token");

    if (!token) {
        return <div>Please log in to view course details.</div>;
    }

  const getCourseDetailAPI = async (IDKhoaHoc: string, token: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/khoa-hoc/xem-chi-tiet/${IDKhoaHoc}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error: any) {
        console.error('Error:', error);
        throw new Error(error.response ? error.response.data.message : error.message);
    }
};

const getCommentsAPI = async (IDKhoaHoc: string, token: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/binh-luan/get/${IDKhoaHoc}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        // Trả về dữ liệu bình luận hoặc một mảng trống nếu không có bình luận
        return response.data || [];
    } catch (error: any) {
        console.error('Error fetching comments:', error);
        throw new Error(error.response ? error.response.data.message : error.message);
    }
};

    const queryResultKhoaHocByID: UseQueryResult<KhoaHocData> = useQuery({
      queryKey: ["courseByIDApi", IDKhoaHoc || ""],
      queryFn: () => getCourseDetailAPI(IDKhoaHoc || "", token),
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true,
    });

    const queryResultBinhLuan: UseQueryResult<BinhLuanData[]> = useQuery({
      queryKey: ["comments", IDKhoaHoc || ""],
      queryFn: () => getCommentsAPI(IDKhoaHoc || "", token),
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true,
    });

    if (queryResultKhoaHocByID.isLoading || queryResultBinhLuan.isLoading) {
      return <Loading />;
    }

    if (queryResultKhoaHocByID.isError) {
      return <div>Error: {(queryResultKhoaHocByID.error as Error).message}</div>;
    }

    if (queryResultBinhLuan.isError) {
      return <div>Error loading comments: {(queryResultBinhLuan.error as Error).message}</div>;
    }

    const KhoaHocData = queryResultKhoaHocByID.data;
    const comments = queryResultBinhLuan.data || [];

    // Log course data and comments
    console.log("Course Data:", KhoaHocData);
    console.log("Comments:", comments);

    if (!KhoaHocData) {
      return <div>No course details available.</div>;
    }

    const handleRegisterCourse = async () => {
      try {
          await axios.post(`${BASE_URL}/khoa-hoc-dang-ky/${IDKhoaHoc}`, {}, {
              headers: { Authorization: `Bearer ${token}` },
          });
          message.success('Đăng ký khóa học thành công!');
      } catch (error: any) {
          console.error('Error details:', error.response);
          message.error('Đã xảy ra lỗi trong quá trình đăng ký khóa học.');
      }
    };

return (
  <section className="ftco-section">
      <div className="container">
          <div className="row">
              <div className="col-lg-8">
                  <div className="course-detail">
                      <h2 className="mb-4">{KhoaHocData.TenKhoaHoc || "Tên khóa học không có"}</h2>
                      <div className="single-slider mb-4">
                          <img
                              src={KhoaHocData.HinhAnh || ""}
                              alt={KhoaHocData.TenKhoaHoc || "Khóa học không có tên"}
                              style={{ width: "100%", height: "auto", borderRadius: "8px" }}
                          />
                      </div>
                      <div className="course-info mt-4">
                          <ul className="list-unstyled">
                              {[ 
                                  { label: "ID Khóa Học", value: KhoaHocData.IDKhoaHoc },
                                  { label: "Mô tả khóa học", value: KhoaHocData.MoTaKhoaHoc || "Chưa có mô tả" },
                                  { label: "Loại Khóa Học", value: KhoaHocData.LoaiKhoaHoc || "Chưa có loại" },
                                  { label: "Số lượng học viên", value: KhoaHocData.SoLuongHocVien || "Chưa có thông tin" },
                                  { label: "Ngày đăng", value: KhoaHocData.NgayDang || "Chưa có thông tin" },
                                  { label: "Giá tiền", value: `${KhoaHocData.GiaTien || "Chưa có giá"} VND` },
                                  { label: "Giảm giá", value: `${KhoaHocData.GiamGia !== undefined ? KhoaHocData.GiamGia : "Không có giảm giá"} %` },
                                  { label: "Lượt xem", value: KhoaHocData.LuotXem || "Chưa có thông tin" },
                              ].map((courseInfo, index) => (
                                  <li key={index} className="mb-2">
                                      <span>{courseInfo.label}:</span> {courseInfo.value !== undefined ? courseInfo.value.toString() : "Chưa có thông tin"}
                                  </li>
                              ))} 
                          </ul>
                          <button className="btn btn-success mt-3" onClick={handleRegisterCourse}>
                              Đăng ký khóa học
                          </button>
                      </div>
                  </div>

                  {/* Phần bình luận */}
                  <div className="comments-section mt-5">
                      <h3>Bình luận</h3>
                      {comments.length > 0 ? (
                          <ul className="list-unstyled">
                              {comments.map((comment) => (
                                  <li key={comment.IDBinhLuan} className="comment-item mb-3 border p-3 rounded">
                                      <p><strong>{comment.IDNguoiDung}:</strong> {comment.NoiDung}</p>
                                      <span className="text-muted">{comment.ThoiGian}</span>
                                  </li>
                              ))}
                          </ul>
                      ) : (
                          <p>Chưa có bình luận nào cho khóa học này.</p>
                      )}
                  </div>
              </div>
          </div>
      </div>
  </section>
);
};

export default Detail;