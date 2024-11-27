import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
  user?: { userId: number; role: string };
}


export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { name, lastName, email, user, password, role } = req.body;

  if (!name || !lastName || !email || !user || !password || !role) {
    res.status(400).json({ error: "Todos los campos son obligatorios" });
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.newUser.create({
      data: { name, lastName, email, user, password: hashedPassword, role },
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Hubo un problema al crear el usuario" });
  }
};


export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { user, password } = req.body;

  try {
    const foundUser = await prisma.newUser.findUnique({
      where: { user },
    });

    if (!foundUser) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    if (foundUser.isBanned) {
      res.status(403).json({ message: "Tu cuenta está baneada. No puedes iniciar sesión." });
      return;
    }

    const validPassword = await bcrypt.compare(password, foundUser.password);
    if (!validPassword) {
      res.status(401).json({ message: 'Contraseña incorrecta' });
      return;
    }

    const token = jwt.sign(
      { userId: foundUser.id, username: foundUser.user, role: foundUser.role },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    res.status(200).json({ message: 'Inicio de sesión exitoso', token });
    return;
  } catch (error) {
   
    res.status(500).json({ message: 'Hubo un error en el servidor' });
    return;
  }
};

export const getUserInfo = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId; 

  if (!userId) {
    res.status(401).json({ message: 'No autorizado. Token no encontrado.' });
    return; 
  }

  try {
    const user = await prisma.newUser.findUnique({
      where: { id: userId },
      select: {
        name: true,
        lastName: true,
        email: true,
        user: true,
        role: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return; 
    }

    res.status(200).json(user);
    return; 
  } catch (error) {
   
    res.status(500).json({ message: 'Hubo un error interno al obtener la información.' });
    return; 
  }
};

export const updateUserInfo = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  const { user, password } = req.body;

  if (!userId) {
    res.status(401).json({ message: "No autorizado" });
    return;
  }

  try {
    const updates: Partial<{ user: string; password: string }> = {};

    if (user) updates.user = user;
    if (password) updates.password = await bcrypt.hash(password, 10);

    const updatedUser = await prisma.newUser.update({
      where: { id: userId },
      data: updates,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    
    res.status(500).json({ message: "Hubo un error al actualizar los datos del usuario" });
  }
};


export const getAllUsers = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const users = await prisma.newUser.findMany({
      select: { id: true, name: true, user: true, email: true, role: true, isBanned: true },
    });
    res.status(200).json(users);
  } catch (error) {
   
    res.status(500).json({ message: "Error interno del servidor" });
  }
};


export const toggleUserBan = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id, action } = req.params; 

  
  if (!['ban', 'unban'].includes(action)) {
    res.status(400).json({ message: 'Acción inválida. Debe ser "ban" o "unban".' });
    return;
  }

  
  if (req.user?.role !== 'admin') {
    res.status(403).json({ message: 'No tienes permisos para realizar esta acción.' });
    return;
  }

  try {
    
    const user = await prisma.newUser.findUnique({ where: { id: Number(id) } });
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    
    const updatedUser = await prisma.newUser.update({
      where: { id: Number(id) },
      data: {
        isBanned: action === 'ban', 
      },
    });

    
    res.status(200).json({ message: `Usuario ${action === 'ban' ? 'baneado' : 'desbaneado'} correctamente`, user: updatedUser });
  } catch (error) {
   
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

