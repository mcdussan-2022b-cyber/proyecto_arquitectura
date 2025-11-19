// src/App.jsx
import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Empleados from "./pages/Empleados";
import { setAuthToken } from "./api";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setAuthToken(null);
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return <Empleados onLogout={handleLogout} />;
}

export default App;