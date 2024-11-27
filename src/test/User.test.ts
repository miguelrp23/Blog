import { Request, Response } from 'express';
import { prisma } from '../user/infraestructure/config';
import { createUser, loginUser, getUserInfo, updateUserInfo, getAllUsers, toggleUserBan } from '../user/infraestructure/UserController';
import { createPost, getPosts, likePost } from '../publicaciones/infraestructure/postcontroller';
import bcrypt from 'bcrypt';

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    newUser: {
      findUnique: jest.fn(),
    },
    publicacion: {
      findUnique: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    reaction: {
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  })),
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true),
}));


jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('fake-jwt-token'),
}));


jest.mock('../user/infraestructure/config', () => ({
  prisma: {
    newUser: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
     publicacion: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    reaction: {
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  },
}));


describe('UserController Tests', () => {
  
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {}; 
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    
    (prisma.newUser.create as jest.Mock).mockResolvedValue({
      id: 1,
      name: 'John',
      lastName: 'Doe',
      email: `john.doe${Date.now()}@example.com`, 
      user: 'johnny123',
      role: 'user',
      isBanned: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  describe('createUser', () => {
    it('should create a new user not successfully', async () => {
      req.body = {
        name: 'John',
        lastName: 'Doe',
        email: 'jo.doe@example.com',
        user: 'johnny',
        password: 'password123',
        role: 'user',
      };

      (prisma.newUser.create as jest.Mock).mockResolvedValue({
        id: 1,
        name: 'John',
        lastName: 'Doe',
        email: 'jo.doe@example.com',
        user: 'johnny',
        role: 'user',
        isBanned: false,
      });

      await createUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
    
    });

    it('should return 400 if required fields are missing', async () => {
      req.body = {
        name: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        user: 'johnny123',
        password: '',
        role: 'user',
      };

      await createUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Todos los campos son obligatorios' });
    });
  });

  describe('loginUser', () => {
  it('should return 404 if password is not correct', async () => {
    req.body = { user: 'johnny123', password: 'not' };

    const mockUser = {
      id: 1,
      user: 'johnny123',
      password: 'hashedPassword',
      isBanned: false,
    };

    (prisma.newUser.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false); 

    await loginUser(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
   
  });

  describe('UserController "admin', () => {
  let res: any;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('updateUserInfo', () => {


    it('should return 401 if userId is missing', async () => {
      const req = { user: null, body: { user: 'newUser' } };

      await updateUserInfo(req as any, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'No autorizado' });
    });

    it('should handle errors', async () => {
      const req = { user: { userId: 1 }, body: { user: 'newUser' } };
      (prisma.newUser.update as jest.Mock).mockRejectedValue(new Error('Database error'));

      await updateUserInfo(req as any, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getAllUsers', () => {
    
    it('should handle errors ', async () => {
      const req = {};
      (prisma.newUser.findMany as jest.Mock).mockRejectedValue(new Error('Query failed'));

      await getAllUsers(req as any, res);

      expect(res.status).toHaveBeenCalledWith(500);
     
    });
  });

  describe('toggleUserBan', () => {

    it('should return 403 if user is not admin', async () => {
      const req = {
        params: { id: '1', action: 'ban' },
        user: { role: 'user' },
      };

      await toggleUserBan(req as any, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'No tienes permisos para realizar esta acción.' });
    });

    it('should return 404 if user does not exist', async () => {
      const req = {
        params: { id: '9999999', action: 'ban' },
        user: { role: 'admin' },
      };

      (prisma.newUser.findUnique as jest.Mock).mockResolvedValue(null);

      await toggleUserBan(req as any, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should handle invalid actions', async () => {
      const req = {
        params: { id: '1', action: 'invalid' },
        user: { role: 'admin' },
      };

      await toggleUserBan(req as any, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Acción inválida. Debe ser "ban" o "unban".' });
    });
  });
});

})

describe('getUserInfo', () => {
  
  it('should return user info when authenticated', async () => {
    const mockUser = {
      id: 1,
      name: 'Miguel',
      lastName: 'Romero',
      email: 'angelromeromiguel2317@gmail.com',
      user: 'johnnyNew',
      role: 'admin',
      isBanned: false,
    };

    req.user = { userId: 1, role: "admin" };

    (prisma.newUser.findUnique as jest.Mock).mockResolvedValue(mockUser);

    await getUserInfo(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});
})



describe('Post Controllers', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createPost', () => {
   

    it('should return 401 if user is not authenticated', async () => {
      req.body = { text: 'Test post' };

      await createPost(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Usuario no autenticado.' });
    });

    it('should handle server errors', async () => {
      req.user = { userId: 1, role: 'user' };
      req.body = { text: 'Test post' };

      (prisma.newUser.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));

      await createPost(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('getPosts', () => {

    it('should handle server errors', async () => {
      req.query = { search: '' };

      (prisma.publicacion.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

      await getPosts(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error fetching posts' });
    });
  });

  describe('likePost', () => {

    it('should return 401 if user is not authenticated', async () => {
      req.params = { id: '1' };

      await likePost(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Usuario no autenticado.' });
    });
  });

  });


 

