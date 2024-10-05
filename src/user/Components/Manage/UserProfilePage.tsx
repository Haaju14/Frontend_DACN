import React, { useState, useEffect } from "react";
import Profile from "./Profile";
import RentedRoom from "./RentedRoom";
import {
  LocateError,
  UserBookingRoomData,
  UserData,
} from "../../../Model/Model";
import "../../../css/UserProfilePage.css";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import Loading from "../Antd/Loading";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { roomApi } from "../../../service/room/roomApi";
import { Pagination } from "antd";

const UserProfilePage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [paginatedRooms, setPaginatedRooms] = useState<UserBookingRoomData[]>(
    []
  );

  const { userLogin } = useSelector((state: RootState) => state.userReducer);

  const queryResultBookingRoomByUser: UseQueryResult<
    UserBookingRoomData[],
    LocateError
  > = useQuery({
    queryKey: ["getBookingRoomByUser", userLogin?.user.id || ""],
    queryFn: () =>
      roomApi.getBookingRoomByUser(userLogin?.user.id.toString() || ""),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Perform side effects when data or page changes
  useEffect(() => {
    if (queryResultBookingRoomByUser.data) {
      const pageSize = 6;
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      setPaginatedRooms(
        queryResultBookingRoomByUser.data.slice(startIndex, endIndex)
      );
    }
  }, [queryResultBookingRoomByUser.data, currentPage]);

  if (!userLogin || queryResultBookingRoomByUser.isLoading) {
    return <Loading />;
  }

  if (queryResultBookingRoomByUser.isError) {
    return <div>Error: {queryResultBookingRoomByUser.error.message}</div>;
  }

  const userData: UserData = {
    id: userLogin.user.id,
    name: userLogin.user.name,
    email: userLogin.user.email,
    password: userLogin.user.password,
    phone: userLogin.user.phone,
    birthday: userLogin.user.birthday,
    avatar: userLogin.user.avatar,
    gender: userLogin.user.gender,
    role: userLogin.user.role,
  };

  const total = queryResultBookingRoomByUser.data?.length || 0;

  return (
    <div className="user-profile-page container">
      <div className="row">
        <div className="col-md-4">
          <Profile user={userData} />
        </div>
        <div className="col-md-8">
          <div className="rented-rooms">
            <h2>Room rented</h2>
            {paginatedRooms.map((userBookingRoomData) => (
              <RentedRoom
                key={userBookingRoomData.id}
                userBookingRoomData={userBookingRoomData}
              />
            ))}
          </div>
          <Pagination
            align="center"
            current={currentPage}
            total={total}
            pageSize={6}
            onChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
