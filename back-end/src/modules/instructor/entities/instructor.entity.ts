import { User } from 'src/modules/user/entities/user.entity';
import { Column, Entity } from 'typeorm';


@Entity()
export class Instructor extends User {
  
  public getRole(): string {
    throw new Error('Method not implemented.');
  }
  @Column()
  expertise: string;
}
