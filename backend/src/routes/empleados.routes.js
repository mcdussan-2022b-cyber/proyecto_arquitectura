// backend/src/routes/empleados.routes.js
import { Router } from "express";
import {
  listarEmpleados,
  obtenerEmpleadoPorId,
  crearEmpleado,
  actualizarEmpleado,
  desactivarEmpleado
} from "../controllers/empleados.controller.js";

const router = Router();

router.get("/", listarEmpleados);
router.get("/:id", obtenerEmpleadoPorId);
router.post("/", crearEmpleado);
router.put("/:id", actualizarEmpleado);
router.delete("/:id", desactivarEmpleado);

export default router;   // 👈 IMPORTANTE
