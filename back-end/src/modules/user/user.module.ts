import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { EncryptionModule } from 'src/core/common/utils/encryption/encryption.module';

@Module({
  controllers: [],
  providers: [UserService],
  imports: [EncryptionModule],
  exports: [UserService],
})
export class UserModule {}
