import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../user/infraestructure/config';

const jwtSecret = process.env.JWT_SECRET || 'default_secret';

interface AuthenticatedRequest extends Request {
  user?: { userId: number; role: string };
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ message: 'Token requerido para acceder a esta ruta' });
    return; 
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as { userId: number; role: string };
    const user = await prisma.newUser.findUnique({
      where: { id: decoded.userId },
    });

    if (user?.isBanned) {
      res.status(403).json({ message: 'Usuario baneado. No puedes acceder.' });
      return; 
    }

    
    req.user = { userId: decoded.userId, role: decoded.role };

    next(); 
  } catch (error) {
    res.status(401).json({ message: 'Token inválido o expirado' });
    return; 
  }
};
export const verifyRole = (requiredRole: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || req.user.role !== requiredRole) {
     res.status(403).json({ message: `Acceso denegado. Se requiere rol de ${requiredRole}.` });
     return;
    }
    next();
  };
};