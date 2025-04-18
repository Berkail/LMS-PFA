import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { SessionService } from 'src/core/session/session.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly sessionService: SessionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const user = await this.sessionService.getSession(request, 'user');
    if (!user) {
      return false;
    }

    request.user = user;

    return true;
  }
}
