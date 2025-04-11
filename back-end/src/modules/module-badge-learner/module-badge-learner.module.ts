import { Module } from '@nestjs/common';
import { ModuleBadgeLearnerController } from './module-badge-learner.controller';
import { ModuleBadgeLearnerService } from './module-badge-learner.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleBadgeLearner } from './entities/module-badge-learner.entity';
import { ModuleBadge } from '../module-badge/entities/module-badge.entity';
import { Learner } from '../learner/entities/learner.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ModuleBadgeLearner,
      ModuleBadge,
      Learner
    ]),
  ],
  controllers: [ModuleBadgeLearnerController],
  providers: [ModuleBadgeLearnerService],
  exports: [ModuleBadgeLearnerService],
})
export class ModuleBadgeLearnerModule {}
