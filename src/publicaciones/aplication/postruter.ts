import { Router } from "express";
import { createPost, getPosts, deletePost, likePost, dislikePost } from "../infraestructure/postcontroller";
import { authenticateToken, verifyRole } from "../infraestructure/authMiddleware";

const router = Router();

/**
 * @swagger
 * /publicacion:
 *   post:
 *     summary: Crear una nueva publicación
 *     description: Crear una nueva publicación en el blog. Requiere autenticación.
 *     tags:
 *       - Publicaciones
 *     security:
 *       - token: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: Texto de la publicación
 *     responses:
 *       201:
 *         description: Publicación creada con éxito
 *       400:
 *         description: Solicitud incorrecta
 */
router.post("/publicacion", authenticateToken, createPost);

/**
 * @swagger
 * /publicacion:
 *   get:
 *     summary: Obtener todas las publicaciones
 *     description: Obtener todas las publicaciones del blog. No requiere autenticación.
 *     tags:
 *       - Publicaciones
 *     responses:
 *       200:
 *         description: Lista de publicaciones
 *       500:
 *         description: Error del servidor
 */
router.get("/publicacion", getPosts);

/**
 * @swagger
 * /publicacion/{id}:
 *   delete:
 *     summary: Eliminar una publicación
 *     description: Eliminar una publicación del blog. Requiere autenticación y rol de administrador.
 *     tags:
 *       - Publicaciones
 *     security:
 *       - token: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la publicación a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Publicación eliminada con éxito
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Publicación no encontrada
 */
router.delete("/publicacion/:id", authenticateToken, deletePost, verifyRole("admin")); 

/**
 * @swagger
 * /publicacion/{id}/like:
 *   post:
 *     summary: Dar like a una publicación
 *     description: Dar like a una publicación. Requiere autenticación.
 *     tags:
 *       - Publicaciones
 *     security:
 *       - token: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la publicación a la que se le dará like
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Like añadido con éxito
 *       400:
 *         description: Error al dar like
 */
router.post("/publicacion/:id/like", authenticateToken, likePost);   

/**
 * @swagger
 * /publicacion/{id}/dislike:
 *   post:
 *     summary: Dar dislike a una publicación
 *     description: Dar dislike a una publicación. Requiere autenticación.
 *     tags:
 *       - Publicaciones
 *     security:
 *       - token: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la publicación a la que se le dará dislike
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dislike añadido con éxito
 *       400:
 *         description: Error al dar dislike
 */
router.post("/publicacion/:id/dislike", authenticateToken, dislikePost);  

export default router;