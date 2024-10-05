import React from "react";
import RoomsNav from "../Components/Rooms/RoomsNav";
import Rooms from "../Components/Rooms/Rooms";

const RoomPage: React.FC = () => {
  return (
    <>
      <RoomsNav />
      <Rooms />
    </>
  );
};

export default RoomPage;
