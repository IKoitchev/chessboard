import { FunctionComponent, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../UserProvider";
import Loader from "../Loader";

const Logout: FunctionComponent = () => {
  const { logout } = useUser();
  const queryParams = new URLSearchParams(document.location.search);
  const redirectTo = queryParams.get("to");

  useEffect(() => {
    logout(redirectTo ?? "/play");
  });

  return <Loader />;
};

export default Logout;
