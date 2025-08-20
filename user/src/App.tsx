import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import DailyReport from "./pages/DailyReport";
// import NewBooking from "./pages/NewBooking";
// import ExistingBooking from "./pages/ExisitngBooking";
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
        // Logout immediately BEFORE rendering anything
        localStorage.removeItem("token");
        setAuth(false);
        setExpired(true);
      } else {
        setAuth(true);
      }
    } catch (err) {
      localStorage.removeItem("token");
      setAuth(false);
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
          path="/*"
          element={isAuth ? <DailyReport /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!isAuth ? <Login /> : <Navigate to="/dailyreport" />}
        />
        <Route
          path="/dailyreport"
          element={isAuth ? <DailyReport /> : <Navigate to="/login" />}
        />
         {/* <Route
          path="/newbooking"
          element={isAuth ? <NewBooking /> : <Navigate to="/login" />}
        />
         <Route
          path="/existingbooking"
          element={isAuth ? <ExistingBooking /> : <Navigate to="/login" />}
        /> */}
      </Routes>
    </Router>
  );
}

export default App;
