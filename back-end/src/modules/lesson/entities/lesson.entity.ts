import { CourseElement } from 'src/modules/course-element/entities/course-element.entity';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'lessons' })
export class Lesson extends CourseElement {
  @Column({ name: 'path_to_pdf' })
  pathToPdf: string;
}
