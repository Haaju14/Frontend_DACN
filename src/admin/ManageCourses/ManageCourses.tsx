import React, { useState, useEffect } from "react";
import axios from "axios";
import { message, Modal, Form, Input, Button, Select } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { BASE_URL } from "../../util/fetchfromAPI";
import '../../../public/admin/css/ManageCourse.css';

const { Option } = Select;

const ManageCourses: React.FC = () => {
    const [courses, setCourses] = useState<any[]>([]);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [editCourse, setEditCourse] = useState<any>(null);
    const [form] = Form.useForm();

    
    const [categories, setCategories] = useState<any[]>([]); 
    const [discounts, setDiscounts] = useState<any[]>([]); 

    useEffect(() => {
        fetchCourses();
        fetchCategories();
        fetchDiscounts();
    }, []);

    const fetchCourses = async () => {
        try {
            const { data } = await axios.get(`${BASE_URL}/khoa-hoc`);
            setCourses(data.content);
        } catch (error) {
            console.error("Error fetching courses:", error);
            message.error("Có lỗi xảy ra khi tải danh sách khóa học.");
        }
    };

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get(`${BASE_URL}/danhmuc/all`);
            setCategories(data.content);
        } catch (error) {
            console.error("Error fetching categories:", error);
            message.error("Có lỗi xảy ra khi tải danh sách danh mục.");
        }
    };

    const fetchDiscounts = async () => {      
        try {           
            const { data } = await axios.get(`${BASE_URL}/khuyenmai/all`);
            setDiscounts(data.content);
        } catch (error) {
            console.error("Error fetching discounts:", error);
            message.error("Có lỗi xảy ra khi tải danh sách khuyến mãi.");
        }
    };

    const handleAddCourse = () => {
        setEditCourse(null);
        setIsModalVisible(true);
        form.resetFields();
    };

    const handleEditCourse = (course: any) => {
        setEditCourse(course);
        setIsModalVisible(true);
        form.setFieldsValue(course);
    };

    const handleDeleteCourse = async (id: number) => {
        try {
            await axios.delete(`${BASE_URL}/khoa-hoc/delete/${id}`);
            message.success("Xóa khóa học thành công.");
            fetchCourses(); 
        } catch (error) {
            console.error("Error deleting course:", error);
            message.error("Có lỗi xảy ra khi xóa khóa học.");
        }
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();

            // Thêm thông tin ngày gửi kiểm duyệt
            const currentDate = new Date().toISOString(); 

            const courseData = {
                ...values,
                NgayGuiKiemDuyet: currentDate, 
                TrangThai: 'chua_duyet', 
                IDNguoiDung: 1, 
                LuotXem: 0, 
                SoLuongHocVien: 0, 
            };

            // Kiểm tra token từ localStorage
            const token = localStorage.getItem("token");

            if (!token) {
                message.error("Vui lòng đăng nhập để thực hiện thao tác này.");
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,  
                },
            };

            if (editCourse) {
                // Cập nhật khóa học
                await axios.put(`${BASE_URL}/khoa-hoc/put/${editCourse.IDKhoaHoc}`, courseData, config);
                message.success("Cập nhật khóa học thành công.");
            } else {
                // Thêm mới khóa học
                await axios.post(`${BASE_URL}/khoa-hoc/add`, courseData, config);
                message.success("Thêm khóa học thành công.");
            }

            fetchCourses(); // Reload courses after add/edit
            setIsModalVisible(false);
        } catch (error) {
            message.error("Có lỗi xảy ra khi lưu khóa học.");
        }
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div className="manage-courses-container">
            <h1>Quản lý khóa học</h1>
            <Button type="primary" onClick={handleAddCourse}>Thêm khóa học</Button>
            <div style={{ marginTop: "20px" }}>
                {courses.map((course) => (
                    <div key={course.IDKhoaHoc} className="course-card">
                        <div>
                            <div className="course-id">ID: {course.IDKhoaHoc}</div>
                            <div className="course-name">{course.TenKhoaHoc}</div>
                        </div>
                        <div className="course-actions">
                            <Button
                                className="edit-button"
                                icon={<EditOutlined />}
                                onClick={() => handleEditCourse(course)}
                            />
                            <Button
                                className="delete-button"
                                icon={<DeleteOutlined />}
                                onClick={() => handleDeleteCourse(course.IDKhoaHoc)}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Thêm/Sửa khóa học */}
            <Modal
                title={editCourse ? "Sửa khóa học" : "Thêm khóa học"}
                visible={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText={editCourse ? "Cập nhật" : "Thêm"}
            >
                <Form
                    form={form}
                    initialValues={editCourse}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    layout="horizontal"
                >
                    <Form.Item
                        label="Tên khóa học"
                        name="TenKhoaHoc"
                        rules={[{ required: true, message: "Vui lòng nhập tên khóa học!" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Mô tả khóa học"
                        name="MoTaKhoaHoc"
                        rules={[{ required: true, message: "Vui lòng nhập mô tả khóa học!" }]}
                    >
                        <Input.TextArea />
                    </Form.Item>

                    <Form.Item
                        label="Giá"
                        name="GiaTien"
                        rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Giảm giá"
                        name="GiamGia"
                        rules={[{ required: true, message: "Vui lòng nhập mức giảm giá!" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Loại khóa học"
                        name="LoaiKhoaHoc"
                        rules={[{ required: true, message: "Vui lòng chọn loại khóa học!" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Danh mục"
                        name="IDDanhMuc"
                        rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
                    >
                        <Select>
                            {categories.map(category => (
                                <Option key={category.IDDanhMuc} value={category.IDDanhMuc}>
                                    {category.TenDanhMuc}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Khuyến mãi"
                        name="IDKhuyenMai"
                        rules={[{ required: true, message: "Vui lòng chọn khuyến mãi!" }]}
                    >
                        <Select>
                            {discounts.map(discount => (
                                <Option key={discount.IDKhuyenMai} value={discount.IDKhuyenMai}>
                                    {discount.TenKhuyenMai}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Hình ảnh"
                        name="HinhAnh"
                        rules={[{ required: true, message: "Vui lòng nhập URL hình ảnh!" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Số lượng học viên"
                        name="SoLuongHocVien"
                        rules={[{ required: true, message: "Vui lòng nhập số lượng học viên!" }]}
                    >
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item
                        label="Lượt xem"
                        name="LuotXem"
                        rules={[{ required: true, message: "Vui lòng nhập số lượt xem!" }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ManageCourses;
