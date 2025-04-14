import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { SessionService } from './core/session/session.service';
import { ApiOperation } from '@nestjs/swagger';
@Controller()
export class AppController {
  constructor(private readonly sessionService: SessionService) {}
  @Get()
  @ApiOperation({
    summary: 'Test api endpoint',
    description: 'This endpoint is a simple test of endpoint connectivity',
  })
  sayHello() {
    return 'Testing api enpoint';
  }
}
