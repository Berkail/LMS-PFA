import { CourseElement } from 'src/modules/course-element/entities/course-element.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Instructor } from 'src/modules/instructor/entities/instructor.entity';
import { Enrollment } from 'src/modules/enrollment/entities/enrollment.entity';
import { CourseDifficulty } from '../enums/course-difficulty.enum';
import { CourseModule } from 'src/modules/course-module/entities/course-module.entity';

@Entity({ name: 'courses' })
export class Course extends CourseElement {
  @Column({ nullable: true })
  pathToImg: string;

  @Column({
    type: 'enum',
    enum: CourseDifficulty,
    default: CourseDifficulty.INTERMEDIATE,
  })
  difficulty: CourseDifficulty;

  @ManyToOne(() => Instructor, (instructor) => instructor.courses, {
    nullable: false,
  })
  instructor: Instructor;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course, {
    nullable: true,
  })
  enrollments: Enrollment[];

  @OneToMany(() => CourseModule, (courseModule) => courseModule.course)
  courseModules : CourseModule
}
