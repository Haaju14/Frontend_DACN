import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { userApi } from "../../../service/user/userApi";
import { roomApi } from "../../../service/room/roomApi";
import Loading from "../Antd/Loading";
import { UserData, RoomData, LocateError } from "../../../Model/Model";

const SectionNumber: React.FC = () => {
  const queryResultUser: UseQueryResult<UserData[], LocateError> = useQuery({
    queryKey: ["userListApi"],
    queryFn: userApi.getUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });

  const queryResultRoom: UseQueryResult<RoomData[], LocateError> = useQuery({
    queryKey: ["roomListApi"],
    queryFn: roomApi.getRoom,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });

  if (queryResultUser.isLoading || queryResultRoom.isLoading) {
    return <Loading />;
  }

  if (queryResultUser.error && queryResultRoom.error) {
    return (
      <div>
        Error: {queryResultUser.error.message} {queryResultRoom.error.message}
      </div>
    );
  }

  const countUser =
    queryResultUser.data?.filter((a) => a.role === "USER").length || 0;
  const countAdmin =
    queryResultUser.data?.filter((a) => a.role === "ADMIN").length || 0;
  const countRoom = queryResultRoom.data?.length || 0;

  return (
    <section
      className="ftco-section ftco-counter img"
      id="section-counter"
      style={{ backgroundImage: "url(user/images/bg_1.jpg)" }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="row">
              <div className="col-md-4 d-flex justify-content-center counter-wrap ftco-animate">
                <div className="block-18 text-center">
                  <div className="text">
                    <strong className="number counter" data-number={6189}>
                      {countUser}
                    </strong>
                    <span>Students</span>
                  </div>
                </div>
              </div>
              <div className="col-md-4 d-flex justify-content-center counter-wrap ftco-animate">
                <div className="block-18 text-center">
                  <div className="text">
                    <strong className="number counter" data-number={875}>
                      {countRoom}
                    </strong>
                    <span>Course</span>
                  </div>
                </div>
              </div>
              <div className="col-md-4 d-flex justify-content-center counter-wrap ftco-animate">
                <div className="block-18 text-center">
                  <div className="text">
                    <strong className="number counter" data-number={285}>
                      {countAdmin}
                    </strong>
                    <span>Teacher</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionNumber;
