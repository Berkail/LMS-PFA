import { Column, Entity } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Instructor extends User {
  @Column()
  expertise: string;
}
