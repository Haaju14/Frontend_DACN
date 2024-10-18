import axios from 'axios';
import { message } from 'antd'; // Dùng để hiển thị thông báo
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { BASE_URL, getCourseDetailAPI } from '../../../util/fetchfromAPI';
import Loading from '../Antd/Loading';

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
  const { id: IDKhoaHoc } = useParams(); // Lấy IDKhoaHoc từ URL param
  const { userLogin } = useSelector((state: RootState) => state.userReducer); // Lấy thông tin đăng nhập từ redux

  // Lấy token từ localStorage
  const token = localStorage.getItem("token");

  // Kiểm tra nếu không có token
  if (!token) {
    return <div>Please log in to view course details.</div>;
  }

  // Gọi API để lấy dữ liệu chi tiết khóa học dựa vào IDKhoaHoc
  const queryResultKhoaHocByID: UseQueryResult<KhoaHocData> = useQuery({
    queryKey: ["courseByIDApi", IDKhoaHoc || ""],
    queryFn: () => getCourseDetailAPI(IDKhoaHoc || "", token), // Gọi API để lấy thông tin khóa học
    staleTime: 5 * 60 * 1000, // 5 phút
    refetchOnWindowFocus: true,
  });

  // Xử lý khi dữ liệu đang load
  if (queryResultKhoaHocByID.isLoading) {
    return <Loading />;
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

  // Hàm xử lý đăng ký khóa học
  const handleRegisterCourse = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/khoa-hoc-dang-ky/${IDKhoaHoc}`, // Lấy IDKhoaHoc từ useParams
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Truyền token để xác thực
          },
        }
      );
      message.success('Đăng ký khóa học thành công!');
    } catch (error: any) {
      if (error.response) {
        console.error('Error details:', error.response); // Log lỗi chi tiết để kiểm tra
      }

      if (error.response && error.response.status === 404) {
        message.error('Không tìm thấy endpoint hoặc khóa học.');
      } else if (error.response && error.response.status === 400) {
        message.error('Bạn đã đăng ký khóa học này trước đó.');
      } else {
        message.error('Đã xảy ra lỗi trong quá trình đăng ký khóa học.');
      }
    }
  };

  return (
    <section className="ftco-section">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <div className="row">
              <div className="col-md-12 ftco-animate">
                <h2 className="mb-4">{KhoaHocData.TenKhoaHoc}</h2>
                <div className="single-slider owl-carousel">
                  <div className="item">
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
                {/* Nút đăng ký khóa học */}
                <button
                  className="btn btn-success"
                  onClick={handleRegisterCourse}
                >
                  Đăng ký khóa học
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Detail;
