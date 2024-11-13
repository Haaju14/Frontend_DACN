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
import NotFoundPage from "./pageGlobal/NotFoundPage.tsx";
import KhoaHocPage from "./user/Pages/KhoaHocPage.tsx";
import CoursesListPage from "./user/Pages/CoursesListPage.tsx";
import SearchUserPage from "./user/Pages/SearchUserPage.tsx";
import TeacherDetailPage from "./user/Pages/TeacherDetailPage.tsx";
import ManageCourses from "./admin/ManageCourses/ManageCourses.tsx";
import PaymentPage from "./user/Pages/PaymentPage.tsx";
import CartPage from "./user/Pages/CartPage.tsx";
import Followers from "./admin/ManageFollowers/Followers.tsx";
import ManageUser from "./admin/ManageUser/ManageUser.tsx";
import BlackList from "./admin/ManageBlackList/BlackList.tsx";
import BlockList from "./admin/ManageBlockList/BlockList.tsx";
import ManageComment from "./admin/ManageComment/ManageComment.tsx";
import Censor from "./admin/CensorCourse/Censor.tsx";
import Category from "./admin/ManageCategory/Category.tsx";
import Promotion from "./admin/ManagePromotion/Promotion.tsx";
import Chatbox from "./user/Components/ChatBox/ChatBox.tsx";

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
            <Route path="khoa-hoc">
              <Route path="" element={<KhoaHocPage />} />
            </Route>
            <Route path="/khoa-hoc/xem-chi-tiet/">
              <Route path=":id" element={<DetailPage />} />
            </Route>
            <Route path="/user/profile" element={<ManagePage />} />
            <Route path="/Courses-List" element={<CoursesListPage />} />
            <Route path="/Teacher" element={<SearchUserPage />} />
            <Route path="/Payment" element={<PaymentPage />} />
            <Route path="/Cart" element={<CartPage />} />
          </Route>
          <Route path="/giangvien/:IDNguoiDung" element={<TeacherDetailPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminTemplate />}>
            <Route path="Manage-Course" element={<ManageCourses />} />
            <Route path="Manage-User" element={<ManageUser />} />
            <Route path="Manage-Followers" element={<Followers />} />
            <Route path="Manage-Black-List" element={<BlackList />} />
            <Route path="Manage-Block-List" element={<BlockList />} />
            <Route path="Manage-Comment" element={<ManageComment />} />
            <Route path="Manage-Censor" element={<Censor />} />
            <Route path="Manage-Category" element={<Category />} />
            <Route path="Manage-Promotion" element={<Promotion />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        {/* Chatbox chỉ xuất hiện trong User Routes */}
        <Chatbox />
      </HistoryRouter>
    </>
  );
}

export default App;
