import React, { useState, useMemo } from "react";
import { Pagination } from "antd";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { roomApi } from "../../../service/room/roomApi";
import Loading from "../Antd/Loading";
import {
  RoomData,
  LocateError,
  LocatePriceRangeProps,
} from "../../../Model/Model";
import "react-datepicker/dist/react-datepicker.css";
import useRoute from "../../../hook/useRoute";

const RoomByLocate: React.FC<LocatePriceRangeProps> = ({
  priceRange,
  maViTri,
}) => {
  const { navigate } = useRoute();

  const [currentPage, setCurrentPage] = useState<number>(1);

  const queryResultRoomByMaViTri: UseQueryResult<RoomData[], LocateError> =
    useQuery({
      queryKey: ["roomByMaViTriListApi", maViTri.toString() || ""],
      queryFn: () => roomApi.getRoomByMaViTri(maViTri.toString() || ""),
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true,
    });

  const pageSize = 6;

  const rooms = queryResultRoomByMaViTri.data;

  const filteredRooms = useMemo(() => {
    if (!rooms) return [];
    return rooms.filter((room) => {
      const isWithinPriceRange =
        room.giaTien >= priceRange[0] && room.giaTien <= priceRange[1];
      const isLocationMatch = maViTri
        ? room.maViTri.toString() === maViTri
        : true;
      return isWithinPriceRange && isLocationMatch;
    });
  }, [rooms, priceRange, maViTri]);

  const paginatedRooms = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredRooms.slice(startIndex, endIndex);
  }, [currentPage, pageSize, filteredRooms]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (queryResultRoomByMaViTri.isLoading) {
    return <Loading />;
  }

  if (queryResultRoomByMaViTri.isError) {
    return <div>Error: {queryResultRoomByMaViTri.error?.message}</div>;
  }

  const total = filteredRooms.length;

  return (
    <div className="col-lg-9">
      <div className="row">
        {paginatedRooms.map((room) => (
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

export default RoomByLocate;
