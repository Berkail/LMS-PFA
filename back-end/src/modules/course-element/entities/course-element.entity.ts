import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class CourseElement {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date | null;
  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;
  @Column({ name: 'published_at', type: 'timestamp', nullable: true })
  publishedAt: Date | null;

  public isPublished(): boolean {
    return this.publishedAt !== null;
  }
}
