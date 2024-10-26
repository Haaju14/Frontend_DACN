// import React from "react";
// import { NavLink, useNavigate } from "react-router-dom";

// interface KhoaHocData {
//   IDKhoaHoc: number;
//   TenKhoaHoc: string;
//   MoTaKhoaHoc: string;
//   HinhAnh: string;
//   Video: string;
//   NgayDang: string;
//   LuotXem: number;
//   GiamGia: number;
//   GiaTien: string;
//   LoaiKhoaHoc: string;
// }

// interface NhanXetData {
//   IDNhanXet: number;
//   IDKhoaHoc: number;
//   XepLoai: string; // "Tichcuc" hoặc "Tieucuc"
// }

// // Dữ liệu khóa học mẫu
// const courses: KhoaHocData[] = [
//   // Dữ liệu khóa học ở đây
// ];

// // Dữ liệu nhận xét mẫu
// const reviews: NhanXetData[] = [
//   // Dữ liệu nhận xét ở đây
// ];

// const SectionNumber: React.FC = () => {
//   const navigate = useNavigate();

//   // Phân loại các khóa học
//   const paidCourses = courses.filter((course) => course.GiaTien !== "0");
//   const freeCourses = courses.filter((course) => course.GiaTien === "0");

//   // Tính điểm xếp loại cho mỗi khóa học
//   const coursesWithRating = courses.map((course) => {
//     const courseReviews = reviews.filter(
//       (review) => review.IDKhoaHoc === course.IDKhoaHoc
//     );
//     const ratingScore = courseReviews.reduce(
//       (acc, review) => acc + (review.XepLoai === "Tichcuc" ? 1 : -1),
//       0
//     );
//     return { ...course, ratingScore };
//   });

//   // Sắp xếp khóa học theo xếp loại
//   const sortedCoursesByRating = [...coursesWithRating].sort(
//     (a, b) => b.ratingScore - a.ratingScore
//   );

//   // Lấy top 5 khóa học (hot) và top 6-10 khóa học (trending)
//   const hotCourses = sortedCoursesByRating.slice(0, 5); // Top 1-5
//   const trendingCourses = sortedCoursesByRating.slice(5, 10); // Top 6-10

//   return (
//     <section className="ftco-section">
//       <div className="container">
        
//         {/* Danh sách khóa học Trả phí */}
//         <h3 className="text-center mb-4">
//           <NavLink
//             to="/khoa-hoc-tra-phi"
//             target="_blank"
//             rel="noopener noreferrer"
//             style={{ cursor: "pointer" }}
//           >
//             Khóa học Trả phí
//           </NavLink>
//         </h3>
//         <div className="row">
//           {paidCourses.map((khoaHoc) => (
//             <div key={khoaHoc.IDKhoaHoc} className="col-md-3 d-flex align-self-stretch ftco-animate">
//               <div className="media block-6 services py-4 d-block text-center">
//                 <div className="d-flex justify-content-center">
//                   <img src={khoaHoc.HinhAnh} alt={khoaHoc.TenKhoaHoc} style={{ width: 100, height: 100, borderRadius: 10 }} />
//                 </div>
//                 <div className="media-body p-2 mt-2">
//                   <h3 className="heading mb-3">{khoaHoc.TenKhoaHoc}</h3>
//                   <p>{khoaHoc.MoTaKhoaHoc}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Danh sách khóa học Miễn phí */}
//         <h3 className="text-center mb-4 mt-5">
//           <a
//             href="/khoa-hoc-mien-phi"
//             target="_blank"
//             rel="noopener noreferrer"
//             style={{ cursor: "pointer" }}
//           >
//             Khóa học Miễn phí
//           </a>
//         </h3>
//         <div className="row">
//           {freeCourses.map((khoaHoc) => (
//             <div key={khoaHoc.IDKhoaHoc} className="col-md-3 d-flex align-self-stretch ftco-animate">
//               <div className="media block-6 services py-4 d-block text-center">
//                 <div className="d-flex justify-content-center">
//                   <img src={khoaHoc.HinhAnh} alt={khoaHoc.TenKhoaHoc} style={{ width: 100, height: 100, borderRadius: 10 }} />
//                 </div>
//                 <div className="media-body p-2 mt-2">
//                   <h3 className="heading mb-3">{khoaHoc.TenKhoaHoc}</h3>
//                   <p>{khoaHoc.MoTaKhoaHoc}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Danh sách khóa học Hot */}
//         <h3 className="text-center mb-4 mt-5">
//           <NavLink
//             to="/khoa-hoc/hot"
//             target="_blank"
//             rel="noopener noreferrer"
//             style={{ cursor: "pointer" }}
//           >
//             Khóa học Hot (Top 1-5)
//           </NavLink>
//         </h3>
//         <div className="row">
//           {hotCourses.map((khoaHoc) => (
//             <div key={khoaHoc.IDKhoaHoc} className="col-md-3 d-flex align-self-stretch ftco-animate">
//               <div className="media block-6 services py-4 d-block text-center">
//                 <div className="d-flex justify-content-center">
//                   <img src={khoaHoc.HinhAnh} alt={khoaHoc.TenKhoaHoc} style={{ width: 100, height: 100, borderRadius: 10 }} />
//                 </div>
//                 <div className="media-body p-2 mt-2">
//                   <h3 className="heading mb-3">{khoaHoc.TenKhoaHoc}</h3>
//                   <p>{khoaHoc.MoTaKhoaHoc}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Danh sách khóa học Xu hướng */}
//         <h3 className="text-center mb-4 mt-5">
//           <NavLink
//             to="/khoa-hoc/trending"
//             target="_blank"
//             rel="noopener noreferrer"
//             style={{ cursor: "pointer" }}
//           >
//             Khóa học Xu hướng (Top 6-10)
//           </NavLink>
//         </h3>
//         <div className="row">
//           {trendingCourses.map((khoaHoc) => (
//             <div key={khoaHoc.IDKhoaHoc} className="col-md-3 d-flex align-self-stretch ftco-animate">
//               <div className="media block-6 services py-4 d-block text-center">
//                 <div className="d-flex justify-content-center">
//                   <img src={khoaHoc.HinhAnh} alt={khoaHoc.TenKhoaHoc} style={{ width: 100, height: 100, borderRadius: 10 }} />
//                 </div>
//                 <div className="media-body p-2 mt-2">
//                   <h3 className="heading mb-3">{khoaHoc.TenKhoaHoc}</h3>
//                   <p>{khoaHoc.MoTaKhoaHoc}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default SectionNumber;
