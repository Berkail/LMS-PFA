import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseModule } from 'src/modules/course-module/entities/course-module.entity';
import { Course } from 'src/modules/course/entities/course.entity';
import { Enrollment } from 'src/modules/enrollment/entities/enrollment.entity';
import { Instructor } from 'src/modules/instructor/entities/instructor.entity';
import { Learner } from 'src/modules/learner/entities/learner.entity';
<<<<<<<<< Temporary merge branch 1
import { Lesson } from 'src/modules/lesson/entities/lesson.entity';
=========
import { Exam } from '../../modules/exam/entities/exam.entity';
>>>>>>>>> Temporary merge branch 2

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
<<<<<<<<< Temporary merge branch 1
        entities: [
          Learner,
          Instructor,
          Course,
          CourseModule,
          Enrollment,
          Lesson,
        ],
        synchronize: process.env.NODE_ENV === 'development',
        logging: process.env.NODE_ENV === 'development',
        //dropSchema: true,
=========
        entities: [Learner, Instructor, Course, CourseModule, Enrollment, Exam],
        synchronize: process.env.NODE_ENV === 'development',
        logging: process.env.NODE_ENV === 'development',
        dropSchema: false,
>>>>>>>>> Temporary merge branch 2
      }),
    }),
  ],
})
export class DatabaseModule {}
