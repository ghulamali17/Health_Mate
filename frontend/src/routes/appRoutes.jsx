import Login from "../features/auth/Login";
import Signup from "../features/auth/SignUp";
import Unauthorized from "../pages/Unauthorized";
import ProtectedRoutes from "./ProtectedRoutes";
import NotFound from "../pages/NotFound";
import HealthLens from "../pages/HealthLens";
import AddVitals from "../pages/Vitals";
import Dashboard from "../features/dashboard/Dashboard";
import UploadReportPage from "../pages/Summarize";
import Home from "../pages/Home";
import AllVitals from "../pages/AllVitals";
import About from "../pages/About";
import HealthTips from "../pages/HealthTips";
import Profile from "../pages/Profile";
import SavedReports from "../pages/SavedReports";
import EmergencyContacts from "../pages/EmergencyContacts";
import FamilyMembers from "../pages/FamilyMembers";
const routes = [
  {
    path: "/dashboard",
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
  { path: "/", element: <Home /> },
  { path: "/chat*", element: <HealthLens /> },
  { path: "/login*", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/add-vitals", element: <AddVitals /> },
  { path: "/all-vitals", element: <AllVitals /> },
  { path: "/summarize", element: <UploadReportPage /> },
  { path: "/health-tips", element: <HealthTips /> },
  { path: "/profile", element: <Profile /> },
  { path: "/all-vitals", element: <AllVitals /> },
  { path: "/family-members", element: <FamilyMembers /> },
  { path: "/reports", element: <SavedReports /> },
  { path: "/emergency-contacts", element: <EmergencyContacts /> },
  { path: "/about", element: <About /> },
  { path: "/unauthorized", element: <Unauthorized /> },
  { path: "*", element: <NotFound /> },
];

export default routes;
