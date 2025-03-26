export interface EncryptionInterface {
  hashSync(plainText: string): string;
  compareSync(plainText: string, hash: string): boolean;
  hash(plainText: string): string;
  compare(plainText: string, hash: string): boolean;
}
