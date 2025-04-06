import { CourseElement } from 'src/modules/course-element/entities/course-element.entity';
import { Course } from 'src/modules/course/entities/course.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'course_modules' })
export class CourseModule extends CourseElement {
  @Column()
  order: number;

  @ManyToOne(() => Course, (course) => course.courseModules)
  course: Course;
}
