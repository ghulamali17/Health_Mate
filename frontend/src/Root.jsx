// import { useEffect } from "react";
// import { useAuth } from "./context/authContext";
// import { useNavigate } from "react-router-dom";

// function Root() {
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   useEffect(() => {
//     if (!user) {
//       navigate("/login");
//       return;
//     }

//     switch (user.role) {
//       case "admin":
//         navigate("/admin/dashboard");
//         break;
//       case "user":
//         navigate("/dashboard");
//         break;
//       default:
//         navigate("/login");
//     }
//   }, [user, navigate]);

//   return null;
// }

// export default Root;
