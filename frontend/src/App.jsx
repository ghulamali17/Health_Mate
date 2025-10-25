import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { AuthProvider } from "./context/authContext";
import { store } from "./store";
import routes from "./routes/appRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const router = createBrowserRouter(routes);

  return (
    <Provider store={store}>
      <AuthProvider>
        <RouterProvider router={router} />
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </AuthProvider>
    </Provider>
  );
}

export default App;
