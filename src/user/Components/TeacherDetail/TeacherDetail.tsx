import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../util/fetchfromAPI";
import Loading from "../Antd/Loading";

interface KhoaHocData {
    IDKhoaHoc: number;
    TenKhoaHoc: string;
    MoTaKhoaHoc: string;
    HinhAnh: string;
}

interface GiangVienData {
    IDNguoiDung: number;
    TenDangNhap: string;
    HoTen: string;
    Email: string;
    SDT: string;
    GioiTinh: string;
    AnhDaiDien: string;
}

const TeacherDetailComponent: React.FC = () => {
    const { IDNguoiDung } = useParams<{ IDNguoiDung: string }>();
    const [courses, setCourses] = useState<KhoaHocData[]>([]);
    const [teacher, setTeacher] = useState<GiangVienData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTeacherAndCourses = async () => {
            try {
                // Lấy thông tin giảng viên
                const teacherResponse = await axios.get(`${BASE_URL}/giangvien/${IDNguoiDung}`);
                setTeacher(teacherResponse.data.content);

                // Lấy danh sách khóa học của giảng viên
                const coursesResponse = await axios.get(`${BASE_URL}/giangvien`);
                setCourses(coursesResponse.data.content);
            } catch (error) {
                console.error("Error fetching teacher or courses:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTeacherAndCourses();
    }, [IDNguoiDung]);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div>
            {teacher && (
                <div className="teacher-info">
                    <img src={teacher.AnhDaiDien} alt={teacher.HoTen} style={{ width: "150px", borderRadius: "50%" }} />
                    <h2>{teacher.HoTen}</h2>
                    <p>Email: {teacher.Email}</p>
                    <p>Số điện thoại: {teacher.SDT}</p>
                    <p>Giới tính: {teacher.GioiTinh}</p>
                </div>
            )}
            
            <h2>Danh sách khóa học của giảng viên</h2>
            <div className="courses">
                {courses.length > 0 ? (
                    courses.map(course => (
                        <div key={course.IDKhoaHoc} className="course-item">
                            <img src={course.HinhAnh} alt={course.TenKhoaHoc} style={{ width: "100px", height: "auto" }} />
                            <h3>{course.TenKhoaHoc}</h3>
                            <p>{course.MoTaKhoaHoc}</p>
                        </div>
                    ))
                ) : (
                    <p>Giảng viên này chưa có khóa học nào.</p>
                )}
            </div>
        </div>
    );
};

export default TeacherDetailComponent;
