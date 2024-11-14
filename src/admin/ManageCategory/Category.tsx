import React, { useState, useEffect } from "react";
import axios from "axios";
import { message, Modal, Form, Button, Card, Input, Pagination } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined, EyeOutlined } from "@ant-design/icons";
import { BASE_URL } from "../../util/fetchfromAPI";
import "../../../public/admin/css/ManageCategory.css";

const ManageCategories: React.FC = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState<boolean>(false);
    const [editCategory, setEditCategory] = useState<any>(null);
    const [detailCategory, setDetailCategory] = useState<any>(null);
    const [form] = Form.useForm();
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    const [totalCategories, setTotalCategories] = useState(0);

    const getToken = () => localStorage.getItem("token");

    useEffect(() => {
        fetchCategories();
    }, [currentPage]);

    const fetchCategories = async () => {
        try {
            const token = getToken();
            const { data } = await axios.get(`${BASE_URL}/danhmuc/all`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { page: currentPage - 1, size: pageSize },
            });
            setCategories(data.content);
            setTotalCategories(data.totalElements);
        } catch (error) {
            console.error("Error fetching categories:", error);
            message.error("Có lỗi xảy ra khi tải danh sách danh mục.");
        }
    };

    const handleAddCategory = () => {
        setEditCategory(null);
        setIsModalVisible(true);
        form.resetFields();
    };

    const handleEditCategory = (category: any) => {
        setEditCategory(category);
        setIsModalVisible(true);
        form.setFieldsValue(category);
    };

    const handleDeleteCategory = async (id: number) => {
        try {
            const token = getToken();
            if (!token) {
                message.error("Vui lòng đăng nhập để thực hiện thao tác này.");
                return;
            }
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(`${BASE_URL}/danhmuc/delete/${id}`, config);
            message.success("Xóa danh mục thành công.");
            fetchCategories();
        } catch (error) {
            console.error("Error deleting category:", error);
            message.error("Không thể xóa danh mục này!");
        }
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            const token = getToken();
            const config = { headers: { Authorization: `Bearer ${token}` } };

            if (editCategory) {
                await axios.put(`${BASE_URL}/danhmuc/put/${editCategory.IDDanhMuc}`, values, config);
                message.success("Cập nhật danh mục thành công.");
            } else {
                await axios.post(`${BASE_URL}/danhmuc/add`, values, config);
                message.success("Thêm danh mục thành công.");
            }

            fetchCategories();
            setIsModalVisible(false);
        } catch (error) {
            message.error("Có lỗi xảy ra khi lưu danh mục.");
        }
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleViewDetails = (category: any) => {
        setDetailCategory(category);
        setIsDetailModalVisible(true);
    };

    const handleDetailModalCancel = () => {
        setIsDetailModalVisible(false);
    };

    return (
        <div className="manage-categories-container">
            <h1>Quản lý danh mục khóa học</h1>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCategory}>
                Thêm danh mục
            </Button>
            <div style={{ marginTop: "20px" }}>
                {categories.map((category) => (
                    <Card key={category.IDDanhMuc} className="category-card">
                        <div className="category-info">
                            <div className="category-name">{category.TenDanhMuc}</div>
                        </div>
                        <div className="category-actions">
                            {/* Căn chỉnh các nút bằng flexbox */}
                            <div className="button-group">
                                <Button
                                    icon={<EyeOutlined />}
                                    onClick={() => handleViewDetails(category)}
                                    style={{ marginRight: "10px" }}
                                />
                                <Button
                                    icon={<EditOutlined />}
                                    onClick={() => handleEditCategory(category)}
                                    style={{ marginRight: "10px" }}
                                />
                                <Button
                                    icon={<DeleteOutlined />}
                                    onClick={() => handleDeleteCategory(category.IDDanhMuc)}
                                />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Pagination */}
            <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={totalCategories}
                onChange={handlePageChange}
                style={{ marginTop: "20px", textAlign: "center" }}
            />

            {/* Modal thêm/sửa danh mục */}
            <Modal
                title={editCategory ? "Sửa danh mục" : "Thêm danh mục"}
                visible={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText={editCategory ? "Cập nhật" : "Thêm"}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Tên danh mục"
                        name="TenDanhMuc"
                        rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal chi tiết danh mục */}
            <Modal
                title="Chi tiết danh mục"
                visible={isDetailModalVisible}
                onCancel={handleDetailModalCancel}
                footer={null}
            >
                {detailCategory && (
                    <div>
                        <div><strong>ID danh mục:   </strong> {detailCategory.IDDanhMuc}</div>
                        <div><strong>Tên danh mục:  </strong> {detailCategory.TenDanhMuc}</div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ManageCategories;
