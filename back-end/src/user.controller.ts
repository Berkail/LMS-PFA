import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users') // Base route: /api/users
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAllUsers() {
    return this.userService.findAll();
  }

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.userService.findOne(Number(id));
  }
}
