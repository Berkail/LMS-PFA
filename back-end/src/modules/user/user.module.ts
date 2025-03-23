import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { EncryptionModule } from 'src/core/common/utils/encryption/encryption.module';
import { LearnerModule } from '../learner/learner.module';
import { InstructorModule } from '../instructor/instructor.module';

@Module({
  controllers: [],
  providers: [UserService],
  imports: [EncryptionModule, LearnerModule, InstructorModule],
  exports: [UserService],
})
export class UserModule {}
