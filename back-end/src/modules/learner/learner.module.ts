import { Module } from '@nestjs/common';
import { LearnerService } from './learner.service';
import { LearnerController } from './learner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Learner } from './entities/learner.entity';
import { EncryptionModule } from 'src/core/common/utils/encryption/encryption.module';
import { LearnerMapper } from './mappers/learner.mapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([Learner]),
    EncryptionModule,
  ],
  controllers: [LearnerController],
  providers: [LearnerService, LearnerMapper],
  exports: [LearnerService],
})
export class LearnerModule {}
