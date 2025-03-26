import { Module } from '@nestjs/common';
import { LearnerService } from './learner.service';
import { LearnerController } from './learner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Learner } from './entities/learner.entity';
import { UserModule } from '../user/user.module';
import { PaginationModule } from 'src/core/pagination/pagination.module';
import { EncryptionModule } from 'src/core/common/utils/encryption/encryption.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Learner]),
    EncryptionModule,
    PaginationModule,
  ],
  controllers: [LearnerController],
  providers: [LearnerService],
  exports: [LearnerService],
})
export class LearnerModule {}
