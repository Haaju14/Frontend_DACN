import React, { useEffect, useState } from "react";
import { Spin, Card, message } from "antd";
import { UserOutlined, MailOutlined, ManOutlined, WomanOutlined } from "@ant-design/icons";
import axios from "axios";
import { BASE_URL } from "../../util/fetchfromAPI";
import "../../../public/admin/css/ManageUser.css";
const ManageStudents: React.FC = () => {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const getToken = () => localStorage.getItem("token");

    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true);
            try {
                const token = getToken();
                const response = await axios.get(`${BASE_URL}/hocvien`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setStudents(response.data.content);
            } catch (error) {
                console.error("Error fetching students:", error);
                message.error("Có lỗi xảy ra khi tải danh sách học viên.");
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    if (loading) {
        return <Spin tip="Đang tải danh sách học viên..." />;
    }

    return (
        <div className="manage-students-container">
            <h1>Danh sách học viên</h1>
            <div className="student-grid">
                {students.length === 0 ? (
                    <p>Không có học viên nào.</p>
                ) : (
                    students.map((student) => (
                        <Card key={student.IDNguoiDung} className="student-card">
                            <div className="student-info">
                                <UserOutlined className="icon" />
                                <span className="info-label">Tên:</span> {student.HoTen}
                            </div>
                            <div className="student-info">
                                <MailOutlined className="icon" />
                                <span className="info-label">Email:</span> {student.Email}
                            </div>
                            <div className="student-info">
                                {student.GioiTinh === "Nam" ? (
                                    <ManOutlined className="icon" />
                                ) : (
                                    <WomanOutlined className="icon" />
                                )}
                                <span className="info-label">Giới tính:</span> {student.GioiTinh || "Chưa xác định"}                                
                            </div>
                            <div>
                            <span className="info-label">Role:</span> {student.Role}
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default ManageStudents;
