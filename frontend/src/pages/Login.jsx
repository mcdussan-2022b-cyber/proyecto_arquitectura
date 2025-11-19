// src/pages/Login.jsx
import { useState } from "react";
import api, { setAuthToken } from "../api";

function Login({ onLogin }) {
  const [correo, setCorreo] = useState("admin@empresa.com");
  const [contrasena, setContrasena] = useState("123456");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      const res = await api.post("/auth/login", { correo, contrasena });
      const { token, usuario } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("usuario", JSON.stringify(usuario));
      setAuthToken(token);
      onLogin(token);
    } catch (err) {
      console.error(err);
      setError("Correo o contraseña incorrectos");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo-circle">RH</div>
          <div>
            <h1 className="login-title">SGRH</h1>
            <p className="login-subtitle">
              Sistema de Gestión de Recursos Humanos
            </p>
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <p className="login-error">{error}</p>}

          <div className="login-field">
            <label>Correo institucional</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              placeholder="usuario@empresa.com"
            />
          </div>

          <div className="login-field">
            <label>Contraseña</label>
            <input
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <button className="login-button" type="submit" disabled={cargando}>
            {cargando ? "Ingresando..." : "Ingresar"}
          </button>

          <p className="login-footer-text">
            Acceso reservado para personal autorizado de RRHH
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;