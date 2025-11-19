import { pool } from "../db.js";

// GET /api/empleados
export const listarEmpleados = async (req, res) => {
  try {
    const query = `
      SELECT 
        e.id,
        e.id_usuario,
        e.primer_nombre,
        e.segundo_nombre,
        e.primer_apellido,
        e.segundo_apellido,
        e.tipo_documento,
        e.numero_documento,
        e.fecha_nacimiento,
        e.fecha_ingreso,
        e.estado,
        e.creado_en,
        e.actualizado_en
      FROM empleados e
      ORDER BY e.id;
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al listar empleados:", error);
    res.status(500).json({ mensaje: "Error al listar empleados" });
  }
};

// GET /api/empleados/:id
export const obtenerEmpleadoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        e.id,
        e.id_usuario,
        e.primer_nombre,
        e.segundo_nombre,
        e.primer_apellido,
        e.segundo_apellido,
        e.tipo_documento,
        e.numero_documento,
        e.fecha_nacimiento,
        e.fecha_ingreso,
        e.estado,
        e.creado_en,
        e.actualizado_en
      FROM empleados e
      WHERE e.id = $1;
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: "Empleado no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener empleado:", error);
    res.status(500).json({ mensaje: "Error al obtener empleado" });
  }
};

// POST /api/empleados
export const crearEmpleado = async (req, res) => {
  try {
    const {
      id_usuario,
      primer_nombre,
      segundo_nombre,
      primer_apellido,
      segundo_apellido,
      tipo_documento,
      numero_documento,
      fecha_nacimiento,
      fecha_ingreso,
      estado = "activo",
    } = req.body;

    const query = `
      INSERT INTO empleados (
        id_usuario,
        primer_nombre,
        segundo_nombre,
        primer_apellido,
        segundo_apellido,
        tipo_documento,
        numero_documento,
        fecha_nacimiento,
        fecha_ingreso,
        estado
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10
      )
      RETURNING *;
    `;

    const valores = [
      id_usuario || null,
      primer_nombre,
      segundo_nombre || null,
      primer_apellido,
      segundo_apellido || null,
      tipo_documento || null,
      numero_documento || null,
      fecha_nacimiento || null,
      fecha_ingreso || null,
      estado || "activo",
    ];

    const result = await pool.query(query, valores);

    res.status(201).json({
      mensaje: "Empleado creado correctamente",
      empleado: result.rows[0],
    });
  } catch (error) {
    console.error("Error al crear empleado:", error);
    res.status(500).json({ mensaje: "Error al crear empleado" });
  }
};

// PUT /api/empleados/:id
export const actualizarEmpleado = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      id_usuario,
      primer_nombre,
      segundo_nombre,
      primer_apellido,
      segundo_apellido,
      tipo_documento,
      numero_documento,
      fecha_nacimiento,
      fecha_ingreso,
      estado,
    } = req.body;

    const query = `
      UPDATE empleados
      SET
        id_usuario = $1,
        primer_nombre = $2,
        segundo_nombre = $3,
        primer_apellido = $4,
        segundo_apellido = $5,
        tipo_documento = $6,
        numero_documento = $7,
        fecha_nacimiento = $8,
        fecha_ingreso = $9,
        estado = $10,
        actualizado_en = NOW()
      WHERE id = $11
      RETURNING *;
    `;

    const valores = [
      id_usuario || null,
      primer_nombre,
      segundo_nombre || null,
      primer_apellido,
      segundo_apellido || null,
      tipo_documento || null,
      numero_documento || null,
      fecha_nacimiento || null,
      fecha_ingreso || null,
      estado || "activo",
      id,
    ];

    const result = await pool.query(query, valores);

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: "Empleado no encontrado" });
    }

    res.json({
      mensaje: "Empleado actualizado correctamente",
      empleado: result.rows[0],
    });
  } catch (error) {
    console.error("Error al actualizar empleado:", error);
    res.status(500).json({ mensaje: "Error al actualizar empleado" });
  }
};

// DELETE /api/empleados/:id  (borrado lógico)
export const desactivarEmpleado = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      UPDATE empleados
      SET
        estado = 'inactivo',
        actualizado_en = NOW()
      WHERE id = $1
      RETURNING *;
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: "Empleado no encontrado" });
    }

    res.json({
      mensaje: "Empleado desactivado correctamente",
      empleado: result.rows[0],
    });
  } catch (error) {
    console.error("Error al desactivar empleado:", error);
    res.status(500).json({ mensaje: "Error al desactivar empleado" });
  }
};
