import { CourseElement } from 'src/modules/course-element/entities/course-element.entity';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Level } from '../enums/level.enum';
import { Instructor } from 'src/modules/instructor/entities/instructor.entity';
import { Enrollment } from 'src/modules/enrollment/entities/enrollment.entity';

@Entity({name: 'courses'})
export class Course extends CourseElement {
  @PrimaryGeneratedColumn()
  id : number;

  @Column({ nullable: true })
  pathToImg: string;

  @Column({ type: 'enum', enum: Level, default: Level.INTERMEDIATE })
  level: Level;

  @ManyToOne(() => Instructor, (instructor) => instructor.courses, {nullable : false})
  instructor: Instructor;
  
  @OneToMany(() => Enrollment, (enrollment) => enrollment.course, {nullable: true})
  enrollments : Enrollment[];
}
