import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { AuthContext } from "../contexts/AuthContext";

export default function UserLayout() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    console.log("pengecekan user di UserLayout");
    if (user) {
      navigate("/");
    }
  }, []);

  return (
    <>
      <Outlet />
    </>
  );
}
