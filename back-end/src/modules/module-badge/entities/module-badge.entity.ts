import { Badge } from "src/modules/badge/entities/badge.entity";
import { CourseModule } from "src/modules/course-module/entities/course-module.entity";
import { Learner } from "src/modules/learner/entities/learner.entity";
import { Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class ModuleBadge extends Badge {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CourseModule, (courseModule) => courseModule.moduleBadges)
  @JoinColumn({ name: 'courseModuleId' })
  courseModule: CourseModule;

  @ManyToMany(() => Learner, (learner) => learner.moduleBadges)
  learners: Learner[];
}
