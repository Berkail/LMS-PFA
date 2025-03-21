export interface EncryptionInterface {
  hashSync(plainText: string): string;
  compareSync(plainText: string, hash: string): boolean;
}
