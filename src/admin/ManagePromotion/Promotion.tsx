import React, { useState, useEffect } from "react";
import axios from "axios";
import { message, Modal, Form, Button, Card, Input, DatePicker, Pagination } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined, EyeOutlined } from "@ant-design/icons";
import { BASE_URL } from "../../util/fetchfromAPI";
import "../../../public/admin/css/ManagePromotion.css";
import moment from "moment";

const ManagePromotions: React.FC = () => {
    const [promotions, setPromotions] = useState<any[]>([]);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState<boolean>(false);
    const [editPromotion, setEditPromotion] = useState<any>(null);
    const [detailPromotion, setDetailPromotion] = useState<any>(null);
    const [form] = Form.useForm();
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    const [totalPromotions, setTotalPromotions] = useState(0);

    const getToken = () => localStorage.getItem("token");

    useEffect(() => {
        fetchPromotions();
    }, [currentPage]);

    const fetchPromotions = async () => {
        try {
            const token = getToken();
            const { data } = await axios.get(`${BASE_URL}/khuyenmai/all`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { page: currentPage - 1, size: pageSize },
            });
            setPromotions(data.data || []);  
            setTotalPromotions(data.totalElements);
        } catch (error) {
            console.error("Error fetching promotions:", error);
            message.error("Có lỗi xảy ra khi tải danh sách khuyến mãi.");
        }
    };

    const handleAddPromotion = () => {
        setEditPromotion(null);
        setIsModalVisible(true);
        form.resetFields();
    };

    const handleEditPromotion = (promotion: any) => {
        setEditPromotion(promotion);
        setIsModalVisible(true);
        form.setFieldsValue({
            ...promotion,
            NgayBatDau: promotion.NgayBatDau ? moment(promotion.NgayBatDau) : null,
            NgayKetThuc: promotion.NgayKetThuc ? moment(promotion.NgayKetThuc) : null,
        });
    };

    const handleDeletePromotion = async (id: number) => {
        try {
            const token = getToken();
            await axios.delete(`${BASE_URL}/khuyenmai/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            message.success("Xóa khuyến mãi thành công.");
            fetchPromotions();
        } catch (error) {
            console.error("Error deleting promotion:", error);
            message.error("Không thể xóa khuyến mãi này!");
        }
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            const token = getToken();
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const promotionData = {
                TenKhuyenMai: values.TenKhuyenMai,
                MoTaKhuyenMai: values.MoTaKhuyenMai,
                LoaiKhuyenMai: values.LoaiKhuyenMai,
                GiaTri: values.GiaTri,
                NgayBatDau: values.NgayBatDau ? values.NgayBatDau.format("YYYY-MM-DD") : null,
                NgayKetThuc: values.NgayKetThuc ? values.NgayKetThuc.format("YYYY-MM-DD") : null,
            };

            if (editPromotion) {
                // Update promotion
                await axios.put(`${BASE_URL}/khuyenmai/put/${editPromotion.IDKhuyenMai}`, promotionData, config);
                message.success("Cập nhật khuyến mãi thành công.");
            } else {
                // Add new promotion
                await axios.post(`${BASE_URL}/khuyenmai/add`, promotionData, config);
                message.success("Thêm khuyến mãi thành công.");
            }

            fetchPromotions();
            setIsModalVisible(false);
        } catch (error) {
            message.error("Có lỗi xảy ra khi lưu khuyến mãi.");
        }
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleViewDetails = (promotion: any) => {
        setDetailPromotion(promotion);
        setIsDetailModalVisible(true);
    };

    const handleDetailModalCancel = () => {
        setIsDetailModalVisible(false);
    };

    return (
        <div className="manage-promotions-container">
            <h1>Quản lý khuyến mãi</h1>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddPromotion}>
                Thêm khuyến mãi
            </Button>

            <div style={{ marginTop: "20px" }}>
                {promotions.length > 0 ? (
                    promotions.map((promotion) => (
                        <Card key={promotion.IDKhuyenMai} className="promotion-card">
                            <div className="promotion-info">
                                <div className="promotion-name">{promotion.TenKhuyenMai}</div>
                            </div>
                            <div className="promotion-actions">
                                <Button
                                    icon={<EyeOutlined />}
                                    onClick={() => handleViewDetails(promotion)}
                                />
                                <Button
                                    icon={<EditOutlined />}
                                    onClick={() => handleEditPromotion(promotion)}
                                />
                                <Button
                                    icon={<DeleteOutlined />}
                                    onClick={() => handleDeletePromotion(promotion.IDKhuyenMai)}
                                />
                            </div>
                        </Card>
                    ))
                ) : (
                    <div style={{ textAlign: "center" }}>Không có khuyến mãi nào</div>
                )}
            </div>

            <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={totalPromotions}
                onChange={handlePageChange}
                style={{ marginTop: "20px", textAlign: "center" }}
            />

            {/* Modal thêm/sửa khuyến mãi */}
            <Modal
                title={editPromotion ? "Sửa khuyến mãi" : "Thêm khuyến mãi"}
                visible={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText={editPromotion ? "Cập nhật" : "Thêm"}
            >
                <Form form={form} layout="vertical">
                    <Form.Item label="Tên khuyến mãi" name="TenKhuyenMai" rules={[{ required: true, message: "Vui lòng nhập tên khuyến mãi!" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Mô tả khuyến mãi" name="MoTaKhuyenMai" rules={[{ required: true, message: "Vui lòng nhập mô tả khuyến mãi!" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Loại khuyến mãi" name="LoaiKhuyenMai" rules={[{ required: true, message: "Vui lòng nhập loại khuyến mãi!" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Giá trị" name="GiaTri" rules={[{ required: true, message: "Vui lòng nhập giá trị khuyến mãi!" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Ngày bắt đầu" name="NgayBatDau" rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu!" }]}>
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item label="Ngày kết thúc" name="NgayKetThuc" rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc!" }]}>
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal chi tiết khuyến mãi */}
            <Modal
                title="Chi tiết khuyến mãi"
                visible={isDetailModalVisible}
                onCancel={handleDetailModalCancel}
                footer={null}
            >
                {detailPromotion && (
                    <div>
                        <div><strong>Tên khuyến mãi:</strong> {detailPromotion.TenKhuyenMai}</div>
                        <div><strong>Mô tả:</strong> {detailPromotion.MoTaKhuyenMai}</div>
                        <div><strong>Loại khuyến mãi:</strong> {detailPromotion.LoaiKhuyenMai}</div>
                        <div><strong>Giá trị:</strong> {detailPromotion.GiaTri}</div>
                        <div><strong>Ngày bắt đầu:</strong> {moment(detailPromotion.NgayBatDau).format("DD/MM/YYYY")}</div>
                        <div><strong>Ngày kết thúc:</strong> {moment(detailPromotion.NgayKetThuc).format("DD/MM/YYYY")}</div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ManagePromotions;
