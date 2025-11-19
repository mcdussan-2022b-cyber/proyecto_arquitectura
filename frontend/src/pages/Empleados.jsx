// src/pages/Empleados.jsx
import { useEffect, useState } from "react";
import api from "../api";

const formInicial = {
  id: null,
  id_usuario: "",
  primer_nombre: "",
  segundo_nombre: "",
  primer_apellido: "",
  segundo_apellido: "",
  tipo_documento: "",
  numero_documento: "",
  fecha_nacimiento: "",
  fecha_ingreso: "",
  estado: "activo",
};

function Empleados({ onLogout }) {
  const [empleados, setEmpleados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [form, setForm] = useState(formInicial);
  const [modoEdicion, setModoEdicion] = useState(false);

  // búsqueda
  const [busqueda, setBusqueda] = useState("");

  // mostrar / ocultar formulario
  const [mostrarForm, setMostrarForm] = useState(false);

  const limpiarMensajes = () => {
    setError("");
    setMensaje("");
  };

  const cargarEmpleados = async () => {
    try {
      setCargando(true);
      limpiarMensajes();
      const res = await api.get("/empleados");
      setEmpleados(res.data);
    } catch (err) {
      console.error(err);
      setError("Error al cargar empleados");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarEmpleados();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    limpiarMensajes();
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    limpiarMensajes();

    if (!form.primer_nombre || !form.primer_apellido) {
      setError("Primer nombre y primer apellido son obligatorios.");
      return;
    }

    try {
      if (modoEdicion && form.id) {
        // ACTUALIZAR
        await api.put(`/empleados/${form.id}`, {
          id_usuario: form.id_usuario || null,
          primer_nombre: form.primer_nombre,
          segundo_nombre: form.segundo_nombre || null,
          primer_apellido: form.primer_apellido,
          segundo_apellido: form.segundo_apellido || null,
          tipo_documento: form.tipo_documento || null,
          numero_documento: form.numero_documento || null,
          fecha_nacimiento: form.fecha_nacimiento || null,
          fecha_ingreso: form.fecha_ingreso || null,
          estado: form.estado || "activo",
        });
        setMensaje("Empleado actualizado correctamente");
      } else {
        // CREAR
        await api.post("/empleados", {
          id_usuario: form.id_usuario || null,
          primer_nombre: form.primer_nombre,
          segundo_nombre: form.segundo_nombre || null,
          primer_apellido: form.primer_apellido,
          segundo_apellido: form.segundo_apellido || null,
          tipo_documento: form.tipo_documento || null,
          numero_documento: form.numero_documento || null,
          fecha_nacimiento: form.fecha_nacimiento || null,
          fecha_ingreso: form.fecha_ingreso || null,
          estado: form.estado || "activo",
        });
        setMensaje("Empleado creado correctamente");
      }

      setForm(formInicial);
      setModoEdicion(false);
      cargarEmpleados();
    } catch (err) {
      console.error(err);
      setError("Error al guardar empleado");
    }
  };

  const handleEditar = (emp) => {
    limpiarMensajes();
    setModoEdicion(true);
    setMostrarForm(true);

    setForm({
      id: emp.id,
      id_usuario: emp.id_usuario || "",
      primer_nombre: emp.primer_nombre || "",
      segundo_nombre: emp.segundo_nombre || "",
      primer_apellido: emp.primer_apellido || "",
      segundo_apellido: emp.segundo_apellido || "",
      tipo_documento: emp.tipo_documento || "",
      numero_documento: emp.numero_documento || "",
      fecha_nacimiento: emp.fecha_nacimiento
        ? emp.fecha_nacimiento.slice(0, 10)
        : "",
      fecha_ingreso: emp.fecha_ingreso ? emp.fecha_ingreso.slice(0, 10) : "",
      estado: emp.estado || "activo",
    });
  };

  const handleCancelarEdicion = () => {
    setModoEdicion(false);
    setForm(formInicial);
    limpiarMensajes();
  };

  const handleDesactivar = async (id) => {
    const confirmar = window.confirm(
      "¿Seguro que deseas desactivar este empleado?"
    );
    if (!confirmar) return;

    try {
      limpiarMensajes();
      await api.delete(`/empleados/${id}`);
      setMensaje("Empleado desactivado correctamente");
      cargarEmpleados();
    } catch (err) {
      console.error(err);
      setError("Error al desactivar empleado");
    }
  };

  
  const empleadosFiltrados = empleados.filter((emp) => {
    const texto = `${emp.primer_nombre || ""} ${emp.segundo_nombre || ""} ${
      emp.primer_apellido || ""
    } ${emp.segundo_apellido || ""} ${emp.numero_documento || ""}`.toLowerCase();

    return texto.includes(busqueda.toLowerCase());
  });

  return (
    <div className="panel-root">
      {/* HEADER CON BUSCADOR E ICONO DE CERRAR */}
      <header className="panel-header">
        <div>
          <h1 className="panel-title">Empleados</h1>
          <p className="panel-subtitle">
            Gestión del personal registrado en el sistema
          </p>
        </div>

        <div className="panel-header-right">
          <input
            type="text"
            className="panel-search"
            placeholder="Buscar por nombre o documento..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          <button
            className="icon-button"
            onClick={onLogout}
            type="button"
            title="Cerrar sesión"
          >
            ✕
          </button>
        </div>
      </header>

      {/* CARD FORMULARIO */}
      <section className="panel-card">
        <div className="panel-card-header">
          <h2 className="panel-section-title">
            {modoEdicion ? "Editar empleado" : "Registrar nuevo empleado"}
          </h2>

          <button
            type="button"
            className="btn-primary"
            onClick={() => setMostrarForm((prev) => !prev)}
          >
            {mostrarForm ? "Ocultar formulario" : "Crear empleado"}
          </button>
        </div>

        {mostrarForm && (
          <>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}

            <form onSubmit={handleSubmit} className="panel-form">
              <div className="panel-form-row">
                <div className="panel-form-group">
                  <label>Primer nombre *</label>
                  <input
                    type="text"
                    name="primer_nombre"
                    value={form.primer_nombre}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="panel-form-group">
                  <label>Segundo nombre</label>
                  <input
                    type="text"
                    name="segundo_nombre"
                    value={form.segundo_nombre}
                    onChange={handleChange}
                  />
                </div>

                <div className="panel-form-group">
                  <label>Primer apellido *</label>
                  <input
                    type="text"
                    name="primer_apellido"
                    value={form.primer_apellido}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="panel-form-group">
                  <label>Segundo apellido</label>
                  <input
                    type="text"
                    name="segundo_apellido"
                    value={form.segundo_apellido}
                    onChange={handleChange}
                  />
                </div>

                <div className="panel-form-group">
                  <label>Tipo documento</label>
                  <input
                    type="text"
                    name="tipo_documento"
                    value={form.tipo_documento}
                    onChange={handleChange}
                    placeholder="CC, TI, CE..."
                  />
                </div>

                <div className="panel-form-group">
                  <label>Número documento</label>
                  <input
                    type="text"
                    name="numero_documento"
                    value={form.numero_documento}
                    onChange={handleChange}
                  />
                </div>

                <div className="panel-form-group">
                  <label>Fecha nacimiento</label>
                  <input
                    type="date"
                    name="fecha_nacimiento"
                    value={form.fecha_nacimiento}
                    onChange={handleChange}
                  />
                </div>

                <div className="panel-form-group">
                  <label>Fecha ingreso</label>
                  <input
                    type="date"
                    name="fecha_ingreso"
                    value={form.fecha_ingreso}
                    onChange={handleChange}
                  />
                </div>

                <div className="panel-form-group">
                  <label>Estado</label>
                  <select
                    name="estado"
                    value={form.estado}
                    onChange={handleChange}
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: "12px", display: "flex", gap: "10px" }}>
                <button type="submit" className="btn-primary">
                  {modoEdicion ? "Actualizar empleado" : "Guardar empleado"}
                </button>

                {modoEdicion && (
                  <button
                    type="button"
                    onClick={handleCancelarEdicion}
                    className="btn-secondary"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </>
        )}
      </section>

      {/* CARD LISTADO */}
      <section className="panel-card">
        <h2 className="panel-section-title">Listado de empleados</h2>

        {cargando ? (
          <p>Cargando...</p>
        ) : empleadosFiltrados.length === 0 ? (
          <p>No hay empleados que coincidan con la búsqueda.</p>
        ) : (
          <div style={{ overflowX: "auto", marginTop: "6px" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "4px",
              }}
            >
              <thead>
                <tr>
                  <th style={th}>ID</th>
                  <th style={th}>Nombre completo</th>
                  <th style={th}>Documento</th>
                  <th style={th}>Nacimiento</th>
                  <th style={th}>Ingreso</th>
                  <th style={th}>Estado</th>
                  <th style={th}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {empleadosFiltrados.map((emp) => (
                  <tr key={emp.id}>
                    <td style={td}>{emp.id}</td>
                    <td style={td}>
                      {emp.primer_nombre} {emp.segundo_nombre}{" "}
                      {emp.primer_apellido} {emp.segundo_apellido}
                    </td>
                    <td style={td}>
                      {emp.tipo_documento} {emp.numero_documento}
                    </td>
                    <td style={td}>
                      {emp.fecha_nacimiento
                        ? emp.fecha_nacimiento.slice(0, 10)
                        : "-"}
                    </td>
                    <td style={td}>
                      {emp.fecha_ingreso
                        ? emp.fecha_ingreso.slice(0, 10)
                        : "-"}
                    </td>
                    <td style={td}>{emp.estado}</td>
                    <td style={td}>
                      <button
                        className="btn-table"
                        onClick={() => handleEditar(emp)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn-table btn-table-danger"
                        onClick={() => handleDesactivar(emp.id)}
                      >
                        Desactivar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

const th = {
  borderBottom: "1px solid #e5e7eb",
  padding: "8px",
  textAlign: "left",
  background: "#f9fafb",
  fontSize: "0.8rem",
};

const td = {
  borderBottom: "1px solid #f3f4f6",
  padding: "7px 8px",
  fontSize: "0.82rem",
};

export default Empleados;