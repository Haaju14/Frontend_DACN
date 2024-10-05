import React, { useMemo, useState } from "react";
import { Pagination } from "antd";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { roomApi } from "../../../service/room/roomApi";
import Loading from "../Antd/Loading";
import { RoomData, LocateError, PriceRangeProps } from "../../../Model/Model";
import "react-datepicker/dist/react-datepicker.css";
import useRoute from "../../../hook/useRoute";

const RoomAll: React.FC<PriceRangeProps> = ({ priceRange }) => {
  const { navigate } = useRoute();

  const [currentPage, setCurrentPage] = useState<number>(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const queryResultRoom: UseQueryResult<RoomData[], LocateError> = useQuery({
    queryKey: ["roomListApi"],
    queryFn: roomApi.getRoom,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });

  if (queryResultRoom.isLoading) {
    return <Loading />;
  }

  if (queryResultRoom.isError) {
    return <div>Error: {queryResultRoom.error?.message} </div>;
  }

  const pageSize = 6;

  const rooms = queryResultRoom.data;

  const filteredRooms = useMemo(() => {
    if (!rooms) return [];
    return rooms?.filter((room) => {
      return room.giaTien >= priceRange[0] && room.giaTien <= priceRange[1];
    });
  }, [rooms, priceRange]);

  const paginatedRooms = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredRooms.slice(startIndex, endIndex);
  }, [currentPage, pageSize, filteredRooms]);

  const total = filteredRooms?.length || 0;

  return (
    <div className="col-lg-9">
      <div className="row">
        {paginatedRooms?.map((room) => (
          <div className="col-sm col-md-6 col-lg-4 ftco-animate" key={room.id}>
            <div className="room">
              <a
                className="img d-flex justify-content-center align-items-center"
                style={{ backgroundImage: `url(${room.hinhAnh})` }}
                onClick={() => {
                  navigate(`/detail/${room.id}`);
                }}
              >
                <div className="icon d-flex justify-content-center align-items-center">
                  <span className="icon-search2" />
                </div>
              </a>
              <div className="text p-3 text-center">
                <h3 className="mb-3 truncated-title">
                  <a href="rooms-single.html">{room.tenPhong}</a>
                </h3>
                <p>
                  <span className="price mr-2">{room.giaTien}</span>
                </p>
                <ul className="list">
                  <li>
                    <span>Guest:</span> {room.khach}
                  </li>
                  <li>
                    <span>Living room:</span> {room.phongNgu}
                  </li>
                  <li>
                    <span>Bathroom:</span> {room.phongTam}
                  </li>
                  <li>
                    <span>Bed:</span> {room.giuong}
                  </li>
                </ul>
                <hr />
                <p className="pt-1">
                  <a href="room-single.html" className="btn-custom">
                    Book Now <span className="icon-long-arrow-right" />
                  </a>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Pagination
        align="center"
        current={currentPage}
        total={total}
        pageSize={pageSize}
        onChange={handlePageChange}
      />
    </div>
  );
};

export default RoomAll;
