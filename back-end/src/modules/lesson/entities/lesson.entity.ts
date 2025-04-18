import { CourseElement } from 'src/modules/course-element/entities/course-element.entity';
import { CourseModule } from 'src/modules/course-module/entities/course-module.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'lessons' })
export class Lesson extends CourseElement {
  @Column({ name: 'path_to_url_vid' })
  pathToUrlVid: string;

  @ManyToOne(() => CourseModule, (courseModule) => courseModule.lessons)
  @JoinColumn({ name: 'course_module_id' })
  courseModule: CourseModule;

  @Column({ name: 'course_module_id' })
  courseModuleId: number;
}
