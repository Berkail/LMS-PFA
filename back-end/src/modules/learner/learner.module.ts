import { Module } from '@nestjs/common';
import { LearnerService } from './learner.service';
import { LearnerController } from './learner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Learner } from './entities/learner.entity';
import { UserModule } from '../user/user.module';
import { PaginationModule } from 'src/core/pagination/pagination.module';

@Module({
  imports: [TypeOrmModule.forFeature([Learner]), UserModule, PaginationModule],
  controllers: [LearnerController],
  providers: [LearnerService],
})
export class LearnerModule {}
