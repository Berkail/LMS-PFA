import { Module } from '@nestjs/common';
import { LearnerService } from './learner.service';
import { LearnerController } from './learner.controller';

@Module({
  controllers: [LearnerController],
  providers: [LearnerService],
})
export class LearnerModule {}
