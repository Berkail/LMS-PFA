import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import session from 'express-session';
import { Request, Response } from 'express';
import { RedisService } from '../redis/redis.service';
import { RedisStore } from 'connect-redis';
import { User } from 'src/modules/user/entities/user.entity';
import { UserService } from 'src/modules/user/user.service';

declare module 'express' {
  interface Request {
    session: session.Session & Partial<session.SessionData>;
  }
}

@Injectable()
export class SessionService {
  private sessionMiddleware: any;

  constructor(private readonly redisService: RedisService) {
    this.initializeSession();
  }

  private initializeSession() {
    const redisClient = this.redisService.getClient();
    const store = new RedisStore({
      client: redisClient,
      prefix: 'sess:',
    });

    this.sessionMiddleware = session({
      store,
      secret: process.env.SESSION_SECRET || 'supersecret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
      },
    });
  }

  getSessionMiddleware() {
    return this.sessionMiddleware;
  }

  setSession(req: Request, key: string, value: any): void {
    req.session[key] = value;
    req.session.save();
  }

  getSession(req: Request, key: string): any {
    return req.session[key] || null;
  }

  async destroySession(req: Request, res: Response): Promise<void> {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          reject(err);
          return;
        }
        Promise.all([
          res.clearCookie('connect.sid'),
        ])
          .then(() => resolve())
          .catch(reject);
      });
    });
  }

  async getUserFromSession<T extends User>(req: Request, userService: UserService<T>): Promise<T> {
    const userId = this.getSession(req, 'user')?.id;
    if (!userId) {
      throw new NotFoundException('user not found in session');
    }
    
    try {
      const user = await userService.findById(+userId);
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('user not found in database');
      }
      throw error;
    }
  }
}
