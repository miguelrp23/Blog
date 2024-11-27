import { Router } from "express";
import { getAllUsers, toggleUserBan } from "../infraestructure/UserController";
import { authenticateToken } from "../../publicaciones/infraestructure/authMiddleware";

const router = Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     description: Obtener una lista de todos los usuarios. Requiere autenticación.
 *     tags:
 *       - Administración
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       403:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get("/users", authenticateToken, getAllUsers);

/**
 * @swagger
 * /users/{id}/{action}:
 *   post:
 *     summary: Activar o desactivar a un usuario
 *     description: Bloquear o desbloquear a un usuario dependiendo de la acción. Requiere autenticación.
 *     tags:
 *       - Administración
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario
 *         schema:
 *           type: integer
 *       - in: path
 *         name: action
 *         required: true
 *         description: Acción (ban/unban)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Acción realizada con éxito
 *       400:
 *         description: Acción no válida
 *       403:
 *         description: No autorizado
 */
router.post("/users/:id/:action", authenticateToken, toggleUserBan);

export default router;