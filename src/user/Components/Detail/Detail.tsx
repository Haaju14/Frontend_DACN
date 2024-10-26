import axios from 'axios';
import { message } from 'antd'; // Dùng để hiển thị thông báo
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { BASE_URL } from '../../../util/fetchfromAPI'; // Loại bỏ khai báo trùng lặp
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

const Detail: React.FC = () => {
  const { id: IDKhoaHoc } = useParams(); // Lấy IDKhoaHoc từ URL param
  const { userLogin } = useSelector((state: RootState) => state.userReducer); // Lấy thông tin đăng nhập từ redux

  // Lấy token từ localStorage
  const token = localStorage.getItem("token");

  // Kiểm tra nếu không có token
  if (!token) {
    return <div>Please log in to view course details.</div>;
  }

  // Kiểm tra token và ID khóa học
  console.log('Token:', token);
  console.log('IDKhoaHoc:', IDKhoaHoc);

  // Hàm API để lấy thông tin chi tiết khóa học
  const getCourseDetailAPI = async (IDKhoaHoc: string, token: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/khoa-hoc/xem-chi-tiet/${IDKhoaHoc}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Dữ liệu khóa học trả về:', response.data); // Log dữ liệu trả về
      return response.data; // Trả về dữ liệu chi tiết khóa học
    } catch (error: any) {
      console.error('Lỗi khi gọi API chi tiết khóa học:', error.response || error.message);
      throw new Error(error.response ? error.response.data.message : error.message);
    }
  };

  // Gọi API để lấy dữ liệu chi tiết khóa học dựa vào IDKhoaHoc
  const queryResultKhoaHocByID: UseQueryResult<KhoaHocData> = useQuery({
    queryKey: ["courseByIDApi", IDKhoaHoc || ""],
    queryFn: () => getCourseDetailAPI(IDKhoaHoc || "", token), // Gọi API để lấy thông tin khóa học
    staleTime: 5 * 60 * 1000, // 5 phút
    refetchOnWindowFocus: true,
  });

  // Kiểm tra nếu đang loading
  if (queryResultKhoaHocByID.isLoading) {
    return <Loading />;
  }

  // Kiểm tra nếu có lỗi
  if (queryResultKhoaHocByID.isError) {
    console.error('Lỗi:', queryResultKhoaHocByID.error);
    return <div>Error: {(queryResultKhoaHocByID.error as Error).message}</div>;
  }

  // Trích xuất dữ liệu khóa học
  const KhoaHocData = queryResultKhoaHocByID.data;

  // Log lại dữ liệu để kiểm tra
  console.log('KhoaHocData:', KhoaHocData);

  // Kiểm tra nếu không có dữ liệu
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
                <div className="single-slider">
                  <img
                    src={KhoaHocData.HinhAnh}
                    alt={KhoaHocData.TenKhoaHoc}
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
              </div>
              <div className="col-md-12 course-single mt-4 ftco-animate">
                <div className="d-md-flex mt-5 mb-5">
                  <ul className="list">
                    {[
                      { label: "ID Khóa Học", value: KhoaHocData.IDKhoaHoc },
                      { label: "Mô tả khóa học", value: KhoaHocData.MoTaKhoaHoc },
                      { label: "Loại Khóa Học", value: KhoaHocData.LoaiKhoaHoc },
                      { label: "Số lượng học viên", value: KhoaHocData.SoLuongHocVien },
                      { label: "Ngày đăng", value: KhoaHocData.NgayDang },
                      { label: "Giá tiền", value: `${KhoaHocData.GiaTien} VND` },
                      { label: "Giảm giá", value: `${KhoaHocData.GiamGia !== undefined ? KhoaHocData.GiamGia : "Không có giảm giá"} %` },
                      { label: "Lượt xem", value: KhoaHocData.LuotXem },
                    ].map((courseInfo, index) => (
                      <li key={index}>
                        <span>{courseInfo.label}:</span> {courseInfo.value !== undefined ? courseInfo.value.toString() : "Chưa có thông tin"}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Nút đăng ký khóa học */}
                <button className="btn btn-success" onClick={handleRegisterCourse}>
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
