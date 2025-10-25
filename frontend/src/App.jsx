import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { AuthProvider } from "./context/authContext";
import { store } from "./store";
import routes from "./routes/appRoutes";

function App() {
  const router = createBrowserRouter(routes);

  return (
    <Provider store={store}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </Provider>
  );
}

export default App;
