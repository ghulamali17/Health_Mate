
import Login from "../features/auth/Login";
import Signup from "../features/auth/SignUp";
import Unauthorized from "../pages/Unauthorized";
import ProtectedRoutes from "./ProtectedRoutes";
import NotFound from "../pages/NotFound";
import Healthmate from "../pages/Healthmate";
import AddVitals from "../pages/Vitals";
import Dashboard from "../features/dashboard/Dashboard";
import UploadReportPage from "../pages/Summarize";
// import Create from "../pages/Create";
// import Items from "../pages/Items";
import AllVitals from "../pages/AllVitals";
import About from "../pages/About";
import HealthTips from "../pages/HealthTips";
import Profile from "../pages/Profile";

const routes = [
  {
    path: "/",
    element: (
      <ProtectedRoutes requiredRole={["user", "admin"]}>
        <Dashboard />
     </ProtectedRoutes>
    ),
  },
    {
    path: "/summarize",
    element: (
      <ProtectedRoutes requiredRole={["user", "admin"]}>
        <UploadReportPage />
     </ProtectedRoutes>
    ),
  },

    { path: "/chat*", element: <Healthmate /> },
  { path: "/login*", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/add-vitals", element: <AddVitals /> },
  { path: "/all-vitals", element: <AllVitals /> },
  { path: "/summarize", element: <UploadReportPage /> },
  { path: "/health-tips", element: <HealthTips /> },
  { path: "/profile", element: <Profile /> },

  { path: "/about", element: <About /> },
  { path: "/unauthorized", element: <Unauthorized /> },
  { path: "*", element: <NotFound /> },
];

export default routes;
