import React from "react";
import ManageNav from "../Components/Manage/ManageNav";
import UserProfilePage from "../Components/Manage/UserProfilePage";

const ManagePage: React.FC = () => {
  return (
    <>
      <ManageNav />
      <UserProfilePage />
    </>
  );
};

export default ManagePage;
