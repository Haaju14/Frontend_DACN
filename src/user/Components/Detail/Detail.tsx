import { useParams } from "react-router-dom";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import Loading from "../Antd/Loading";
import Amenities from "./Amenities";
import Comments from "./Comment/Comments";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import ReviewComponent from "./Comment/ReviewComponent";
import { getCourseDetailAPI } from "../../../util/fetchfromAPI";

interface KhoaHocData  {
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

const Detail: React.FC = () => {
  
  const params = useParams();
  const { id } = params;
  const { userLogin } = useSelector((state: RootState) => state.userReducer);

   // Query for KhoaHoc by ID
   const queryResultKhoaHocByID: UseQueryResult<KhoaHocData> = useQuery({
    queryKey: ["courseByIDApi", id || ""],
    queryFn: () => getCourseDetailAPI(id || ""),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

   // Loading state
   if (queryResultKhoaHocByID.isLoading) {
    return <Loading />;
  }

  // Error handling
  if (queryResultKhoaHocByID.error) {
    return (
      <div>
        Error: {queryResultKhoaHocByID.error.message}
      </div>
    );
  }

  // Extract KhoaHoc data
  const KhoaHocData = queryResultKhoaHocByID.data;






  function RenderComment(): import("react").ReactNode {
    throw new Error("Function not implemented.");
  }

  return (
    <section className="ftco-section">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <div className="row">
              <div className="col-md-12 ftco-animate">
                <h2 className="mb-4">{KhoaHocData?.TenKhoaHoc}</h2> {/* Changed to tenKhoaHoc */}
                <div className="single-slider owl-carousel">
                  <div className="item">
                    <div
                      className="course-img"
                      style={{
                        backgroundImage: `url(${KhoaHocData?.HinhAnh})`, // Changed to course
                      }}
                    />
                  </div>
                  {/* Repeated images can be handled by mapping over an array if needed */}
                </div>
              </div>
              <div className="col-md-12 course-single mt-4 ftco-animate">
                <p>{KhoaHocData?.MoTaKhoaHoc}</p> {/* Changed to moTa */}
                <div className="d-md-flex mt-5 mb-5">
                  <ul className="list">
                    <li>
                      <span>Participants:</span> {KhoaHocData?.SoLuongHocVien} {/* Changed to Participants */}
                    </li>
                    <li>
                      <span>Duration:</span> {KhoaHocData?.NgayDang} {/* Example change; adjust as needed */}
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* <div className="col-md-12 properties-single ftco-animate mb-5 mt-4">
                <Amenities />
              </div> */}
              {RenderComment()}
              {/*<div className="col-md-12 course-single ftco-animate mb-5 mt-5">
                <Comments comments={queryResultCommentByMaKhoa.data || []} /> {/* Adjust if necessary */}
              {/*</div>*/}
            </div>
          </div>
          {/* <div className="col-lg-4 sidebar ftco-animate">
            <BuyCard
              price={KhoaHocData?.GiaTien} 
              // totalComment={totalComment} 
              // totalStars={totalStars} 
              // khoaHocData={KhoaHocData || defualtKhoaHocData} 
            />
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default Detail;
