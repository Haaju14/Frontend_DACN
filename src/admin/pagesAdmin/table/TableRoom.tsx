import React, { useEffect, useState } from "react";
import {
  Modal,
  Pagination,
  Form,
  Input,
  Select,
  Checkbox,
  notification,
} from "antd";
import { roomApi } from "../../../service/room/roomApi";
import { LocateData, LocateError, RoomData } from "../../../Model/Model";
import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { DispatchType } from "../../../redux/store";
import { showNotification } from "../../../redux/reducers/notificationReducer";
import { locateApi } from "../../../service/locate/locateApi";
import Loading from "../../../user/Components/Antd/Loading";
import {
  validateNoSpecialChars,
  numberRegExpLength,
  wordRegExp,
  validateImageFile,
} from "../../../util/utilMethod";

const TableRoom: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch: DispatchType = useDispatch();

  const [file, setFile] = useState<File | null>(null);

  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentRoom, setCurrentRoom] = useState<RoomData>({
    id: 0,
    tenPhong: "",
    khach: 0,
    phongNgu: 0,
    giuong: 0,
    phongTam: 0,
    moTa: "",
    giaTien: 0,
    mayGiat: false,
    banLa: false,
    tivi: false,
    dieuHoa: false,
    wifi: false,
    bep: false,
    doXe: false,
    hoBoi: false,
    banUi: false,
    maViTri: 0,
    hinhAnh: "",
  });

  const pageSize = 6;

  const fetchRooms = async () => {
    try {
      const data = await roomApi.getRoom();
      setTotal(data.length);
      const paginatedData = data.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
      );
      setRooms(paginatedData);
    } catch (error) {}
  };

  useEffect(() => {
    fetchRooms();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const showModal = (room?: RoomData) => {
    setCurrentRoom(
      room || {
        id: 0,
        tenPhong: "",
        khach: 0,
        phongNgu: 0,
        giuong: 0,
        phongTam: 0,
        moTa: "",
        giaTien: 0,
        mayGiat: false,
        banLa: false,
        tivi: false,
        dieuHoa: false,
        wifi: false,
        bep: false,
        doXe: false,
        hoBoi: false,
        banUi: false,
        maViTri: 0,
        hinhAnh: "",
      }
    );
    setIsModalVisible(true);
  };

  const handleSelectChange = (value: number) => {
    setCurrentRoom((prevRoom) => ({
      ...prevRoom,
      maViTri: value,
    }));
  };

  const mutationPostRoom = useMutation({
    mutationFn: roomApi.postRoom,
    onSuccess: (data) => {
      if (file && data) {
        mutationRoomImage.mutate({ image: file, id: data.content.id });
      }
      fetchRooms();
    },
    onError: () => {},
  });

  const mutationUpdateRoom = useMutation({
    mutationFn: (data: { roomData: object; id: string }) =>
      roomApi.updateRoom(data.roomData, data.id),
    onSuccess: (data) => {
      if (file && data) {
        mutationRoomImage.mutate({ image: file, id: data.content.id });
      }
      fetchRooms();
    },
    onError: () => {},
  });

  const mutationRoomImage = useMutation({
    mutationFn: (data: { image: File; id: string }) =>
      roomApi.postRoomImage(data.image, data.id),
    onSuccess: () => {
      dispatch(showNotification("Upload success"));
    },
    onError: () => {
      dispatch(showNotification("Upload failed"));
    },
  });

  const mutationDeleteRoom = useMutation({
    mutationFn: (id: string) => roomApi.deleteRoom(id),
    onSuccess: () => {
      fetchRooms();
    },
    onError: () => {},
  });

  const queryResultLocate: UseQueryResult<LocateData[], LocateError> = useQuery(
    {
      queryKey: ["locateListApi"],
      queryFn: locateApi.getLocate,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true,
    }
  );

  const handleOk = () => {
    const validationErrors = validateRoomData(currentRoom, file);
    if (validationErrors.length > 0) {
      validationErrors.forEach((error) =>
        notification.error({ message: error.message })
      );
      return;
    }

    // Logic to handle adding or updating
    if (currentRoom.id === 0) {
      mutationPostRoom.mutate(currentRoom);
    } else {
      mutationUpdateRoom.mutate({
        roomData: currentRoom,
        id: currentRoom.id.toString(),
      });
    }
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof RoomData
  ) => {
    const { value } = e.target;
    setCurrentRoom((prevRoom) => ({
      ...prevRoom,
      [field]: value,
    }));

    if (field === "tenPhong" && !validateNoSpecialChars(value)) {
      form.setFields([
        {
          name: "tenPhong",
          errors: ["Room name must not contain special characters"],
        },
      ]);
    } else {
      form.setFields([
        {
          name: "tenPhong",
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
          setCurrentRoom((prevRoom) => ({
            ...prevRoom,
            hinhAnh: reader.result as string,
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

  if (queryResultLocate.isLoading) {
    return <Loading />;
  }

  return (
    <div className="container">
      <div className="page-inner">
        <div className="page-header">
          <h3 className="fw-bold mb-3">Manage Room</h3>
        </div>
        <button className="btn btn-primary mb-5" onClick={() => showModal()}>
          Add Room
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
                    {rooms.map((room) => (
                      <tr key={room.id}>
                        <th>{room.id}</th>
                        <td>{room.tenPhong}</td>
                        <td>{room.khach}</td>
                        <td>${room.giaTien}</td>
                        <td>
                          <img
                            src={room.hinhAnh}
                            alt={room.tenPhong}
                            width={100}
                          />
                        </td>
                        <td>
                          <button
                            className="btn btn-warning btn-sm me-2"
                            style={{ marginRight: "10px" }}
                            onClick={() => showModal(room)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() =>
                              mutationDeleteRoom.mutate(room.id.toString())
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
        title={currentRoom.id === 0 ? "Add Room" : "Edit Room"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <button
            key="submit"
            className="btn btn-primary"
            style={{ marginRight: "20px" }}
            onClick={handleOk}
          >
            {currentRoom.id === 0 ? "Add" : "Edit"}
          </button>,
          <button
            key="cancel"
            className="btn btn-secondary"
            onClick={handleCancel}
          >
            Cancel
          </button>,
        ]}
      >
        <Form layout="vertical" initialValues={currentRoom}>
          <Form.Item
            label="Room Name"
            rules={[
              { required: true, message: "Please input room name!" },
              {
                validator: (_, value) => {
                  if (!validateNoSpecialChars(value)) {
                    return Promise.reject(
                      new Error("Room name must not contain special characters")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input
              value={currentRoom.tenPhong}
              onChange={(e) => handleInputChange(e, "tenPhong")}
            />
          </Form.Item>

          <Form.Item
            label="Number of Guests"
            rules={[
              { required: true, message: "Please input the number of guests!" },
              {
                pattern: numberRegExpLength(8),
                message:
                  "Number of guests must be a number with up to 8 digits",
              },
            ]}
          >
            <Input
              type="number"
              value={currentRoom.khach}
              onChange={(e) => handleInputChange(e, "khach")}
            />
          </Form.Item>

          <Form.Item
            label="Number of Bedrooms"
            rules={[
              {
                required: true,
                message: "Please input the number of bedrooms!",
              },
              {
                pattern: numberRegExpLength(6),
                message:
                  "Number of bedrooms must be a number with up to 6 digits",
              },
            ]}
          >
            <Input
              type="number"
              value={currentRoom.phongNgu}
              onChange={(e) => handleInputChange(e, "phongNgu")}
            />
          </Form.Item>

          <Form.Item
            label="Number of Beds"
            rules={[
              { required: true, message: "Please input the number of beds!" },
              {
                pattern: numberRegExpLength(6),
                message: "Number of beds must be a number with up to 6 digits",
              },
            ]}
          >
            <Input
              type="number"
              value={currentRoom.giuong}
              onChange={(e) => handleInputChange(e, "giuong")}
            />
          </Form.Item>

          <Form.Item
            label="Number of Bathrooms"
            rules={[
              {
                required: true,
                message: "Please input the number of bathrooms!",
              },
              {
                pattern: numberRegExpLength(6),
                message:
                  "Number of bathrooms must be a number with up to 6 digits",
              },
            ]}
          >
            <Input
              type="number"
              value={currentRoom.phongTam}
              onChange={(e) => handleInputChange(e, "phongTam")}
            />
          </Form.Item>

          <Form.Item
            label="Description"
            rules={[
              { required: true, message: "Please input description!" },
              {
                validator: (_, value) => {
                  if (!validateNoSpecialChars(value)) {
                    return Promise.reject(
                      new Error(
                        "Description must not contain special characters"
                      )
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input.TextArea
              value={currentRoom.moTa}
              onChange={(e) => handleInputChange(e, "moTa")}
            />
          </Form.Item>

          <Form.Item
            label="Price"
            rules={[
              { required: true, message: "Please input the room price!" },
              {
                pattern: numberRegExpLength(10000),
                message: "Price must be a valid number",
              },
            ]}
          >
            <Input
              type="number"
              value={currentRoom.giaTien}
              onChange={(e) => handleInputChange(e, "giaTien")}
            />
          </Form.Item>

          <Form.Item valuePropName="checked" label="Washing Machine">
            <Checkbox
              checked={currentRoom.mayGiat}
              onChange={(e) =>
                setCurrentRoom((prevRoom) => ({
                  ...prevRoom,
                  mayGiat: e.target.checked,
                }))
              }
            />
          </Form.Item>

          <Form.Item valuePropName="checked" label="Iron">
            <Checkbox
              checked={currentRoom.banLa}
              onChange={(e) =>
                setCurrentRoom((prevRoom) => ({
                  ...prevRoom,
                  banLa: e.target.checked,
                }))
              }
            />
          </Form.Item>

          <Form.Item valuePropName="checked" label="TV">
            <Checkbox
              checked={currentRoom.tivi}
              onChange={(e) =>
                setCurrentRoom((prevRoom) => ({
                  ...prevRoom,
                  tivi: e.target.checked,
                }))
              }
            />
          </Form.Item>

          <Form.Item valuePropName="checked" label="Air Conditioning">
            <Checkbox
              checked={currentRoom.dieuHoa}
              onChange={(e) =>
                setCurrentRoom((prevRoom) => ({
                  ...prevRoom,
                  dieuHoa: e.target.checked,
                }))
              }
            />
          </Form.Item>

          <Form.Item valuePropName="checked" label="WiFi">
            <Checkbox
              checked={currentRoom.wifi}
              onChange={(e) =>
                setCurrentRoom((prevRoom) => ({
                  ...prevRoom,
                  wifi: e.target.checked,
                }))
              }
            />
          </Form.Item>

          <Form.Item valuePropName="checked" label="Kitchen">
            <Checkbox
              checked={currentRoom.bep}
              onChange={(e) =>
                setCurrentRoom((prevRoom) => ({
                  ...prevRoom,
                  bep: e.target.checked,
                }))
              }
            />
          </Form.Item>

          <Form.Item valuePropName="checked" label="Parking">
            <Checkbox
              checked={currentRoom.doXe}
              onChange={(e) =>
                setCurrentRoom((prevRoom) => ({
                  ...prevRoom,
                  doXe: e.target.checked,
                }))
              }
            />
          </Form.Item>

          <Form.Item valuePropName="checked" label="Swimming Pool">
            <Checkbox
              checked={currentRoom.hoBoi}
              onChange={(e) =>
                setCurrentRoom((prevRoom) => ({
                  ...prevRoom,
                  hoBoi: e.target.checked,
                }))
              }
            />
          </Form.Item>

          <Form.Item valuePropName="checked" label="Ironing Board">
            <Checkbox
              checked={currentRoom.banUi}
              onChange={(e) =>
                setCurrentRoom((prevRoom) => ({
                  ...prevRoom,
                  banUi: e.target.checked,
                }))
              }
            />
          </Form.Item>

          <Form.Item
            label="Location Code"
            rules={[
              { required: true, message: "Please select a location!" },
              {
                pattern: numberRegExpLength(6),
                message: "Location code must be a number with up to 6 digits",
              },
            ]}
          >
            <Select value={currentRoom.maViTri} onChange={handleSelectChange}>
              {queryResultLocate.data?.map((locate) => (
                <Select.Option key={locate.id} value={locate.id}>
                  {locate.tenViTri}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Image">
            <Input type="file" onChange={handleFileChange} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

const validateRoomData = (room: RoomData, file: File | null) => {
  const errors: { message: string }[] = [];

  if (!room.tenPhong || !validateNoSpecialChars(room.tenPhong)) {
    errors.push({
      message: "Room name should not contain special characters.",
    });
  }

  if (!room.khach || !numberRegExpLength(room.khach)) {
    errors.push({ message: "Capacity must be a number up to 8 digits." });
  }

  if (!room.giaTien) {
    errors.push({ message: "Price is required." });
  }

  if (!room.moTa || !wordRegExp.test(room.moTa)) {
    errors.push({
      message: "Description must not contain special characters.",
    });
  }

  if (file && !validateImageFile(file)) {
    errors.push({
      message: "Only JPG and PNG formats are allowed for the image.",
    });
  }

  return errors;
};

export default TableRoom;
