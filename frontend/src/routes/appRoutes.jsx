
import Login from "../features/auth/Login";
import Signup from "../features/auth/SignUp";
import Unauthorized from "../pages/Unauthorized";
import ProtectedRoutes from "./ProtectedRoutes";
import NotFound from "../pages/NotFound";
import Healthmate from "../pages/Healthmate";

const routes = [
  {
    path: "/",
    element: (
      // <ProtectedRoutes requiredRole={["user", "admin"]}>
        <Healthmate />
      // </ProtectedRoutes>
    ),
  },
  { path: "/login/*", element: <Login /> },
  { path: "/signup", element: <Signup /> },

  { path: "/unauthorized", element: <Unauthorized /> },
  { path: "*", element: <NotFound /> },
];

export default routes;
