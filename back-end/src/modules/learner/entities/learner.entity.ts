import { User } from 'src/modules/user/entities/user.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'learners' })
export class Learner extends User {
  public getRole(): string {
    return 'learner';
  }

  @Column({ type: 'date' })
  birthdate: Date;
}
