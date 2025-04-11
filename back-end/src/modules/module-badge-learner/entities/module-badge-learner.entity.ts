import { Learner } from "src/modules/learner/entities/learner.entity";
import { ModuleBadge } from "src/modules/module-badge/entities/module-badge.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('module_badge_learner')  
export class ModuleBadgeLearner { 
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Learner, (learner) => learner.moduleBadges)
  @JoinColumn({ name: 'learnerId' })
  learner: Learner;

  @ManyToOne(() => ModuleBadge, (moduleBadge) => moduleBadge.learners)
  @JoinColumn({ name: 'moduleBadgeId' })
  moduleBadge: ModuleBadge;

  @Column()
  earnedDate: Date;
}