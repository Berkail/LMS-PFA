import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EncryptionModule } from '../common/utils/encryption/encryption.module';
import { SessionModule } from '../session/session.module';
import { InstructorModule } from 'src/modules/instructor/instructor.module';
import { LearnerModule } from 'src/modules/learner/learner.module';

@Module({
  imports: [EncryptionModule, SessionModule, InstructorModule, LearnerModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
