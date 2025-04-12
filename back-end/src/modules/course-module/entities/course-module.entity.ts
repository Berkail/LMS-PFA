import { CourseElement } from 'src/modules/course-element/entities/course-element.entity';
import { Course } from 'src/modules/course/entities/course.entity';
import { Lesson } from 'src/modules/lesson/entities/lesson.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'course_modules' })
export class CourseModule extends CourseElement {
  @Column()
  order: number;

  @OneToMany(() => Lesson, (lesson) => lesson.courseModule)
  lessons: Lesson[];

  @ManyToOne(() => Course, (course) => course.courseModules)
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column({ name: 'course_id' })
  courseId: number;
}
