import { Column, Entity } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Student extends User {
  @Column()
  grade: string;
}