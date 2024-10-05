import React from "react";
import {
  BookingData,
  LocateError,
  RoomData,
  RoomProps,
} from "../../../Model/Model";
import "../../../css/UserProfilePage.css";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { roomApi } from "../../../service/room/roomApi";
import Loading from "../Antd/Loading";
import useRoute from "../../../hook/useRoute";
import { useDispatch } from "react-redux";
import { editBooking } from "../../../redux/reducers/bookReducer";

const RentedRoom: React.FC<RoomProps> = ({ userBookingRoomData }) => {
  const { navigate } = useRoute();
  const dispatch = useDispatch();

  const queryResultRoomByID: UseQueryResult<RoomData, LocateError> = useQuery({
    queryKey: ["roomByIDApi", userBookingRoomData?.maPhong || ""],
    queryFn: () =>
      roomApi.getRoomByID(userBookingRoomData?.maPhong.toString() || ""),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  if (queryResultRoomByID.isLoading) {
    return <Loading />;
  }

  if (queryResultRoomByID.error) {
    return <div>Error: {queryResultRoomByID.error.message}</div>;
  }

  const handleRoomByID = () => {
    const booking: BookingData = {
      dateCheckIn: userBookingRoomData.ngayDen,
      dateCheckOut: userBookingRoomData.ngayDi,
      idLocate: queryResultRoomByID.data?.maViTri || 0,
      totalGuest: userBookingRoomData.soLuongKhach,
    };
    dispatch(editBooking(booking));

    navigate(`/detail/${queryResultRoomByID.data?.id}`);
  };

  return (
    <div className="room-card card mb-3">
      <div className="row no-gutters">
        <div className="col-md-4 room-image">
          <img
            src={queryResultRoomByID.data?.hinhAnh}
            className="card-img"
            alt={queryResultRoomByID.data?.tenPhong}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onClick={handleRoomByID}
          />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title">{queryResultRoomByID.data?.tenPhong}</h5>
            <p className="card-text">{queryResultRoomByID.data?.moTa}</p>
            <p className="card-text">
              <small className="text-muted">
                {userBookingRoomData?.soLuongKhach} khách • Phòng studio •{" "}
                {queryResultRoomByID.data?.phongNgu} phòng ngủ •{" "}
                {queryResultRoomByID.data?.giuong} giường •{" "}
                {queryResultRoomByID.data?.phongTam} phòng tắm
              </small>
            </p>
            <p className="card-text">
              <small className="text-muted">
                {[
                  queryResultRoomByID.data?.wifi && "Wifi",
                  queryResultRoomByID.data?.mayGiat && "Máy giặt",
                  queryResultRoomByID.data?.tivi && "Tivi",
                  queryResultRoomByID.data?.doXe && "Đỗ xe",
                  queryResultRoomByID.data?.hoBoi && "Hồ bơi",
                ]
                  .filter(Boolean)
                  .join(" • ")}
              </small>
            </p>
            <p className="card-text">
              ${queryResultRoomByID.data?.giaTien}/đêm
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentedRoom;
