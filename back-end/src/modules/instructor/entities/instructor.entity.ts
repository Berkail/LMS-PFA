import { Course } from 'src/modules/course/entities/course.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Entity, OneToMany } from 'typeorm';

@Entity({ name: 'instructors' })
export class Instructor extends User {
  public getRole(): string {
    return 'instructor';
  }
  @OneToMany(() => Course, (course) => course.instructor)
  courses: Course[];
}
