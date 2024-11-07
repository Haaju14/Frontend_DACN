import React, { useState, useEffect } from "react";
import { Modal, Pagination } from "antd";
import { roomApi } from "../../../service/room/roomApi";
import { BookingRoom } from "../../../Model/Manage";
import { convertDateAndTime } from "../../../util/utilMethod";

const TableBookingRoom: React.FC = () => {
  const [bookingRooms, setBookingRooms] = useState<BookingRoom[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<BookingRoom | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const pageSize = 6;

  useEffect(() => {
    const fetchBookingRooms = async () => {
      try {
        const data = await roomApi.getBookingRoom();
        setTotal(data.length);
        const paginatedData = data.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        );
        setBookingRooms(paginatedData);
      } catch (error) {
        console.error("Failed to fetch booking rooms:", error);
      }
    };

    fetchBookingRooms();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDetailClick = async (id: number) => {
    try {
      const booking = await roomApi.getBookingRoomByID(id.toString());
      setSelectedBooking(booking);
      setIsModalVisible(true);
    } catch (error) {
      console.error("Failed to fetch booking room details:", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedBooking(null);
  };

  return (
    <div className="container">
      <div className="page-inner">
        <div className="page-header">
          <h3 className="fw-bold mb-3">Booking Rooms</h3>
        </div>
        <div className="row">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Check-in Date</th>
                      <th>Capacity</th>
                      <th>Customer's Code</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookingRooms.map((booking) => (
                      <tr key={booking.id}>
                        <td>{booking.id}</td>
                        <td> {convertDateAndTime(booking.ngayDen)}</td>
                        <td>{booking.soLuongKhach}</td>
                        <td>{booking.maNguoiDung}</td>
                        <td>
                          <button
                            className="btn btn-primary btn-sm me-2"
                            onClick={() => handleDetailClick(booking.id)}
                          >
                            Detail
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
        title="Booking Details"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <button
            key="close"
            className="btn btn-secondary"
            onClick={handleCancel}
          >
            Close
          </button>,
        ]}
      >
        {selectedBooking && (
          <div>
            <p>
              <strong>Id:</strong> {selectedBooking.id}
            </p>
            <p>
              <strong>Room Code:</strong> {selectedBooking.maPhong}
            </p>
            <p>
              <strong>Check-in Date:</strong>{" "}
              {convertDateAndTime(selectedBooking.ngayDen)}
            </p>
            <p>
              <strong>Check-out Date:</strong>{" "}
              {convertDateAndTime(selectedBooking.ngayDi)}
            </p>
            <p>
              <strong>Capacity:</strong> {selectedBooking.soLuongKhach}
            </p>
            <p>
              <strong>Customer's Code:</strong> {selectedBooking.maNguoiDung}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TableBookingRoom;
