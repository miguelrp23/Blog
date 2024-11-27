import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

declare global {
  namespace Express {
    interface Request {
      user?: { userId: number, role: string };
    }
  }
}

export const createPost = async (req: Request, res: Response): Promise<void> => {
  const { text, image, audio, likes, dislikes } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ message: 'Usuario no autenticado.' });
    return;
  }

  try {
    const userExists = await prisma.newUser.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      res.status(404).json({ message: 'Usuario no existe.' });
      return;
    }

    const newPost = await prisma.publicacion.create({
      data: {
        text: text || null,
        image: image || null,
        audio: audio || null,
        likes: likes ?? 0,
        dislikes: dislikes ?? 0,
        userId,
      },
    });

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Hubo un error al crear la publicación.', error });
  }
};

export const getPosts = async (req: Request, res: Response): Promise<void> => {
  const { search = "", order = "asc" } = req.query;
  const userId = req.user?.userId;
  const userRole = req.user?.role;

  try {
    const posts = await prisma.publicacion.findMany({
      where: {
        text: {
          contains: search as string,
        },
      },
      orderBy: {
        user: {
          user: order === "desc" ? "desc" : "asc", 
        },
      },
      include: {
        user: {
          select: { id: true, user: true },
        },
      },
    });

    const postsWithPermissions = posts.map((post) => ({
      ...post,
      canDelete: post.userId === userId || userRole === "admin",
    }));

    res.status(200).json(postsWithPermissions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
};

export const likePost = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ message: 'Usuario no autenticado.' });
    return;
  }

  try {
    const existingLike = await prisma.reaction.findUnique({
      where: {
        userId_postId_type: {
          userId: userId,
          postId: parseInt(id),
          type: 'like',
        },
      },
    });

    if (existingLike) {
      res.status(400).json({ message: 'Ya has dado like a esta publicación.' });
      return;
    }

    const existingDislike = await prisma.reaction.findUnique({
      where: {
        userId_postId_type: {
          userId: userId,
          postId: parseInt(id),
          type: 'dislike',
        },
      },
    });

    if (existingDislike) {
      await prisma.reaction.delete({
        where: {
          userId_postId_type: {
            userId: userId,
            postId: parseInt(id),
            type: 'dislike',
          },
        },
      });
    }

    await prisma.reaction.create({
      data: {
        userId: userId,
        postId: parseInt(id),
        type: 'like',
      },
    });

    
    await prisma.publicacion.update({
      where: { id: parseInt(id) },
      data: { likes: { increment: 1 } },
    });

    res.status(200).json({ message: 'Like agregado correctamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al dar like.' });
  }
};

export const dislikePost = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ message: 'Usuario no autenticado.' });
    return;
  }

  try {
    const existingDislike = await prisma.reaction.findUnique({
      where: {
        userId_postId_type: {
          userId: userId,
          postId: parseInt(id),
          type: 'dislike',
        },
      },
    });

    if (existingDislike) {
      res.status(400).json({ message: 'Ya has dado dislike a esta publicación.' });
      return;
    }

    const existingLike = await prisma.reaction.findUnique({
      where: {
        userId_postId_type: {
          userId: userId,
          postId: parseInt(id),
          type: 'like',
        },
      },
    });

    if (existingLike) {
      await prisma.reaction.delete({
        where: {
          userId_postId_type: {
            userId: userId,
            postId: parseInt(id),
            type: 'like',
          },
        },
      });
    }

    await prisma.reaction.create({
      data: {
        userId: userId,
        postId: parseInt(id),
        type: 'dislike',
      },
    });

   
    await prisma.publicacion.update({
      where: { id: parseInt(id) },
      data: { dislikes: { increment: 1 } },
    });

    res.status(200).json({ message: 'Dislike agregado correctamente.' });
  } catch (error) {
   
    res.status(500).json({ message: 'Error al dar dislike.' });
  }
};

export const deletePost = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user?.userId;
  const userRole = req.user?.role;

  try {
    const post = await prisma.publicacion.findUnique({
      where: { id: parseInt(id) },
    });

    if (!post) {
      res.status(404).json({ message: 'Publicación no encontrada.' });
      return;
    }

    if (post.userId !== userId && userRole !== 'admin') {
      res.status(403).json({ message: 'No tienes permiso para eliminar esta publicación.' });
      return;
    }

    await prisma.publicacion.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: 'Publicación eliminada exitosamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};
