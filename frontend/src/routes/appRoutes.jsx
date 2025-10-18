import Root from "../Root";
import Login from "../features/auth/Login";
import Signup from "../features/auth/SignUp";
import Dashboard from "../features/dashboard/Dashboard";
import AdminDashboard from "../features/dashboard/AdminDashboard";
import Create from "../crud/Create";
import Update from "../crud/Update";
import Items from "../crud/Items";
import Unauthorized from "../pages/Unauthorized";
import ProtectedRoutes from "./ProtectedRoutes";
import NotFound from "../pages/NotFound";
import UserItems from "../crud/UserItems";
import GeminiTester from "../components/ui/Gemini";

const routes = [
  { path: "/", element: <GeminiTester /> },
  { path: "/login/*", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoutes requiredRole={["user"]}>
        <Dashboard />
      </ProtectedRoutes>
    ),
  },
  {
    path: "/admin/dashboard",
    element: (
      <ProtectedRoutes requiredRole={["admin"]}>
        <AdminDashboard />
      </ProtectedRoutes>
    ),
  },
  { path: "/items", element: <Items /> },
  { path: "/create", element: <Create /> },
  { path: "/update/:id", element: <Update /> },
  { path: "/useritems", element: <UserItems /> },
  { path: "/unauthorized", element: <Unauthorized /> },
  { path: "*", element: <NotFound /> },
];

export default routes;
