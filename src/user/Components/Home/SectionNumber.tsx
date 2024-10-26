import { useQuery, UseQueryResult } from "@tanstack/react-query";
import Loading from "../Antd/Loading";
import { KhoaHocAPI, UserAPI } from "../../../util/fetchfromAPI";

interface User {
  IDNguoiDung: number;
  TenDangNhap: string;
  Email: string;
  MatKhau: string;
  HoTen: string;
  GioiTinh: boolean;
  SDT: string;
  Role: string;
  AnhDaiDien?: string;
}

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

const SectionNumber: React.FC = () => {
  const queryResultUser: UseQueryResult<User[]> = useQuery({
    queryKey: ["userListApi"],
    queryFn: async () => {
      // Gọi hàm đúng từ UserAPI để lấy danh sách người dùng
      return await UserAPI.getUserList();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });

  const queryResultCourse: UseQueryResult<KhoaHocData[]> = useQuery({
    queryKey: ["CourseListApi"],
    queryFn: async () => {
      // Gọi hàm đúng từ KhoaHocAPI để lấy danh sách khóa học
      return await KhoaHocAPI.getCourseList();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });

  if (queryResultUser.isLoading || queryResultCourse.isLoading) {
    return <Loading />;
  }

  if (queryResultUser.error) {
    return <div>Error loading users: {(queryResultUser.error as Error).message}</div>;
  }

  if (queryResultCourse.error) {
    return <div>Error loading courses: {(queryResultCourse.error as Error).message}</div>;
  }

  // Get counts from fetched data
  const countUser =
    queryResultUser.data?.filter((a) => a.Role === "hocvien").length || 0;
  const countAdmin =
    queryResultUser.data?.filter((a) => a.Role === "admin").length || 0;
  const countCourse = queryResultCourse.data?.length || 0;

  return (
    <section
      className="ftco-section ftco-counter img"
      id="section-counter"
      style={{ backgroundImage: "url(user/images/bg_1.jpg)" }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="row">
              <div className="col-md-4 d-flex justify-content-center counter-wrap ftco-animate">
                <div className="block-18 text-center">
                  <div className="text">
                    <strong className="number counter" data-number={countUser}>
                      {countUser}
                    </strong>
                    <span>Students</span>
                  </div>
                </div>
              </div>
              <div className="col-md-4 d-flex justify-content-center counter-wrap ftco-animate">
                <div className="block-18 text-center">
                  <div className="text">
                    <strong className="number counter" data-number={countCourse}>
                      {countCourse}
                    </strong>
                    <span>Courses</span>
                  </div>
                </div>
              </div>
              <div className="col-md-4 d-flex justify-content-center counter-wrap ftco-animate">
                <div className="block-18 text-center">
                  <div className="text">
                    <strong className="number counter" data-number={countAdmin}>
                      {countAdmin}
                    </strong>
                    <span>Teachers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionNumber;
