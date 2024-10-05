export interface LocateData {
  id: number;
  tenViTri: string;
  tinhThanh: string;
  quocGia: string;
  hinhAnh: string;
}

export interface RoomData {
  id: number;
  tenPhong: string;
  khach: number;
  phongNgu: number;
  giuong: number;
  phongTam: number;
  moTa: string;
  giaTien: number;
  mayGiat: boolean;
  banLa: boolean;
  tivi: boolean;
  dieuHoa: boolean;
  wifi: boolean;
  bep: boolean;
  doXe: boolean;
  hoBoi: boolean;
  banUi: boolean;
  maViTri: number;
  hinhAnh: string;
}

export interface UserData {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  birthday: string;
  avatar: string;
  gender: boolean;
  role: string;
}

export interface CityData {
  name: string;
  latitude: number;
  longitude: number;
}

export interface CommentData {
  id: number;
  ngayBinhLuan: Date;
  noiDung: string;
  saoBinhLuan: number;
  tenNguoiBinhLuan: string;
  avatar: string;
}

export interface BookingData {
  dateCheckIn: Date;
  dateCheckOut: Date;
  idLocate: number;
  totalGuest: number;
}

export interface CommentUserData {
  id?: number;
  maPhong: string;
  maNguoiBinhLuan: number;
  ngayBinhLuan: string;
  noiDung: string;
  saoBinhLuan: number;
}

export interface BookingRoomData {
  id?: number;
  maPhong: number;
  ngayDen: string;
  ngayDi: string;
  soLuongKhach: number;
  maNguoiDung: number;
}

export interface UserBookingRoomData {
  id: number;
  maPhong: number;
  ngayDen: Date;
  ngayDi: Date;
  soLuongKhach: number;
  maNguoiDung: number;
}

export interface UserLogin {
  user: UserData;
  token: string;
}

export interface LocateError {
  message: string;
}

export interface RangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

export interface BookingCardProps {
  price: number;
  totalComment: number;
  totalStars: number;
  roomData: RoomData;
  isBooking: boolean;
  idBooking: string;
}

export interface CityMapProps {
  city: CityData;
}

export interface PriceRangeProps {
  priceRange: [number, number];
}

export interface LocatePriceRangeProps {
  priceRange: [number, number];
  maViTri: string;
}

export interface ProfileProps {
  user: UserData;
}

export interface RoomProps {
  userBookingRoomData: UserBookingRoomData;
}

export interface UserProfileProps {
  id: number;
  name: string;
  email: string;
  phone: string;
  birthday: string;
  gender: boolean;
  role: string;
}

export interface CommentsProps {
  comments: CommentData[];
}

export interface ReviewComponentProps {
  maPhong: string;
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  phone: string;
  birthday: string;
  gender: boolean;
}

export interface AvatarReducerType {
  avatar: string;
  userName: string;
}

export interface BookingReducerType {
  bookingData: BookingData | null;
}

export interface NotificationState {
  visible: boolean;
  message: string;
}

export interface UserReducerType {
  userLogin: UserLogin | null;
}
