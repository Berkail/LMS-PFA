import { CourseElement } from 'src/modules/course-element/entities/course-element.entity';
import { Course } from 'src/modules/course/entities/course.entity';
import { ModuleBadge } from 'src/modules/module-badge/entities/module-badge.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';

@Entity({ name: 'course_modules' })
export class CourseModule extends CourseElement {
  @Column()
  order: number;

  @ManyToOne(() => Course, (course) => course.courseModules)
  course: Course;

  @OneToMany(() => ModuleBadge, (moduleBadge) => moduleBadge.courseModule)
  moduleBadges: ModuleBadge[];
}
