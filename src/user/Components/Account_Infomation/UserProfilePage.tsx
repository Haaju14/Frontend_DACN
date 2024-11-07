import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import Profile from "./Profile";

const UserProfilePage: React.FC = () => {
  const { userLogin } = useSelector((state: RootState) => state.userReducer);
  const userId = userLogin?.user?.IDNguoiDung;

  if (!userLogin) {
    return <div>User is not logged in. Please log in to access this page.</div>;
  }

  const userData = { ...userLogin.user };

  return (
    <div className="user-profile-page container">
      <div className="row">
        <div className="col-md-4">
          <Profile user={userData} />
        </div>
        <div className="col-md-8">
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
