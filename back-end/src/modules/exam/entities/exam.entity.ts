import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany
} from 'typeorm';
import { Instructor } from '../../instructor/entities/instructor.entity';

@Entity({ name: 'exams' })
export class Exam {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ nullable: true })
    pdfPath: string;

    // Pour stocker le nom original du fichier
    @Column({ nullable: true })
    pdfName: string;

    @Column({ nullable: true })
    publishedAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ default: false })
    isPublished: boolean;

    @Column()
    instructorId: number;

    @ManyToOne(() => Instructor, instructor => instructor.exams, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'instructorId' })
    instructor: Instructor;
}