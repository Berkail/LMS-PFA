import { Injectable } from "@nestjs/common";
import { CourseElementService } from "../course-element/course-element.service";
import { Course } from "./entities/course.entity";


@Injectable()
export class CourseService extends CourseElementService<Course> {
  constructor() {
    super();
  }

  async create(){

  }
}
