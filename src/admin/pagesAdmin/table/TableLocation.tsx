import React, { useEffect, useState, useCallback } from "react";
import { Modal, Pagination, Form, Input, Button } from "antd";
import { locateApi } from "../../../service/locate/locateApi";
import { Location } from "../../../Model/Manage";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { DispatchType } from "../../../redux/store";
import { showNotification } from "../../../redux/reducers/notificationReducer";
import { validateNoSpecialChars, wordRegExp } from "../../../util/utilMethod";

const TableLocation: React.FC = () => {
  const dispatch: DispatchType = useDispatch();

  const [form] = Form.useForm();
  const [file, setFile] = useState<File | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentLocation, setCurrentLocation] = useState<Location>({
    id: 0,
    tenViTri: "",
    tinhThanh: "",
    quocGia: "",
    hinhAnh: "",
  });
  const [imageError, setImageError] = useState<string | null>(null);

  const pageSize = 6;

  const fetchLocations = useCallback(async () => {
    try {
      const data = await locateApi.getLocate();
      setTotal(data.length);
      const paginatedData = data.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
      );
      setLocations(paginatedData);
    } catch (error) {
      console.error("Failed to fetch locations:", error);
      dispatch(showNotification("Failed to fetch locations"));
    }
  }, [currentPage, dispatch]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const showModal = (location?: Location) => {
    if (location) {
      setCurrentLocation(location);
      form.setFieldsValue({
        tenViTri: location.tenViTri,
        tinhThanh: location.tinhThanh,
        quocGia: location.quocGia,
      });
    } else {
      setCurrentLocation({
        id: 0,
        tenViTri: "",
        tinhThanh: "",
        quocGia: "",
        hinhAnh: "",
      });
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const mutationPostLocate = useMutation({
    mutationFn: locateApi.postLocate,
    onSuccess: (data) => {
      if (file && data) {
        mutationLocateImage.mutate({ image: file, id: data.content.id });
      }
      fetchLocations();
    },
    onError: () => {
      dispatch(showNotification("Failed to add location"));
    },
  });

  const mutationUpdateLocate = useMutation({
    mutationFn: (data: { locateData: Location; id: string }) =>
      locateApi.updateLocate(data.locateData, data.id),
    onSuccess: (data) => {
      if (file && data) {
        mutationLocateImage.mutate({ image: file, id: data.content.id });
      }
      fetchLocations();
    },
    onError: () => {
      dispatch(showNotification("Failed to update location"));
    },
  });

  const mutationLocateImage = useMutation({
    mutationFn: (data: { image: File; id: string }) =>
      locateApi.postLocateImage(data.image, data.id),
    onSuccess: () => {
      dispatch(showNotification("Upload success"));
    },
    onError: () => {
      dispatch(showNotification("Upload failed"));
    },
  });

  const mutationDeleteLocate = useMutation({
    mutationFn: (id: string) => locateApi.deleteLocate(id),
    onSuccess: () => {
      fetchLocations();
    },
    onError: () => {
      dispatch(showNotification("Failed to delete location"));
    },
  });

  const handleOk = async () => {
    try {
      await form.validateFields();

      if (file && !validateImageFile(file)) {
        setImageError("Only .jpg and .png files are allowed.");
        return;
      }

      if (currentLocation.id === 0) {
        if (!file) {
          setImageError("Please select an image file.");
          return;
        }
        mutationPostLocate.mutate(currentLocation);
      } else {
        mutationUpdateLocate.mutate({
          locateData: currentLocation,
          id: currentLocation.id.toString(),
        });
      }

      setIsModalVisible(false);
    } catch (error) {
      console.log("Validation Failed:", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, field: keyof Location) => {
      setCurrentLocation((prevLocation) => ({
        ...prevLocation,
        [field]: e.target.value,
      }));
    },
    []
  );

  const validateImageFile = (file: File): boolean => {
    const validExtensions = ["image/jpeg", "image/png"];
    return validExtensions.includes(file.type);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (validateImageFile(file)) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setCurrentLocation((prevLocation) => ({
            ...prevLocation,
            hinhAnh: reader.result as string,
          }));
        };
        reader.readAsDataURL(file);
        setFile(file);
        setImageError(null);
      } else {
        setImageError("Only .jpg and .png files are allowed.");
        setFile(null); // Reset file if not valid
      }
    } else {
      setFile(null); // Reset file if no file selected
    }
  };

  return (
    <div className="container">
      <div className="page-inner">
        <div className="page-header">
          <h3 className="fw-bold mb-3">Manage Locations</h3>
        </div>
        <button className="btn btn-primary mb-5" onClick={() => showModal()}>
          Add Location
        </button>
        <div className="row">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th style={{ width: "100px" }}>Id</th>
                      <th style={{ width: "150px" }}>Location</th>
                      <th style={{ width: "150px" }}>Province</th>
                      <th style={{ width: "150px" }}>Nation</th>
                      <th style={{ width: "200px" }}>Image</th>
                      <th style={{ width: "120px" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {locations.map((location) => (
                      <tr key={location.id}>
                        <td>{location.id}</td>
                        <td>{location.tenViTri}</td>
                        <td>{location.tinhThanh}</td>
                        <td>{location.quocGia}</td>
                        <td style={{ width: "200px" }}>
                          <img
                            src={location.hinhAnh}
                            alt={location.tenViTri}
                            style={{ width: "100%", height: "auto" }}
                          />
                        </td>
                        <td>
                          <button
                            className="btn btn-warning btn-sm me-2"
                            onClick={() => showModal(location)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() =>
                              mutationDeleteLocate.mutate(
                                location.id.toString()
                              )
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
        title={currentLocation.id === 0 ? "Add Location" : "Edit Location"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="submit" type="primary" onClick={handleOk}>
            {currentLocation.id === 0 ? "Add" : "Edit"}
          </Button>,
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Location"
            name="tenViTri"
            rules={[
              { required: true, message: "Please input location name!" },
              {
                validator: (_, value) => {
                  if (!validateNoSpecialChars(value)) {
                    return Promise.reject(
                      new Error(
                        "Location name must not contain special characters"
                      )
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input
              value={currentLocation.tenViTri}
              onChange={(e) => handleInputChange(e, "tenViTri")}
            />
          </Form.Item>
          <Form.Item
            name="tinhThanh"
            label="Province"
            rules={[
              { required: true, message: "Please enter province!" },
              { pattern: wordRegExp, message: "Invalid province" },
            ]}
            initialValue={currentLocation.tinhThanh}
          >
            <Input
              placeholder="Province"
              onChange={(e) => handleInputChange(e, "tinhThanh")}
            />
          </Form.Item>
          <Form.Item
            name="quocGia"
            label="Nation"
            rules={[
              { required: true, message: "Please enter nation!" },
              { pattern: wordRegExp, message: "Invalid nation" },
            ]}
            initialValue={currentLocation.quocGia}
          >
            <Input
              placeholder="Nation"
              onChange={(e) => handleInputChange(e, "quocGia")}
            />
          </Form.Item>
          <Form.Item
            label="Image"
            name="hinhAnh"
            validateStatus={imageError ? "error" : ""}
            help={imageError}
          >
            <Input type="file" onChange={handleFileChange} accept=".jpg,.png" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TableLocation;
