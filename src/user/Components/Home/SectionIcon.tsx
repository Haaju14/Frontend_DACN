import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { locateApi } from "../../../service/locate/locateApi";
import Loading from "../Antd/Loading";
import { BookingData, LocateData, LocateError } from "../../../Model/Model";
import { useDispatch, useSelector } from "react-redux";
import useRoute from "../../../hook/useRoute";
import { RootState } from "../../../redux/store";
import { editBooking } from "../../../redux/reducers/bookReducer";

const SectionIcon: React.FC = () => {
  const dispatch = useDispatch();
  const { navigate } = useRoute();

  const { bookingData } = useSelector((state: RootState) => state.bookReducer);

  const queryResult: UseQueryResult<LocateData[], LocateError> = useQuery({
    queryKey: ["locateListApi"],
    queryFn: locateApi.getLocate,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });

  if (queryResult.isLoading) {
    return <Loading />;
  }

  if (queryResult.error) {
    return <div>Error: {queryResult.error.message}</div>;
  }

  const top4Result = queryResult.data?.slice(0, 4);

  const handleTinhThanh = (id: number) => {
    if (id) {
      const booking: BookingData = {
        dateCheckIn: bookingData?.dateCheckIn || new Date(),
        dateCheckOut: bookingData?.dateCheckOut || new Date(),
        idLocate: id,
        totalGuest: bookingData?.totalGuest || 0,
      };
      dispatch(editBooking(booking));

      navigate("/room");
    }
  };

  return (
    <section className="ftco-section">
      <div className="container d-flex justify-content-center">
        <div className="row d-flex justify-content-center">
          {top4Result?.map((locate) => (
            <div
              key={locate.id}
              className="col-md-3 d-flex align-self-stretch ftco-animate"
            >
              <div
                className="media block-6 services py-4 d-block text-center"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  handleTinhThanh(locate.id);
                }}
              >
                <div className="d-flex justify-content-center">
                  <div className="icon d-flex align-items-center justify-content-center">
                    <img
                      src={locate.hinhAnh}
                      alt=""
                      style={{
                        width: 100,
                        height: 100,
                        borderRadius: 10,
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                      }}
                    />
                  </div>
                </div>
                <div className="media-body p-2 mt-2">
                  <h3 className="heading mb-3">{locate.tinhThanh}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectionIcon;
