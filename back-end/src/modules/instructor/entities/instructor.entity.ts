import { User } from 'src/modules/user/entities/user.entity';
import { Entity } from 'typeorm';

@Entity({ name: 'instructors' })
export class Instructor extends User {
  public getRole(): string {
    return 'instructor';
  }
}
