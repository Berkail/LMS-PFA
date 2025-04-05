import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../enums/user-role.enum';

export abstract class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  username: string;

  @Column()
  email: string;

  @Column({ select: false })
  hashedPassword: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date | null;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;

  public abstract getRole(): UserRole;

  public get isDeleted(): boolean {
    return !!this.deletedAt;
  }
}
