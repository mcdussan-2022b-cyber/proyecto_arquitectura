import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";

const JWT_SECRET = process.env.JWT_SECRET || "super_secreto";

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { nombre, correo, contrasena, rol = "empleado" } = req.body;

    // 1. Verificar si ya existe el correo
    const existe = await pool.query(
      "SELECT id FROM usuarios WHERE correo = $1",
      [correo]
    );

    if (existe.rows.length > 0) {
      return res.status(400).json({ mensaje: "El correo ya está registrado" });
    }

    // 2. Encriptar contraseña
    const hash = await bcrypt.hash(contrasena, 10);

    // 3. Insertar usuario
    const resultado = await pool.query(
      `INSERT INTO usuarios (nombre, correo, contrasena_hash, rol)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nombre, correo, rol, activo, creado_en`,
      [nombre, correo, hash, rol]
    );

    const usuario = resultado.rows[0];

    // 4. Generar token
    const token = jwt.sign(
      { id: usuario.id, correo: usuario.correo, rol: usuario.rol },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      usuario,
      token,
    });
  } catch (error) {
    console.error("Error en register:", error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    // 1. Buscar usuario por correo
    const resultado = await pool.query(
      `SELECT id, nombre, correo, contrasena_hash, rol, activo
       FROM usuarios
       WHERE correo = $1`,
      [correo]
    );

    if (resultado.rows.length === 0) {
      return res.status(400).json({ mensaje: "Credenciales inválidas" });
    }

    const usuario = resultado.rows[0];

    if (!usuario.activo) {
      return res.status(403).json({ mensaje: "Usuario inactivo" });
    }

    // 2. Comparar contraseña
    const coincide = await bcrypt.compare(contrasena, usuario.contrasena_hash);
    if (!coincide) {
      return res.status(400).json({ mensaje: "Credenciales inválidas" });
    }

    // 3. Generar token
    const token = jwt.sign(
      { id: usuario.id, correo: usuario.correo, rol: usuario.rol },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      mensaje: "Login exitoso",
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      },
      token,
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};
