import React, { useEffect, useState } from "react";
import "../../../css/BookingCard.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { convertDateAndTime, getDataTextStorage } from "../../../util/utilMethod";
import { showNotification } from "../../../redux/reducers/notificationReducer";
import { Modal } from "antd";
import { useMutation } from "@tanstack/react-query";
import useRoute from "../../../hook/useRoute";
import { KhoaHocAPI } from "../../../util/fetchfromAPI";
import { newDate } from "react-datepicker/dist/date_utils";

interface BuyCardProps {
  price: number;
  totalComment: number;
  totalStars: number;
  KhoaHocData: KhoaHocData; // Ensure the KhoaHocData type is included
}

type KhoaHocData = {
  IDKhoaHoc: number;       
  TenKhoaHoc: string;     
  MoTaKhoaHoc: string;     
  HinhAnh: string;         
  Video: string;           
  NgayDang: string;
  LuotXem: number;         
  BiDanh: string;          
  MaNhom: string;          
  SoLuongHocVien: number;  
  GiamGia: number;    
  GiaTien: string;            
};

const BuyCard: React.FC<BuyCardProps> = ({
  price,
  totalComment,
  totalStars,
  KhoaHocData,
}) => {
  const { navigate } = useRoute();
  const dispatch = useDispatch();
  const { buyCard } = useSelector((state: RootState) => state.bookReducer);
  const { userLogin } = useSelector((state: RootState) => state.userReducer);

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState(3);
  const [days, setDays] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const mutationAddCourse = useMutation({
    mutationFn: (buyCourse: any) => KhoaHocAPI(buyCourse), // Adjust the parameters as per your API
    onSuccess: () => {
      dispatch(showNotification("Booking success"));
      navigate("/info-user");
    },
    onError: () => {
      dispatch(showNotification("Booking failed. Please try again."));
    },
  });

  const handleBooking = () => {
    if (userLogin) {
      setIsModalOpen(true);
    } else {
      dispatch(showNotification("Please login to buy course"));
    }
  };

  const handleOk = () => {
    if (userLogin && startDate && endDate) {
      const buyCourse = {
        maKhoaHoc: KhoaHocData.IDKhoaHoc, // Corrected the ID access
        ngayMua: convertDateAndTime(startDate.toString()),
        soLuongKhach: guests,
        maNguoiDung: userLogin?.user.IDNguoiDung, // Make sure this matches your user object
      };

      // Mutate to add the course booking
      mutationAddCourse.mutate(buyCourse);
      setIsModalOpen(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (BuyCard) {
      setStartDate(BuyCard.dateCheckIn || undefined);
      setEndDate(BuyCard.dateCheckOut || undefined);
      setGuests(BuyCard.totalGuest || 3);
    }
  }, [BuyCard]);

  useEffect(() => {
    const calculateDays = (start?: Date, end?: Date): number => {
      if (!start || !end) return 0;
      const diffTime = Math.abs(end.getTime() - start.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    setDays(calculateDays(startDate, endDate));
  }, [startDate, endDate]);

  return (
    <div className="booking-card">
      <div className="price-rating">
        <span className="price">{price}$</span>
        <span className="rating">
          <span className="rating-value">{totalStars} ♥ </span>
          <span className="rating-count">({totalComment} comment)</span>
        </span>
      </div>
      
      <button className="book-button" onClick={handleBooking}>
        Buy Course
      </button>
      <Modal
        title={`Are you sure you want to buy this Course?`}      
        open={isModalOpen}
        onOk={handleOk} 
        onCancel={handleCancel}
      >
        <p>
          {KhoaHocData.TenKhoaHoc} {/* Ensure this matches your KhoaHocData object */}
        </p>
        <p>
          Date buy: {convertDateAndTime(newDate?.toString())} 
        </p>
        <p>
          Course Price: {price}$
        </p>
      </Modal>
      <div className="cost-breakdown">
        <div className="total-cost">
          <span>Price before Voucher:</span>
          <span>{price}$</span>
        </div>
        
        <div className="total-cost">
          <span>Price after Voucher:</span>
          <span>{price * 0.8}$</span>
        </div>
      </div>
    </div>
  );
};

export default BuyCard;
