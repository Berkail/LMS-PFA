import { CourseElement } from 'src/modules/course-element/entities/course-element.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class CourseModule extends CourseElement {
  @Column()
  order: number;
}
