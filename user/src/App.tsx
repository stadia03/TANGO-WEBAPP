import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";

import { useUserStore } from "./store";

function App() {
  const { isAuth, setAuth } = useUserStore();
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const expiry = payload.exp * 1000;

        if (Date.now() > expiry) {
          localStorage.removeItem("token");
          setAuth(false);
          setExpired(true); // <-- token expired
        } else {
          setAuth(true);
        }
      } catch (err) {
        setAuth(false);
        localStorage.removeItem("token");
      }
    } else {
      setAuth(false);
    }
  }, [setAuth]);

  return (
    <Router>
      {expired && <Navigate to="/login" state={{ expired: true }} replace />}
      <Routes>
        <Route
          path="/"
          element={isAuth ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!isAuth ? <Login /> : <Navigate to="/home" />}
        />
        <Route
          path="/home"
          element={isAuth ? <Home /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
