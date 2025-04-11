import { Enrollment } from 'src/modules/enrollment/entities/enrollment.entity';
import { ModuleBadge } from 'src/modules/module-badge/entities/module-badge.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { UserRole } from 'src/modules/user/enums/user-role.enum';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

@Entity({ name: 'learners' })
export class Learner extends User {
  public getRole(): UserRole {
    return UserRole.LEARNER;
  }

  @Column({ type: 'date' })
  birthdate: Date;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.learner)
  enrollments: Enrollment[];

  @ManyToMany(() => ModuleBadge, (moduleBadge) => moduleBadge.learners)
  @JoinTable({ name: 'module_badge_learner' })
  moduleBadges: ModuleBadge[];
}
