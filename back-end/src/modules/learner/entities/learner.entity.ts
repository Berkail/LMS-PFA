import { Enrollment } from 'src/modules/enrollment/entities/enrollment.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'learners' })
export class Learner extends User {
  public getRole(): string {
    return 'learner';
  }

  @Column({ type: 'date' })
  birthdate: Date;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.learner)
  enrollments: Enrollment[];
}
