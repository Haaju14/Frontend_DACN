import { useParams } from "react-router-dom";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { roomApi } from "../../../service/room/roomApi";
import { locateApi } from "../../../service/locate/locateApi";
import Loading from "../Antd/Loading";
import {
  RoomData,
  LocateData,
  LocateError,
  CityData,
  CommentData,
  UserBookingRoomData,
} from "../../../Model/Model";
import Amenities from "./Amenities";
import BookingCard from "./BookingCard";
import CityMapComponent from "./CityMapComponent";
import Comments from "./Comment/Comments";
import { commentApi } from "../../../service/comment/commentApi";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import ReviewComponent from "./Comment/ReviewComponent";

const cities: CityData[] = [
  { name: "Hà Nội", latitude: 21.0285, longitude: 105.8542 },
  { name: "Hồ Chí Minh", latitude: 10.8231, longitude: 106.6297 },
  { name: "Đà Nẵng", latitude: 16.0471, longitude: 108.2068 },
  { name: "Hải Phòng", latitude: 20.8449, longitude: 106.6881 },
  { name: "Cần Thơ", latitude: 10.0452, longitude: 105.7469 },
  { name: "Nha Trang", latitude: 12.2388, longitude: 109.1967 },
  { name: "Huế", latitude: 16.4637, longitude: 107.5909 },
  { name: "Vũng Tàu", latitude: 10.3459, longitude: 107.0843 },
  { name: "Quy Nhơn", latitude: 13.782, longitude: 109.2198 },
  { name: "Buôn Ma Thuột", latitude: 12.6675, longitude: 108.0383 },
  { name: "Đà Lạt", latitude: 11.9404, longitude: 108.4583 },
  { name: "Thanh Hóa", latitude: 19.8075, longitude: 105.7745 },
  { name: "Vinh", latitude: 18.6796, longitude: 105.6813 },
  { name: "Phan Thiết", latitude: 10.9289, longitude: 108.1021 },
  { name: "Thái Nguyên", latitude: 21.5942, longitude: 105.8481 },
  { name: "Long Xuyên", latitude: 10.3714, longitude: 105.4352 },
  { name: "Rạch Giá", latitude: 10.0159, longitude: 105.1001 },
  { name: "Vị Thanh", latitude: 9.7846, longitude: 105.4701 },
  { name: "Đồng Hới", latitude: 17.4765, longitude: 106.5983 },
  { name: "Hòa Bình", latitude: 20.8186, longitude: 105.3384 },
];

const defaultRoomData: RoomData = {
  id: 0,
  tenPhong: "Unknown Room",
  khach: 0,
  phongNgu: 0,
  giuong: 0,
  phongTam: 0,
  moTa: "No description available.",
  giaTien: 0,
  mayGiat: false,
  banLa: false,
  tivi: false,
  dieuHoa: false,
  wifi: false,
  bep: false,
  doXe: false,
  hoBoi: false,
  banUi: false,
  maViTri: 0,
  hinhAnh: "",
};

const Detail: React.FC = () => {
  const params = useParams();

  const { id } = params;

  const { userLogin } = useSelector((state: RootState) => state.userReducer);

  const queryResultRoomByID: UseQueryResult<RoomData, LocateError> = useQuery({
    queryKey: ["roomByIDApi", id || ""],
    queryFn: () => roomApi.getRoomByID(id || ""),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const queryResultLocate: UseQueryResult<LocateData[], LocateError> = useQuery(
    {
      queryKey: ["locateListApi"],
      queryFn: locateApi.getLocate,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true,
    }
  );

  const queryResultCommentByMaPhong: UseQueryResult<
    CommentData[],
    LocateError
  > = useQuery({
    queryKey: [
      "commentListByMaPhongApi",
      queryResultRoomByID.data?.id.toString() || "",
    ],
    queryFn: () =>
      commentApi.getCommentByMaPhong(
        queryResultRoomByID.data?.id.toString() || ""
      ),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const queryResultBookingRoomByUser: UseQueryResult<
    UserBookingRoomData[],
    LocateError
  > = useQuery({
    queryKey: ["getBookingRoomByUser", userLogin?.user.id || ""],
    queryFn: () =>
      roomApi.getBookingRoomByUser(userLogin?.user.id.toString() || ""),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  if (
    queryResultRoomByID.isLoading ||
    queryResultLocate.isLoading ||
    queryResultCommentByMaPhong.isLoading ||
    queryResultBookingRoomByUser.isLoading
  ) {
    return <Loading />;
  }

  if (
    queryResultRoomByID.error &&
    queryResultLocate.isError &&
    queryResultCommentByMaPhong.isError &&
    queryResultBookingRoomByUser.isError
  ) {
    return (
      <div>
        Error: {queryResultRoomByID.error.message}
        {queryResultLocate.error.message}
        {queryResultCommentByMaPhong.error.message}
      </div>
    );
  }

  const getCityName = queryResultLocate.data?.find(
    (a) => a.id === queryResultRoomByID.data?.maViTri
  )?.tinhThanh;

  const getCityIndex = (
    cityName: string | undefined,
    cities: CityData[]
  ): number => {
    const collator = new Intl.Collator("vi", { sensitivity: "base" });
    return cities.findIndex(
      (city) => collator.compare(city.name, cityName ?? "") === 0
    );
  };

  const cityIndex = getCityIndex(getCityName, cities);

  const totalComment = queryResultCommentByMaPhong.data?.length || 0;

  const getStarsAvg = () => {
    if (!queryResultCommentByMaPhong.data) {
      return 0;
    }

    return queryResultCommentByMaPhong.data.reduce(
      (acc, comment) => acc + comment.saoBinhLuan,
      0
    );
  };

  const totalStars = getStarsAvg();

  const isBooking =
    queryResultBookingRoomByUser?.data?.findIndex(
      (a) => a.maPhong.toString() === id
    ) != -1;

  const idBooking = queryResultBookingRoomByUser?.data?.find(
    (a) => a.maPhong.toString() === id
  )?.id;

  const renderComment = () => {
    if (userLogin) {
      return (
        <div className="col-md-12">
          <ReviewComponent
            maPhong={queryResultRoomByID.data?.id.toString() || ""}
          />
        </div>
      );
    } else {
      return (
        <div className="alert alert-warning" role="alert">
          Login required to comment
        </div>
      );
    }
  };

  return (
    <section className="ftco-section">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <div className="row">
              <div className="col-md-12 ftco-animate">
                <h2 className="mb-4">{queryResultRoomByID.data?.tenPhong}</h2>
                <div className="single-slider owl-carousel">
                  <div className="item">
                    <div
                      className="room-img"
                      style={{
                        backgroundImage: `url(${queryResultRoomByID.data?.hinhAnh})`,
                      }}
                    />
                  </div>
                  <div className="item">
                    <div
                      className="room-img"
                      style={{
                        backgroundImage: `url(${queryResultRoomByID.data?.hinhAnh})`,
                      }}
                    />
                  </div>
                  <div className="item">
                    <div
                      className="room-img"
                      style={{
                        backgroundImage: `url(${queryResultRoomByID.data?.hinhAnh})`,
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-12 room-single mt-4 ftco-animate">
                <p>{queryResultRoomByID.data?.moTa}</p>
                <div className="d-md-flex mt-5 mb-5">
                  <ul className="list">
                    <li>
                      <span>Persons:</span> {queryResultRoomByID.data?.khach}
                    </li>
                    <li>
                      <span>Bed:</span> {queryResultRoomByID.data?.giuong}
                    </li>
                  </ul>
                  <ul className="list ml-md-5">
                    <li>
                      <span>Living room:</span>{" "}
                      {queryResultRoomByID.data?.phongNgu}
                    </li>
                    <li>
                      <span>Bathroom:</span>{" "}
                      {queryResultRoomByID.data?.phongTam}
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-md-12 room-single ftco-animate mb-5 mt-4">
                <h3 className="mb-4">The location</h3>
                <CityMapComponent city={cities[cityIndex]} />
              </div>
              <div className="col-md-12 properties-single ftco-animate mb-5 mt-4">
                <Amenities />
              </div>
              {renderComment()}
              <div className="col-md-12 room-single ftco-animate mb-5 mt-5">
                <Comments comments={queryResultCommentByMaPhong.data || []} />
              </div>
            </div>
          </div>
          <div className="col-lg-4 sidebar ftco-animate">
            <BookingCard
              price={queryResultRoomByID.data?.giaTien || 0}
              totalComment={totalComment}
              totalStars={totalStars}
              roomData={queryResultRoomByID.data || defaultRoomData}
              isBooking={isBooking}
              idBooking={idBooking?.toString() || ""}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Detail;
