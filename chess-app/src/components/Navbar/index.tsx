import React from "react";
import "./index.css";
import { useUser } from "../UserProvider";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { isLoggedIn, logout } = useUser();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/login");
  };

  return (
    <>
      <div className="navbar">navbar</div>

      {isLoggedIn ? (
        <input type="button" value="log out" onClick={(e) => logout()} />
      ) : (
        <input type="button" value="login" onClick={handleClick} />
      )}
    </>
  );
}
