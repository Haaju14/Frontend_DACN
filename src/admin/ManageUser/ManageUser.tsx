import React, { useState, useEffect } from "react";
import axios from "axios";
import { message, Modal, Form, Button, Card, Input, Radio, Pagination, Select, Avatar } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined, EyeOutlined } from "@ant-design/icons";
import { BASE_URL } from "../../util/fetchfromAPI";
import "../../../public/admin/css/ManageUser.css";
import moment from "moment";

const ManageUsers: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState<boolean>(false);
    const [editUser, setEditUser] = useState<any>(null);
    const [detailUser, setDetailUser] = useState<any>(null);
    const [form] = Form.useForm();
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    const [totalUsers, setTotalUsers] = useState(0);
    const [roleFilter, setRoleFilter] = useState<string>("");
    const [searchName, setSearchName] = useState<string>("");

    const getToken = () => localStorage.getItem("token");

    useEffect(() => {
        fetchUsers();
    }, [currentPage, roleFilter,users,searchName]); 

    const fetchUsers = async () => {
        try {
            const token = getToken();
            const params: any = { page: currentPage - 1, size: pageSize };
    
            // Chỉ thêm searchName nếu có giá trị
            if (searchName) {
                params.searchName = searchName;
            }
    
            let endpoint = "";
            let additionalUsers = [];
    
            if (roleFilter === "giangvien") {
                endpoint = "/giangvien/all";
            } else if (roleFilter === "hocvien") {
                endpoint = "/hocvien";
            } else {
                // Nếu không có filter, gọi cả giảng viên và học viên
                const responseHocVien = await axios.get(`${BASE_URL}/hocvien`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params,
                });
    
                const responseGiangVien = await axios.get(`${BASE_URL}/giangvien/all`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params,
                });
    
                additionalUsers = responseGiangVien.data.content || [];
                const allUsers = [...responseHocVien.data.content, ...additionalUsers];
    
                // Lọc người dùng theo tên
                const filteredUsers = allUsers.filter((user) =>
                    user.HoTen.toLowerCase().includes(searchName.toLowerCase())
                );
    
                setUsers(filteredUsers);
                setTotalUsers(filteredUsers.length);
                return;
            }
    
            const { data } = await axios.get(`${BASE_URL}${endpoint}`, {
                headers: { Authorization: `Bearer ${token}` },
                params,
            });
    
            // Lọc người dùng theo tên
            const filteredData = data.content.filter((user: any) =>
                user.HoTen.toLowerCase().includes(searchName.toLowerCase())
            );
    
            setUsers(filteredData);
            setTotalUsers(data.totalElements);
    
        } catch (error) {
            console.error("Error fetching users:", error);
            message.error("Có lỗi xảy ra khi tải danh sách người dùng.");
        }
    };
    
    
       
    const handleDeleteUser = async (id: number) => {
        try {
            const token = getToken();
            const config = { headers: { Authorization: `Bearer ${token}` } };
    
            // Xác định endpoint theo role
            const endpoint = roleFilter === 'giangvien' ? `/giangvien/delete/${id}` : `/hocvien/delete/${id}`;
    
            // Gửi request để xóa người dùng
            await axios.delete(`${BASE_URL}${endpoint}`, config);
            message.success("Xóa người dùng thành công.");
            fetchUsers(); // Cập nhật lại danh sách người dùng
        } catch (error) {
            console.error("Error deleting user:", error);
            message.error("Không thể xóa người dùng này.");
        }
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            const token = getToken();
            const config = { headers: { Authorization: `Bearer ${token}` } };
    
            // Tạo dữ liệu người dùng
            const userData = {
                TenDangNhap: values.TenDangNhap,
                MatKhau: values.MatKhau,
                Email: values.Email,
                HoTen: values.HoTen,
                GioiTinh: values.GioiTinh,
                SDT: values.SDT,
                AnhDaiDien: values.AnhDaiDien?.fileList[0]?.url || editUser?.AnhDaiDien, // Handle image upload
            };        
            const endpoint = roleFilter === 'giangvien' 
                ? (editUser ? `/giangvien/put/${editUser.IDNguoiDung}` : `/giangvien/add`)
                : (editUser ? `/hocvien/put/${editUser.IDNguoiDung}` : `/hocvien/add`);
    
            
            if (editUser) {
                await axios.put(`${BASE_URL}${endpoint}`, userData, config);
                message.success("Cập nhật người dùng thành công.");
            } else {
                
                await axios.post(`${BASE_URL}${endpoint}`, userData, config);
                message.success("Thêm người dùng thành công.");
            }
    
           
            fetchUsers();
            setIsModalVisible(false);
        } catch (error) {
            console.error("Error saving user:", error);
            message.error("Có lỗi xảy ra khi lưu người dùng.");
        }
    };
    
    const handleUpdateRole = async (user: any) => {
        try {
            const newRole = user.Role === "hocvien" ? "giangvien" : "hocvien";
            const token = getToken();
            const config = { headers: { Authorization: `Bearer ${token}` } };
    
            
            const response = await axios.put(
                `${BASE_URL}/hocvien/cap-nhat-role/${user.IDNguoiDung}`,
                { newRole },
                config
            );
    
            if (response.data.status === 200) {
                message.success(response.data.message);    
                setCurrentPage(1);
                fetchUsers(); 
            } else {
                message.success("Cập nhật role thành công.");
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật role:", error);
            message.error("Có lỗi xảy ra khi cập nhật role.");
        }
    };
    
    const handleAddUser = () => {
        setEditUser(null);
        setIsModalVisible(true);
        form.resetFields();
    };

    const handleEditUser = (user: any) => {
        setEditUser(user);
        setIsModalVisible(true);
        form.setFieldsValue({
            ...user,
            NgaySinh: user.NgaySinh ? moment(user.NgaySinh) : null,
        });
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleViewDetails = (user: any) => {
        setDetailUser(user);
        setIsDetailModalVisible(true);
    };

    const handleDetailModalCancel = () => {
        setIsDetailModalVisible(false);
    };

    const handleRoleFilterChange = (value: string) => {
        setRoleFilter(value);
        setCurrentPage(1); // Reset về trang đầu khi thay đổi role filter
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchName(e.target.value);
        setCurrentPage(1); 
    };
    
    return (
        <div className="manage-users-container">
            <h1>Quản lý người dùng</h1>
            <div className="filter-search-container">
                {/* Phần lọc vai trò người dùng */}
                <div className="filter-role-container">
                    <Form.Item label="Lọc theo vai trò" style={{ marginBottom: 10 }}>
                        <Select
                            style={{ width: "100%" }}
                            placeholder="Chọn vai trò"
                            value={roleFilter}
                            onChange={handleRoleFilterChange}
                        >
                            <Select.Option value="">Tất cả</Select.Option>
                            <Select.Option value="hocvien">Học viên</Select.Option>
                            <Select.Option value="giangvien">Giảng viên</Select.Option>
                        </Select>
                    </Form.Item>
                </div>

                {/* Phần tìm kiếm người dùng */}
                <div className="search-container">
                    <Form.Item label="Tìm kiếm theo tên" style={{ marginBottom: 0 }}>
                        <input
                            type="text"
                            className="form-control"
                            value={searchName}
                            onChange={handleSearchChange}
                            placeholder="Nhập tên người dùng"
                        />
                    </Form.Item>
                </div>
            </div>

            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddUser}>
                Thêm người dùng
            </Button>
    
            {/* Danh sách người dùng */}
            <div className="user-card-container">
                {users.length > 0 ? (
                    users.map((user) => (
                        <Card key={user.IDNguoiDung} className="user-card">
                            <div className="user-info">
                                <Avatar src={user.AnhDaiDien} size={64} />
                                <div>
                                    <div className="user-name">{user.HoTen}</div>
                                    <div className="user-id">ID: {user.IDNguoiDung}</div>
                                    <div className="user-role">Role: {user.Role}</div>
                                </div>
                            </div>
                            <div className="user-actions">
                                <Button
                                    icon={<EyeOutlined />}
                                    onClick={() => handleViewDetails(user)}
                                />
                                <Button
                                    icon={<EditOutlined />}
                                    onClick={() => handleEditUser(user)}
                                />
                                <Button
                                    icon={<DeleteOutlined />}
                                    onClick={() => handleDeleteUser(user.IDNguoiDung)}
                                />
                                {/* Chỉ hiển thị nút Update Role nếu không phải là giảng viên */}
                                {user.Role !== 'giangvien' && (
                                    <Button
                                        icon={<EditOutlined />}
                                        onClick={() => handleUpdateRole(user)}
                                        style={{ marginLeft: "10px" }}
                                    >
                                        Update Role
                                    </Button>
                                )}
                            </div>
                        </Card>
                    ))
                ) : (
                    <div style={{ textAlign: "center" }}>Không có người dùng nào</div>
                )}
            </div>
    
            <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={totalUsers}
                onChange={handlePageChange}
                style={{ marginTop: "20px", textAlign: "center" }}
            />
    
            {/* Modal thêm/sửa người dùng */}
            <Modal
                title={editUser ? "Sửa người dùng" : "Thêm người dùng"}
                visible={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText={editUser ? "Cập nhật" : "Thêm"}
            >
                <Form form={form} layout="vertical">
                    <Form.Item label="Tên đăng nhập" name="TenDangNhap" rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Mật khẩu" name="MatKhau" rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item label="Email" name="Email" rules={[{ required: true, message: "Vui lòng nhập email!" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Họ tên" name="HoTen" rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Giới tính" name="GioiTinh" rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}>
                        <Radio.Group>
                            <Radio value="nam">Nam</Radio>
                            <Radio value="nu">Nữ</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="Số điện thoại" name="SDT" rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}>
                        <Input />
                    </Form.Item>                   
    
                </Form>
            </Modal>
    
            {/* Modal chi tiết người dùng */}
            <Modal
                title="Chi tiết người dùng"
                visible={isDetailModalVisible}
                onCancel={handleDetailModalCancel}
                footer={null}
            >
                {detailUser && (
                    <div>
                        <Avatar src={detailUser.AnhDaiDien} size={128} />
                        <h3>Họ tên: {detailUser.HoTen}</h3>
                        <p>Email: {detailUser.Email}</p>
                        <p>Role: {detailUser.Role}</p>
                        <p>Số điện thoại: {detailUser.SDT}</p>
                        <p>Giới tính: {detailUser.GioiTinh}</p>
                        <p>Ngày sinh: {moment(detailUser.NgaySinh).format("DD/MM/YYYY")}</p>
                    </div>
                )}
            </Modal>
        </div>
    );
    
    
};

export default ManageUsers;
