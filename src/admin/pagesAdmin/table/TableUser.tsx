import React, { useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { Form, Input, Modal, Pagination, Select, notification } from "antd";
import {
  emailRegExp,
  phoneRegExp,
  birthRegExp,
  validatePassword,
} from "../../../util/utilMethod";

import Loading from "../../../user/Components/Antd/Loading";

import debounce from "lodash.debounce";
import { UserAPI } from "../../../util/fetchfromAPI";

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

const TableUser: React.FC = () => {
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>({
    IDNguoiDung: 0,
    TenDangNhap: "",
    Email: "",
    MatKhau: "",
    HoTen: "",
    GioiTinh: true,
    SDT: "",
    Role: "",
    AnhDaiDien: "",
  });

  const [searchTerm, setSearchTerm] = useState<string>("");

  const [form] = Form.useForm();
  const pageSize = 6;

  const queryResult: UseQueryResult<
    {
      data: User[];
      keywords: string | null;
      pageIndex: number;
      pageSize: number;
      totalRow: number;
    },
    Error
  > = useQuery({
    queryKey: ["listUsers", currentPage, pageSize, searchTerm],
    queryFn: async () => {
      const response = await UserAPI.getUserByPage(
        currentPage,
        pageSize,
        searchTerm
      );
      return response?.data
        ? {
            data: response.data,
            keywords: response.keywords,
            pageIndex: response.pageIndex,
            pageSize: response.pageSize,
            totalRow: response.totalRow,
          }
        : {
            data: [],
            keywords: null,
            pageIndex: 0,
            pageSize: 0,
            totalRow: 0,
          };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });

  const mutation = useMutation({
    mutationFn: (user: User) => {
      return user.IDNguoiDung === 0
        ? UserAPI.postUser(user)
        : UserAPI.updateUser(user, user.IDNguoiDung.toString());
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["listUsers", currentPage, pageSize, searchTerm]);
      setIsModalVisible(false);
      notification.success({
        message: currentUser.IDNguoiDung === 0 ? "User Added" : "User Updated",
        description: "The user details have been successfully saved.",
      });
    },
    onError: (error) => {
      notification.error({
        message: "Error",
        description: error.message,
      });
    },
  });

  const mutationDeleteUser = useMutation({
    mutationFn: (id: string) => UserAPI.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["listUsers", currentPage, pageSize, searchTerm]);
    },
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const showModal = (user?: User) => {
    setCurrentUser(
      user || {
        IDNguoiDung: 0,
        TenDangNhap: "",
        Email: "",
        MatKhau: "",
        HoTen: "",
        GioiTinh: true,
        SDT: "",
        Role: "",
        AnhDaiDien: "",
      }
    );
    form.resetFields();
    form.setFieldsValue(user || {});
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        mutation.mutate({ ...currentUser, ...values });
      })
      .catch((errorInfo) => {
        console.log("Validation Failed:", errorInfo);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setCurrentUser((prevUser) => ({
      ...prevUser,
      [field]: e.target.value,
    }));
  };

  const handleGenderChange = (value: boolean) => {
    setCurrentUser((prevUser) => ({
      ...prevUser,
      GioiTinh: value,
    }));
  };

  const handleRoleChange = (value: string) => {
    setCurrentUser((prevUser) => ({
      ...prevUser,
      Role: value,
    }));
  };

  // Tìm kiếm
  const debouncedSearch = debounce((value: string) => {
    setSearchTerm(value);
  }, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    queryClient.invalidateQueries(["listUsers", currentPage, pageSize, searchTerm]);
  };

  if (queryResult.isLoading) {
    return <Loading />;
  }

  if (queryResult.isError) {
    return <div>Error: {queryResult.error?.message}</div>;
  }

  const totalRow = queryResult?.data?.totalRow;
  const data = queryResult?.data?.data || [];

  return (
    <div className="container">
      <div className="page-inner">
        <div className="page-header">
          <h3 className="fw-bold mb-3">User Management</h3>
        </div>
        <button className="btn btn-primary mb-5" onClick={() => showModal()}>
          Add User
        </button>
        <div className="input-group mb-5" style={{ width: "33.33%" }}>
          <input
            type="text"
            placeholder="Search ..."
            className="form-control"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button className="btn btn-secondary" onClick={handleSearch}>
            Search
          </button>
        </div>
        <div className="row">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((user: User | undefined) => (
                      <tr key={user?.IDNguoiDung}>
                        <th>{user?.IDNguoiDung}</th>
                        <td>{user?.HoTen}</td>
                        <td>{user?.Email}</td>
                        <td>{user?.SDT}</td>
                        <td>{user?.Role}</td>
                        <td>
                          <button
                            className="btn btn-warning btn-sm me-2"
                            onClick={() => showModal(user)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() =>
                              user?.IDNguoiDung &&
                              mutationDeleteUser.mutate(user.IDNguoiDung.toString())
                            }
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={totalRow}
                onChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>

      <Modal
        title={currentUser.IDNguoiDung === 0 ? "Add User" : "Edit User"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Save"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="HoTen"
            label="Name"
            rules={[{ required: true, message: "Please input the name!" }]}
          >
            <Input
              value={currentUser.HoTen}
              onChange={(e) => handleInputChange(e, "HoTen")}
            />
          </Form.Item>
          <Form.Item
            name="Email"
            label="Email"
            rules={[
              { required: true, message: "Please input the email!" },
              {
                pattern: emailRegExp,
                message: "Invalid email format!",
              },
            ]}
          >
            <Input
              value={currentUser.Email}
              onChange={(e) => handleInputChange(e, "Email")}
            />
          </Form.Item>
          <Form.Item
            name="SDT"
            label="Phone"
            rules={[
              { required: true, message: "Please input the phone!" },
              {
                pattern: phoneRegExp,
                message: "Invalid phone number!",
              },
            ]}
          >
            <Input
              value={currentUser.SDT}
              onChange={(e) => handleInputChange(e, "SDT")}
            />
          </Form.Item>
          <Form.Item
            name="birthday"
            label="Birthday"
            rules={[
              { required: true, message: "Please input the birthday!" },
              {
                pattern: birthRegExp,
                message: "Invalid date format!",
              },
            ]}
          >
            <Input
              value={currentUser.AnhDaiDien || ""}
              onChange={(e) => handleInputChange(e, "AnhDaiDien")}
            />
          </Form.Item>
          <Form.Item name="GioiTinh" label="Gender" initialValue={currentUser.GioiTinh}>
            <Select value={currentUser.GioiTinh} onChange={handleGenderChange}>
              <Select.Option value={true}>Male</Select.Option>
              <Select.Option value={false}>Female</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="Role" label="Role" initialValue={currentUser.Role}>
            <Select value={currentUser.Role} onChange={handleRoleChange}>
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="user">User</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="MatKhau"
            label="Password"
            rules={[
              { required: true, message: "Please input the password!" },
              { validator: validatePassword },
            ]}
          >
            <Input.Password
              value={currentUser.MatKhau}
              onChange={(e) => handleInputChange(e, "MatKhau")}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TableUser;
