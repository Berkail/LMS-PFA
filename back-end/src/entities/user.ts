export abstract class User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  birthDate: Date;
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date;

  abstract getRole(): string;
}
