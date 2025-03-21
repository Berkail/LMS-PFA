import * as bcrypt from 'bcrypt';
import { EncryptionInterface } from './encryption.interface';

export class BcryptEncryption implements EncryptionInterface {
  private readonly saltRounds = 10;

  hashSync(plainText: string): string {
    return bcrypt.hashSync(plainText, this.saltRounds);
  }

  compareSync(plainText: string, hash: string): boolean {
    return bcrypt.compareSync(plainText, hash);
  }
}
