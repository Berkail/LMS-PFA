import { Column, Entity } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Instructor extends User {
  
  public getRole() {
    throw new Error('Method not implemented.');
  }
  @Column()
  expertise: string;
}
