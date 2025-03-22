import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { EncryptionModule } from 'src/core/common/utils/encryption/encryption.module';
import { Learner } from '../learner/entities/learner.entity';
import { LearnerModule } from '../learner/learner.module';

@Module({
  controllers: [],
  providers: [UserService],
  imports: [EncryptionModule, LearnerModule],
  exports: [UserService],
})
export class UserModule {}
