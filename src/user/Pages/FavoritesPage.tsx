import ManageNav from "../Components/Account_Infomation/ManageNav";
import Favorites from "../Components/Favorites/Favorites";

const FavoritesPage: React.FC = () => {
    return (
      <>
        <ManageNav />
        <Favorites IDNguoiDung={0}/>
      </>
    );
  };
  
  export default FavoritesPage;