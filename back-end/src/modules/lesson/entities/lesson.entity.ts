import { CourseElement } from "src/modules/course-element/entities/course-element.entity";
import { Entity } from "typeorm";

@Entity({ name: 'lessons' })
export class Lesson extends CourseElement{
    
}
