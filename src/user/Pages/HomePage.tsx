import React from "react";
import Carousel from "../Components/Home/Carousel";
import SectionInformation from "../Components/Home/SectionInformation";
import SectionIcon from "../Components/Home/SectionIcon";
import SectionOurRoom from "../Components/Home/SectionOurRoom";
import SectionNumber from "../Components/Home/SectionNumber";

const HomePage: React.FC = () => {
  return (
    <>
      <Carousel />
      
      <SectionInformation />
      <SectionIcon />
      <SectionOurRoom />
      <SectionNumber />
    </>
  );
};

export default HomePage;
