import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import databaseConfig from './core/config/database.config';
import { DatabaseModule } from './core/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { SessionModule } from './core/session/session.module';
import { LearnerModule } from './modules/learner/learner.module';
import { InstructorModule } from './modules/instructor/instructor.module';
import { AuthModule } from './core/auth/auth.module';
import { CourseModule } from './modules/course/course.module';
import { FileUploadModule } from './core/file-upload/file-upload.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/api/uploads',
    }),

    AuthModule,
    DatabaseModule,
    SessionModule,
    LearnerModule,
    InstructorModule,
    CourseModule,
    FileUploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
