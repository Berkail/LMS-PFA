import { Course } from 'src/modules/course/entities/course.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { UserRole } from 'src/modules/user/enums/user-role.enum';
import { Entity, OneToMany } from 'typeorm';

@Entity({ name: 'instructors' })
export class Instructor extends User {
  public getRole(): UserRole {
    return UserRole.INSTRUCTOR;
  }
  @OneToMany(() => Course, (course) => course.instructor)
  courses: Course[];
}
