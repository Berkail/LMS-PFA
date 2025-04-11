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

  async hash(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, this.saltRounds);
  }

   async compare(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }
}
