import { Router } from "express";
import { createUser, loginUser, getUserInfo, updateUserInfo } from "../infraestructure/UserController";
import { authenticateToken } from "../../publicaciones/infraestructure/authMiddleware";

const router = Router();

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Crear un nuevo usuario
 *     description: Crear un nuevo usuario en el sistema.
 *     tags:
 *       - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *     responses:
 *       201:
 *         description: Usuario creado con éxito
 *       400:
 *         description: Solicitud incorrecta
 */
router.post("/users", createUser);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     description: Iniciar sesión de un usuario y obtener un token JWT.
 *     tags:
 *       - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso, token JWT recibido
 *       400:
 *         description: Datos incorrectos
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Obtener información del usuario autenticado
 *     description: Obtener la información del perfil del usuario actual. Requiere autenticación.
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Información del usuario
 *       401:
 *         description: No autenticado
 */
router.get("/users/me", authenticateToken, getUserInfo);

/**
 * @swagger
 * /users/me:
 *   put:
 *     summary: Actualizar información del usuario autenticado
 *     description: Actualizar la información del perfil del usuario actual. Requiere autenticación.
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario
 *               password:
 *                 type: string
 *                 description: Nueva contraseña del usuario
 *     responses:
 *       200:
 *         description: Información actualizada con éxito
 *       400:
 *         description: Datos incorrectos
 */
router.put("/users/me", authenticateToken, updateUserInfo);

export default router;