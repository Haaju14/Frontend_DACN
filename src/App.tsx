import { createBrowserHistory } from "history";
import {
  unstable_HistoryRouter as HistoryRouter,
  Route,
  Routes,
} from "react-router-dom";
import HomeTemplate from "./user/Templates/HomeTemplate";
import HomePage from "./user/Pages/HomePage";
import DetailPage from "./user/Pages/DetailPage";
import RoomPage from "./user/Pages/RoomPage";
import DynamicResourceLoader from "./DynamicLoader.tsx";
import ManagePage from "./user/Pages/ManagePage.tsx";

import AdminTemplate from "./admin/templates/AdminTemplate";
import TableRoom from "./admin/pagesAdmin/table/TableRoom.tsx";
import TableLocation from "./admin/pagesAdmin/table/TableLocation.tsx";
import TableComment from "./admin/pagesAdmin/table/TableComment.tsx";
import TableBookingRoom from "./admin/pagesAdmin/table/TableBookingRoom.tsx";
import TableUser from "./admin/pagesAdmin/table/TableUser.tsx";
import NotFoundPage from "./pageGlobal/NotFoundPage.tsx";

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
            <Route path="room">
              <Route path="" element={<RoomPage />}></Route>
              <Route path=":locate" element={<RoomPage />}></Route>
            </Route>
            <Route path="detail">
              <Route path=":id" element={<DetailPage />}></Route>
            </Route>
            <Route path="info-user" element={<ManagePage />}></Route>
          </Route>
          {/* Admin Routes */}
          <Route path="admin" element={<AdminTemplate />}>
            <Route path="table-room" element={<TableRoom />} />
            <Route path="table-location" element={<TableLocation />} />
            <Route path="table-comment" element={<TableComment />} />
            <Route path="table-booking-room" element={<TableBookingRoom />} />
            <Route path="table-user" element={<TableUser />}></Route>
          </Route>
          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </HistoryRouter>
    </>
  );
}

export default App;
