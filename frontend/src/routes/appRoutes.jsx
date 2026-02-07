import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";
import ProtectedRoutes from "./ProtectedRoutes";

const Login = React.lazy(() => import("../features/auth/Login"));
const Signup = React.lazy(() => import("../features/auth/SignUp"));
const Unauthorized = React.lazy(() => import("../pages/Unauthorized"));
const NotFound = React.lazy(() => import("../pages/NotFound"));
const HealthLens = React.lazy(() => import("../pages/HealthLens"));
const AddVitals = React.lazy(() => import("../pages/Vitals"));
const Dashboard = React.lazy(() => import("../features/dashboard/Dashboard"));
const UploadReportPage = React.lazy(() => import("../pages/Summarize"));
const Home = React.lazy(() => import("../pages/Home"));
const AllVitals = React.lazy(() => import("../pages/AllVitals"));
const About = React.lazy(() => import("../pages/About"));
const HealthTips = React.lazy(() => import("../pages/HealthTips"));
const Profile = React.lazy(() => import("../pages/Profile"));
const SavedReports = React.lazy(() => import("../pages/SavedReports"));
const EmergencyContacts = React.lazy(
  () => import("../pages/EmergencyContacts"),
);
const FamilyMembers = React.lazy(() => import("../pages/FamilyMembers"));

const PageLoader = () => (
  <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center relative overflow-hidden">
    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]"></div>
    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/50"></div>

    <div className="relative z-10 flex flex-col items-center gap-6">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse"></div>
        <div className="w-16 h-16 bg-white rounded-2xl shadow-xl shadow-primary/10 flex items-center justify-center border border-slate-100 relative z-10">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <h3 className="font-heading font-bold text-slate-900 text-lg tracking-tight">
          HealthLens
        </h3>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
          Loading Application...
        </p>
      </div>
    </div>
  </div>
);

const Load = (Component) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

const routes = [
  {
    path: "/dashboard",
    element: (
      <ProtectedRoutes requiredRole={["user", "admin"]}>
        {Load(Dashboard)}
      </ProtectedRoutes>
    ),
  },
  {
    path: "/summarize",
    element: (
      <ProtectedRoutes requiredRole={["user", "admin"]}>
        {Load(UploadReportPage)}
      </ProtectedRoutes>
    ),
  },
  { path: "/", element: Load(Home) },
  { path: "/chat*", element: Load(HealthLens) },
  { path: "/login*", element: Load(Login) },
  { path: "/signup", element: Load(Signup) },
  { path: "/add-vitals", element: Load(AddVitals) },
  { path: "/all-vitals", element: Load(AllVitals) },
  { path: "/health-tips", element: Load(HealthTips) },
  { path: "/profile", element: Load(Profile) },
  { path: "/timeline", element: Load(AllVitals) },
  { path: "/family-members", element: Load(FamilyMembers) },
  { path: "/reports", element: Load(SavedReports) },
  { path: "/emergency-contacts", element: Load(EmergencyContacts) },
  { path: "/about", element: Load(About) },
  { path: "/unauthorized", element: Load(Unauthorized) },
  { path: "*", element: Load(NotFound) },
];

export default routes;
