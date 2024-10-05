import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { locateApi } from "../../../service/locate/locateApi";
import Loading from "../Antd/Loading";
import { LocateData, BookingData, LocateError } from "../../../Model/Model";
import { useSelector, useDispatch } from "react-redux";
import { editBooking } from "../../../redux/reducers/bookReducer";
import { RootState } from "../../../redux/store";
import useRoute from "../../../hook/useRoute";

const Booking: React.FC = () => {
  const dispatch = useDispatch();
  const { navigate } = useRoute();

  const { bookingData } = useSelector((state: RootState) => state.bookReducer);

  const queryResultLocate: UseQueryResult<LocateData[], LocateError> = useQuery(
    {
      queryKey: ["locateListApi"],
      queryFn: locateApi.getLocate,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: true,
    }
  );

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState(3);
  const [selectedLocate, setSelectedLocate] = useState<string | undefined>(
    undefined
  );

  const increaseGuests = () => {
    setGuests(guests + 1);
  };

  const decreaseGuests = () => {
    if (guests > 1) setGuests(guests - 1);
  };

  const handleBooking = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (startDate && endDate && selectedLocate) {
      const booking: BookingData = {
        dateCheckIn: startDate,
        dateCheckOut: endDate,
        idLocate: parseInt(selectedLocate),
        totalGuest: guests,
      };
      dispatch(editBooking(booking));

      navigate("/room");
    }
  };

  useEffect(() => {
    if (bookingData) {
      setStartDate(bookingData.dateCheckIn);
      setEndDate(bookingData.dateCheckOut);
      setSelectedLocate(bookingData.idLocate.toString());
      setGuests(bookingData.totalGuest);
    }
  }, []);

  if (queryResultLocate.isLoading) {
    return <Loading />;
  }

  if (queryResultLocate.error) {
    return <div>Error: {queryResultLocate.error.message}</div>;
  }

  return (
    <section className="ftco-booking">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <form action="#" className="booking-form" onSubmit={handleBooking}>
              <div className="row">
                <div className="col-md-3 d-flex">
                  <div className="form-group p-4 align-self-stretch d-flex align-items-end">
                    <div className="wrap">
                      <label htmlFor="#">Check-in Date</label>
                      <DatePicker
                        selected={startDate}
                        onChange={(date: Date | null) =>
                          setStartDate(date ?? undefined)
                        }
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        className="form-control"
                        placeholderText="Check-in date"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-3 d-flex">
                  <div className="form-group p-4 align-self-stretch d-flex align-items-end">
                    <div className="wrap">
                      <label htmlFor="#">Check-out Date</label>
                      <DatePicker
                        selected={endDate}
                        onChange={(date: Date | null) =>
                          setEndDate(date ?? undefined)
                        }
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        className="form-control"
                        placeholderText="Check-out date"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md d-flex">
                  <div className="form-group p-4 align-self-stretch d-flex align-items-end">
                    <div className="wrap">
                      <label htmlFor="#">Locate</label>
                      <div className="form-field">
                        <div className="select-wrap">
                          <div className="icon">
                            <span className="ion-ios-arrow-down" />
                          </div>
                          <select
                            name=""
                            id=""
                            className="form-control"
                            value={selectedLocate}
                            onChange={(e) => setSelectedLocate(e.target.value)}
                          >
                            <option value="">Select a location</option>
                            {queryResultLocate.data?.map((locate) => (
                              <option
                                key={locate.id}
                                value={locate.id.toString()}
                              >
                                {locate.tinhThanh}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md d-flex">
                  <div className="customer form-group p-4 align-self-stretch d-flex align-items-end">
                    <div className="wrap">
                      <label style={{ paddingBottom: "15px" }}>Guest</label>
                      <div className="form-field">
                        <div className="select-wrap">
                          <div className="guest-counter">
                            <div className="counter-wrap">
                              <div
                                className="counter-button"
                                onClick={decreaseGuests}
                              >
                                -
                              </div>
                              <span>{guests}</span>
                              <div
                                className="counter-button"
                                onClick={increaseGuests}
                              >
                                +
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md d-flex">
                  <div className="form-group d-flex align-self-stretch">
                    <input
                      type="submit"
                      defaultValue="Check Availability"
                      className="btn btn-primary py-3 px-4 align-self-stretch"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Booking;
