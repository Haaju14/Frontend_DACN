import { createBrowserHistory } from "history";
import {
  unstable_HistoryRouter as HistoryRouter,
  Route,
  Routes,
} from "react-router-dom";
import HomeTemplate from "./user/Templates/HomeTemplate";
import HomePage from "./user/Pages/HomePage";
import DetailPage from "./user/Pages/DetailPage";
import DynamicResourceLoader from "./DynamicLoader.tsx";
import ManagePage from "./user/Pages/ManagePage.tsx";

import AdminTemplate from "./admin/templates/AdminTemplate";
// import TableRoom from "./admin/pagesAdmin/table/TableRoom.tsx";
// import TableLocation from "./admin/pagesAdmin/table/TableLocation.tsx";
// import TableComment from "./admin/pagesAdmin/table/TableComment.tsx";
// import TableBookingRoom from "./admin/pagesAdmin/table/TableBookingRoom.tsx";
// import TableUser from "./admin/pagesAdmin/table/TableUser.tsx";
import NotFoundPage from "./pageGlobal/NotFoundPage.tsx";
import KhoaHocPage from "./user/Pages/KhoaHocPage.tsx";
import CoursesListPage from "./user/Pages/CoursesListPage.tsx";
import SearchUserPage from "./user/Pages/SearchUserPage.tsx";
import TeacherDetailPage from "./user/Pages/TeacherDetailPage.tsx";
import ManageCourses from "./admin/ManageCourses/ManageCourses.tsx";
import Payment from "./user/Pages/Payment.tsx";
import Followers from "./admin/ManageFollowers/Followers.tsx";
import ManageUser from "./admin/ManageUser/ManageUser.tsx";

export const routeLink: any = createBrowserHistory();

function App() {
  return (
    <>
      <HistoryRouter history={routeLink}>
        <DynamicResourceLoader />
        <Routes>
          {/* User Routes */}
          <Route path="" element={<HomeTemplate />}>
            <Route index element={<HomePage />}></Route>
            <Route 
            path="khoa-hoc">
              <Route 
              path="" element={<KhoaHocPage />}>
              </Route>
            </Route>

            <Route 
              path="/khoa-hoc/xem-chi-tiet/">
              <Route 
              path=":id" element={<DetailPage />}>               
              </Route>
            </Route>

            <Route 
              path="/user/profile" element={<ManagePage />}>
            </Route>
            
            <Route
              path="/Courses-List" element={<CoursesListPage/>} >
            </Route>
            <Route
            path="/SearchUser" element={<SearchUserPage/>}>
            </Route>
            <Route
            path="/Payment" element={<Payment/>}>  
            </Route>
          </Route>
          <Route
            path ="/giangvien/:IDNguoiDung" element={<TeacherDetailPage/>} >
          </Route>

          {/* Admin Routes */}
            <Route path="/admin" element={<AdminTemplate />}>
              
              <Route path="Manage-Course" element={<ManageCourses />} />
              <Route path="Manage-User" element={<ManageUser />} />
              <Route path="Manage-Followers" element={<Followers/>} />
            </Route>

          404 Route  
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </HistoryRouter>
    </>
  );
}

export default App;
