import { Outlet } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const HomeTemplate: React.FC = () => {
  return (
    <div className="user">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default HomeTemplate;
