import React, { useEffect, useState } from "react";
import "../../../css/BookingCard.css";
import { BookingRoomData, BookingCardProps } from "../../../Model/Model";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { convertDateAndTime } from "../../../util/utilMethod";
import { showNotification } from "../../../redux/reducers/notificationReducer";
import { DatePicker, Modal } from "antd";
import { useMutation } from "@tanstack/react-query";
import { roomApi } from "../../../service/room/roomApi";
import useRoute from "../../../hook/useRoute";

const BookingCard: React.FC<BookingCardProps> = ({
  price,
  totalComment,
  totalStars,
  roomData,
  isBooking,
  idBooking,
}) => {
  const { navigate } = useRoute();
  const dispatch = useDispatch();

  const { bookingData } = useSelector((state: RootState) => state.bookReducer);
  const { userLogin } = useSelector((state: RootState) => state.userReducer);

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState(3);
  const [days, setDays] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const mutationAddBookingRoom = useMutation({
    mutationFn: roomApi.addBookingRoom,
    onSuccess: () => {},
    onError: () => {},
  });

  const mutationUpdateBookingRoom = useMutation({
    mutationFn: (data: { bookingRoom: object; id: string }) =>
      roomApi.updateBookingRoom(data.bookingRoom, data.id),
    onSuccess: () => {},
    onError: () => {},
  });

  const incrementGuests = () => setGuests(guests + 1);
  const decrementGuests = () => setGuests(Math.max(1, guests - 1));

  const formatDate = (date?: Date) =>
    date ? convertDateAndTime(date.toString()) : "";

  const handleBooking = () => {
    if (userLogin) {
      setIsModalOpen(true);
    } else {
      dispatch(showNotification("Please login to buy course"));
    }
  };

  const handleOk = () => {
    if (userLogin && startDate && endDate) {
      const bookingRoom: BookingRoomData = {
        maPhong: roomData.id,
        ngayDen: convertDateAndTime(startDate.toString()),
        ngayDi: convertDateAndTime(endDate.toString()),
        soLuongKhach: guests,
        maNguoiDung: userLogin?.user.id,
      };

      if (!isBooking) {
        mutationAddBookingRoom.mutate(bookingRoom);
      } else {
        mutationUpdateBookingRoom.mutate({
          bookingRoom,
          id: idBooking,
        });
      }
      setIsModalOpen(false);

      dispatch(
        showNotification(
          !isBooking ? "Booking success" : "Update booking success"
        )
      );

      navigate("/info-user");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (bookingData) {
      setStartDate(bookingData.dateCheckIn || undefined);
      setEndDate(bookingData.dateCheckOut || undefined);
      setGuests(bookingData.totalGuest || 3);
    }
  }, [bookingData]);

  useEffect(() => {
    const calculateDays = (start?: Date, end?: Date): number => {
      const dateStart = new Date(start || "");
      const dateEnd = new Date(end || "");

      if (!dateStart || !dateEnd) return 0;
      const diffTime = Math.abs(dateEnd.getTime() - dateStart.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    if (startDate && endDate) {
      setDays(calculateDays(startDate, endDate));
    } else {
      setDays(0);
    }
  }, [startDate, endDate]);

  return (
    <div className="booking-card">
      <div className="price-rating">
        <span className="price">{price}$</span>
        <span className="rating">
          <span className="rating-value">{totalStars}♥ </span>
          <span className="rating-count">({totalComment} comment)</span>
        </span>
      </div>
      
      <button className="book-button" onClick={handleBooking}>
        Buy Course
      </button>
      <Modal
        title={`Are you sure you want to buy this Course? `}      
        open={isModalOpen}
        onOk={handleOk} 
        onCancel={handleCancel}
      >
        <p>
          {roomData.tenPhong}
        </p>
        <p>
          Date buy: {formatDate(startDate)} 
        </p>
        <p>
          Course Price: {price}$
        </p>
      </Modal>
      <div className="cost-breakdown">

        <div className="total-cost">
          <span>Price before Voucher:</span>
          <span>{price  }$</span>
        </div>
        
        <div className="total-cost">
          <span>Price after Voucher:</span>
          <span>{price  * 0.8}$</span>
        </div>

      </div>
    </div>
  );
};

export default BookingCard;
