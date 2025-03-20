import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { Student } from '../entities/student.entity'; 
import { Teacher } from '../entities/teacher.entity'; 

@Module({
  imports: [TypeOrmModule.forFeature([Student, Teacher])], 
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
