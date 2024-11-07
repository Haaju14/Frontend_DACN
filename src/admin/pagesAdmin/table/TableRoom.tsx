import React, { useEffect, useState } from "react";
import {
  Modal,
  Pagination,
  Form,
  Input,
  notification,
} from "antd";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { DispatchType } from "../../../redux/store";
import { showNotification } from "../../../redux/reducers/notificationReducer";
import {
  validateNoSpecialChars,
  validateImageFile,
} from "../../../util/utilMethod";
import { KhoaHocAPI } from "../../../util/fetchfromAPI";

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

const TableKhoaHoc: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch: DispatchType = useDispatch();

  const [file, setFile] = useState<File | null>(null);

  const [khoaHocs, setKhoaHocs] = useState<KhoaHocData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentKhoaHoc, setCurrentKhoaHoc] = useState<KhoaHocData>({});

  const pageSize = 6;

  const fetchKhoaHocs = async () => {
    try {
      const data = await KhoaHocAPI;
      setTotal(data.length);
      const paginatedData = data.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
      );
      setKhoaHocs(paginatedData);
    } catch (error) {}
  };

  useEffect(() => {
    fetchKhoaHocs();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const showModal = (khoaHoc?: KhoaHocData) => {
    setCurrentKhoaHoc(
      khoaHoc || {}
    );
    setIsModalVisible(true);
  };

  const handleSelectChange = (value: number) => {
    setCurrentKhoaHoc((prevKhoaHoc) => ({
      ...prevKhoaHoc,
      maViTri: value,
    }));
  };

  const mutationPostKhoaHoc = useMutation({
    mutationFn: KhoaHocAPI,
    onSuccess: (data) => {
      if (file && data) {
        mutationKhoaHocImage.mutate({ image: file, id: data.content.id });
      }
      fetchKhoaHocs();
    },
    onError: () => {},
  });

  const mutationUpdateKhoaHoc = useMutation({
    mutationFn: (data: { KhoaHocData: object; id: string }) =>
      KhoaHocAPI(data.KhoaHocData, data.id),
    onSuccess: (data) => {
      if (file && data) {
        mutationKhoaHocImage.mutate({ image: file, id: data.content.id });
      }
      fetchKhoaHocs();
    },
    onError: () => {},
  });

  const mutationKhoaHocImage = useMutation({
    mutationFn: (data: { image: File; id: string }) =>
      KhoaHocAPI(data.image, data.id),
    onSuccess: () => {
      dispatch(showNotification("Upload success"));
    },
    onError: () => {
      dispatch(showNotification("Upload failed"));
    },
  });

  const mutationDeleteKhoaHoc = useMutation({
    mutationFn: (id: string) => KhoaHocAPI(id),
    onSuccess: () => {
      fetchKhoaHocs();
    },
    onError: () => {},
  });

  const handleOk = () => {
    const validationErrors = validateKhoaHocData(currentKhoaHoc, file);
    if (validationErrors.length > 0) {
      validationErrors.forEach((error) =>
        notification.error({ message: error.message })
      );
      return;
    }

    if (currentKhoaHoc.IDKhoaHoc === 0) {
      mutationPostKhoaHoc.mutate(currentKhoaHoc);
    } else {
      mutationUpdateKhoaHoc.mutate({
        KhoaHocData: currentKhoaHoc,
        id: currentKhoaHoc.IDKhoaHoc.toString(),
      });
    }
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof KhoaHocData
  ) => {
    const { value } = e.target;
    setCurrentKhoaHoc((prevKhoaHoc) => ({
      ...prevKhoaHoc,
      [field]: value,
    }));

    if (field === "TenKhoaHoc" && !validateNoSpecialChars(value)) {
      form.setFields([
        {
          name: "TenKhoaHoc",
          errors: ["Course name must not contain special characters"],
        },
      ]);
    } else {
      form.setFields([
        {
          name: "TenKhoaHoc",
          errors: [],
        },
      ]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isValid = validateImageFile(file);
      if (isValid) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setCurrentKhoaHoc((prevKhoaHoc) => ({
            ...prevKhoaHoc,
            HinhAnh: reader.result as string,
          }));
        };
        reader.readAsDataURL(file);
        setFile(file);
      } else {
        notification.error({
          message: "Invalid file format",
          description: "Only JPG and PNG formats are allowed.",
        });
        e.target.value = "";
      }
    }
  };



  return (
    <div className="container">
      <div className="page-inner">
        <div className="page-header">
          <h3 className="fw-bold mb-3">Manage Courses</h3>
        </div>
        <button className="btn btn-primary mb-5" onClick={() => showModal()}>
          Add Course
        </button>
        <div className="row">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Name</th>
                      <th>Capacity</th>
                      <th>Price</th>
                      <th>Image</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {khoaHocs.map((khoaHoc) => (
                      <tr key={khoaHoc.IDKhoaHoc}>
                        <th>{khoaHoc.IDKhoaHoc}</th>
                        <td>{khoaHoc.TenKhoaHoc}</td>
                        <td>{khoaHoc.SoLuongHocVien}</td>
                        <td>${khoaHoc.GiaTien}</td>
                        <td>
                          <img
                            src={khoaHoc.HinhAnh}
                            alt={khoaHoc.TenKhoaHoc}
                            width={100}
                          />
                        </td>
                        <td>
                          <button
                            className="btn btn-warning btn-sm me-2"
                            style={{ marginRight: "10px" }}
                            onClick={() => showModal(khoaHoc)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() =>
                              mutationDeleteKhoaHoc.mutate(khoaHoc.IDKhoaHoc.toString())
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
                align="center"
                current={currentPage}
                total={total}
                pageSize={pageSize}
                onChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
      <Modal
        title={currentKhoaHoc.IDKhoaHoc === 0 ? "Add Course" : "Edit Course"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Course Name"
            name="TenKhoaHoc"
            rules={[{ required: true, message: "Please enter a course name" }]}
          >
            <Input
              value={currentKhoaHoc.TenKhoaHoc}
              onChange={(e) => handleInputChange(e, "TenKhoaHoc")}
            />
          </Form.Item>
          <Form.Item
            label="Price"
            name="GiaTien"
            rules={[{ required: true, message: "Please enter a course price" }]}
          >
            <Input
              value={currentKhoaHoc.GiaTien}
              onChange={(e) => handleInputChange(e, "GiaTien")}
            />
          </Form.Item>
          <Form.Item label="Image">
            <Input
              type="file"
              onChange={handleFileChange}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TableKhoaHoc;
