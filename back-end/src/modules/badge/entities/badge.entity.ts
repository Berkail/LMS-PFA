import { Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class Badge {
  @PrimaryGeneratedColumn()
  badgeId: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  imageUrl: string;
}
