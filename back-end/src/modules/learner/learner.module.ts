import { Module } from '@nestjs/common';
import { LearnerService } from './learner.service';
import { LearnerController } from './learner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Learner } from './entities/learner.entity';
import { EncryptionModule } from 'src/core/common/utils/encryption/encryption.module';
import { LearnerMapper } from './mappers/learner.mapper';
import { Enrollment } from '../enrollment/entities/enrollment.entity';
import { EnrollmentModule } from '../enrollment/enrollment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Learner]),
    EncryptionModule,
    EnrollmentModule,
  ],
  controllers: [LearnerController],
  providers: [LearnerService, LearnerMapper],
  exports: [LearnerService],
})
export class LearnerModule {}
