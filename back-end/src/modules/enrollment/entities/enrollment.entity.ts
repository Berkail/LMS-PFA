import { Course } from 'src/modules/course/entities/course.entity';
import { Learner } from 'src/modules/learner/entities/learner.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { EnrollmentStatus } from '../enums/enrollement-status.enum';

@Entity({ name: 'enrollments' })
export class Enrollment {
  @PrimaryColumn({ name: 'course_id' })
  courseId: number;

  @PrimaryColumn({ name: 'learner_id' })
  learnerId: number;

  @ManyToOne(() => Course, (course) => course.enrollments, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @ManyToOne(() => Learner, (learner) => learner.enrollments, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'learner_id' })
  learner: Learner;

  @Column({ name: 'enrolled_at', nullable: true, type: 'timestamp' })
  enrolledAt?: Date | null;

  @Column({
    type: 'enum',
    enum: EnrollmentStatus,
    default: EnrollmentStatus.PENDING,
  })
  status: EnrollmentStatus;
}
