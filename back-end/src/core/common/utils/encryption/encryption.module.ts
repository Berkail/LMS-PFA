import { Module } from '@nestjs/common';
import { BcryptEncryption } from './bcrypt-encryption.util';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: 'ENCRYPTION_UTIL',
      useClass: BcryptEncryption,
    },
  ],
  exports: ['ENCRYPTION_UTIL'],
})
export class EncryptionModule {}
