import { CourseElement } from 'src/modules/course-element/entities/course-element.entity';
import { Course } from 'src/modules/course/entities/course.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'course_modules' })
export class CourseModule extends CourseElement {
  @Column()
  order: number;

  @ManyToOne(() => Course, (course) => course.courseModules)
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column({ name: 'course_id' })
  courseId: number;
}
