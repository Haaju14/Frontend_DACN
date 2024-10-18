import { useParams } from "react-router-dom";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import Loading from "../Antd/Loading";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { getCourseDetailAPI } from "../../../util/fetchfromAPI";

interface KhoaHocData {
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

const Detail: React.FC = () => {
  // Sử dụng useParams để lấy ID từ URL
  const { id } = useParams();
  const { userLogin } = useSelector((state: RootState) => state.userReducer);

  // Lấy token từ localStorage
  const token = localStorage.getItem("token");

  // Kiểm tra nếu không có token, bạn có thể điều hướng người dùng đến trang đăng nhập
  if (!token) {
    // Điều hướng đến trang đăng nhập (có thể sử dụng useNavigate từ react-router-dom)
    return <div>Please log in to view course details.</div>;
  }

  // Gọi API để lấy dữ liệu chi tiết khóa học dựa vào ID
  const queryResultKhoaHocByID: UseQueryResult<KhoaHocData> = useQuery({
    queryKey: ["courseByIDApi", id || ""],
    queryFn: () => getCourseDetailAPI(id || "", token), // Gọi API với token
    staleTime: 5 * 60 * 1000, // Dữ liệu sẽ được làm mới sau 5 phút
    refetchOnWindowFocus: true, // Tự động refetch khi cửa sổ được focus
  });

  // Xử lý khi dữ liệu đang load
  if (queryResultKhoaHocByID.isLoading) {
    return <Loading />; // Hiển thị loading trong khi đang fetch data
  }

  // Xử lý khi có lỗi trong quá trình lấy dữ liệu
  if (queryResultKhoaHocByID.isError) {
    return <div>Error: {(queryResultKhoaHocByID.error as Error).message}</div>;
  }

  // Trích xuất dữ liệu chi tiết khóa học
  const KhoaHocData = queryResultKhoaHocByID.data;

  // Xử lý trường hợp không có dữ liệu
  if (!KhoaHocData) {
    return <div>No course details available.</div>;
  }

  return (
    <section className="ftco-section">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <div className="row">
              <div className="col-md-12 ftco-animate">
                {/* Hiển thị tiêu đề khóa học */}
                <h2 className="mb-4">{KhoaHocData.TenKhoaHoc}</h2>
                <div className="single-slider owl-carousel">
                  <div className="item">
                    {/* Hiển thị hình ảnh khóa học */}
                    <div
                      className="course-img"
                      style={{
                        backgroundImage: `url(${KhoaHocData.HinhAnh})`,
                        height: '400px',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-12 course-single mt-4 ftco-animate">
                {/* Hiển thị mô tả khóa học */}
                <p>{KhoaHocData.MoTaKhoaHoc}</p>
                <div className="d-md-flex mt-5 mb-5">
                  <ul className="list">
                    <li>
                      <span>Participants:</span> {KhoaHocData.SoLuongHocVien}
                    </li>
                    <li>
                      <span>Posted On:</span> {new Date(KhoaHocData.NgayDang).toLocaleDateString()}
                    </li>
                    <li>
                      <span>Price:</span> {KhoaHocData.GiaTien} VND
                    </li>
                    <li>
                      <span>Discount:</span> {KhoaHocData.GiamGia}%
                    </li>
                    <li>
                      <span>Views:</span> {KhoaHocData.LuotXem}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {/* Bên cạnh, bạn có thể hiển thị thêm nội dung khác hoặc chức năng */}
        </div>
      </div>
    </section>
  );
};

export default Detail;
