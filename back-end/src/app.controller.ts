import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { SessionService } from './core/session/session.service';

@Controller()
export class AppController {
  constructor(private readonly sessionService: SessionService) {}
  @Get()
  sayHello() {
    return 'hello world';
  }

  // Set a session value
  @Post('set-session')
  setSession(@Req() req: Request, @Res() res: Response) {
    console.log('Session before setting:', req.session);

    if (!req.session) {
      console.error('❌ Session is not initialized!');
      return res.status(500).send('Session is not initialized');
    }

    this.sessionService.setSession(req, 'username', 'testUser');
    console.log('Session after setting:', req.session);

    return res.send('Session value set!');
  }

  // Get the session value
  @Get('get-session')
  getSession(@Req() req: Request): string {
    const username = this.sessionService.getSession(req, 'username');
    return username ? `Session username: ${username}` : 'No session found';
  }

  // Destroy the session
  @Post('destroy-session')
  destroySession(@Req() req: Request, @Res() res: Response): string {
    this.sessionService.destroySession(req, res);
    return 'Session destroyed';
  }
}
