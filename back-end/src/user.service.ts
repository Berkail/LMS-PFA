import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  private users = [{ id: 1, name: 'John Doe', email: 'john@example.com' }];

  findAll() {
    return this.users;
  }

  findOne(id: number) {
    return this.users.find(user => user.id === id);
  }
}
