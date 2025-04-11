import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleBadge } from './entities/module-badge.entity';
import { CourseModule } from '../course-module/entities/course-module.entity';
import { Learner } from '../learner/entities/learner.entity';
import { ModuleBadgeService } from './module-badge.service';
import { ModuleBadgeController } from './module-badge.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ModuleBadge,
      CourseModule, 
      Learner
    ]),
  ],
  controllers: [ModuleBadgeController],
  providers: [ModuleBadgeService],
  exports: [ModuleBadgeService],
})
export class ModuleBadgeModule {}