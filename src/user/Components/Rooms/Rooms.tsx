import React, { useState, useEffect } from "react";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { locateApi } from "../../../service/locate/locateApi";
import Loading from "../Antd/Loading";
import { LocateData, LocateError, BookingData } from "../../../Model/Model";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import RangeSliderComponent from "./RangeSliderComponent";
import { RootState } from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { editBooking } from "../../../redux/reducers/bookReducer";
import RoomByLocate from "./RoomByLocate";
import RoomAll from "./RoomAll";

type Props = {};

const Rooms: React.FC<Props> = () => {
  const dispatch = useDispatch();

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState<number>(3);
  const [selectedLocation, setSelectedLocation] = useState<string | undefined>(
    undefined
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const { bookingData } = useSelector((state: RootState) => state.bookReducer);

  const increaseGuests = () => {
    setGuests((prev) => prev + 1);
  };

  const decreaseGuests = () => {
    setGuests((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const queryResultLocate: UseQueryResult<LocateData[], LocateError> = useQuery(
    {
      queryKey: ["locateListApi"],
      queryFn: locateApi.getLocate,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: true,
    }
  );

  useEffect(() => {
    if (bookingData) {
      setStartDate(bookingData.dateCheckIn || undefined);
      setEndDate(bookingData.dateCheckOut || undefined);
      setSelectedLocation(bookingData.idLocate?.toString() || undefined);
      setGuests(bookingData.totalGuest || 3);
    }
  }, []);

  useEffect(() => {
    updateDataSearch();
  }, [startDate, endDate, selectedLocation, guests]);

  const updateDataSearch = () => {
    if (startDate && endDate && selectedLocation) {
      const booking: BookingData = {
        dateCheckIn: startDate,
        dateCheckOut: endDate,
        idLocate: parseInt(selectedLocation),
        totalGuest: guests,
      };
      dispatch(editBooking(booking));
    }
  };

  const locations = queryResultLocate.data;

  const handlePriceRangeChange = (newRange: [number, number]) => {
    setPriceRange(newRange);
  };

  const handleLocationChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedLocation(event.target.value);
  };

  if (queryResultLocate.isLoading) {
    return <Loading />;
  }

  if (queryResultLocate.isError) {
    return (
      <div>
        Error:
        {queryResultLocate.error?.message}
      </div>
    );
  }

  const renderRoom = () => {
    if (selectedLocation) {
      return (
        <RoomByLocate priceRange={priceRange} maViTri={selectedLocation} />
      );
    } else {
      return <RoomAll priceRange={priceRange} />;
    }
  };

  return (
    <section className="ftco-section bg-light">
      <div className="container">
        <div className="row">
          {renderRoom()}

          <div className="col-lg-3 sidebar">
            <div className="sidebar-wrap bg-light ftco-animate">
              <form action="#">
                <div className="fields">
                  <div className="form-group">
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
                  <div className="form-group">
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
                  <h3 className="heading mb-4">Advanced Search</h3>
                  <div className="form-group">
                    <div className="select-wrap one-third">
                      <div className="icon">
                        <span className="ion-ios-arrow-down" />
                      </div>
                      <select
                        name=""
                        id=""
                        className="form-control"
                        value={selectedLocation}
                        onChange={handleLocationChange}
                      >
                        <option value="">All Locations</option>
                        {locations?.map((locate) => (
                          <option key={locate.id} value={locate.id.toString()}>
                            {locate.tinhThanh}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="select-wrap one-third">
                      <div className="guest-counter customer">
                        <div
                          className="counter-wrap"
                          style={{ padding: "0 75px" }}
                        >
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
                  <div className="form-group">
                    <RangeSliderComponent onChange={handlePriceRangeChange} />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Rooms;
