import { useNavigate, useParams, useSearchParams } from "react-router-dom";
const useRoute = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [searchParam, setSearchParam] = useSearchParams();

  return {
    navigate,
    params,
    searchParam,
    setSearchParam,
  };
};

export default useRoute;
