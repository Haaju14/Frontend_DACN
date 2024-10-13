import React from "react";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { roomApi } from "../../../service/room/roomApi";
import Loading from "../Antd/Loading";
import { RoomData, LocateError } from "../../../Model/Model";
import useRoute from "../../../hook/useRoute";
import { NavLink } from "react-router-dom";

const SectionOurRoom: React.FC = () => {
  const { navigate } = useRoute();

  const queryResult: UseQueryResult<RoomData[], LocateError> = useQuery({
    queryKey: ["roomListApi"],
    queryFn: roomApi.getRoom,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });

  if (queryResult.isLoading) {
    return <Loading />;
  }

  if (queryResult.error) {
    return <div>Error: {queryResult.error.message}</div>;
  }

  const top6Result = queryResult.data?.slice(0, 6);

  return (
    <section className="ftco-section bg-light">
      <div className="container">
        <div className="row justify-content-center mb-5 pb-3">
          <div className="col-md-7 heading-section text-center ftco-animate">
            <h2 className="mb-4">Our Course</h2>
          </div>
        </div>
        <div className="row">
          {top6Result?.map((room) => (
            <div
              key={room.id}
              className="col-sm col-md-6 col-lg-4 ftco-animate"
            >
              <div className="room">
                <NavLink
                  to={`/detail/${room.id}`}
                  className="img d-flex justify-content-center align-items-center"
                  style={{ backgroundImage: `url(${room.hinhAnh})` }}                  
                >
                  <div className="icon d-flex justify-content-center align-items-center">
                    <span className="icon-search2" />
                  </div>
                </NavLink>                
                <div className="text p-3 text-center">
                  <h3 className="mb-3 truncated-title">
                    <NavLink
                      to={`/detail/${room.id}`}> {room.tenPhong}
                    </NavLink>
                  </h3>
                  <p>
                    <span className="price mr-2">{room.giaTien}</span>
                  </p>
                  <hr />
                  <p className="pt-1 truncated-text">
                    <NavLink to={`/detail/${room.id}`} className="btn-custom">
                      {room.moTa}
                    </NavLink>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectionOurRoom;
