import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assignment } from 'src/modules/assignment/entities/assignment.entity';
import { Badge } from 'src/modules/badge/entities/badge.entity';
import { CourseModule } from 'src/modules/course-module/entities/course-module.entity';
import { Course } from 'src/modules/course/entities/course.entity';
import { Enrollment } from 'src/modules/enrollment/entities/enrollment.entity';
import { Instructor } from 'src/modules/instructor/entities/instructor.entity';
import { Learner } from 'src/modules/learner/entities/learner.entity';
import { Lesson } from 'src/modules/lesson/entities/lesson.entity';
import { ModuleBadgeLearner } from 'src/modules/module-badge-learner/entities/module-badge-learner.entity';
import { ModuleBadge } from 'src/modules/module-badge/entities/module-badge.entity';

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
        entities: [Learner, Instructor, Course, CourseModule, Enrollment, Lesson, Assignment,ModuleBadge,ModuleBadgeLearner],
        synchronize: process.env.NODE_ENV === 'development',
        logging: process.env.NODE_ENV === 'development',
      }),
    }),
  ],
})
export class DatabaseModule {}
