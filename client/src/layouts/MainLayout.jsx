import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { AuthContext } from "../contexts/AuthContext";

export default function MainLayout() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    console.log(user);
    if (!user) {
      navigate("/auth/login");
    }
  }, []);

  return (
    <>
      <Outlet />
    </>
  );
}
