import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import React from "react";


interface Course {
  courseId: string;
  title: string;
  description: string;
  image: string;
  teacherName: string;
  category: string;
  enrollments?: any[];
}

interface CourseCardSearchProps {
  course: Course;
  isSelected: boolean;
  onGoToCourse: () => void;  // Changed from onClick to match parent component
}

const CourseCardSearch: React.FC<CourseCardSearchProps> = ({
  course,
  isSelected,
  onGoToCourse,  // Changed from onClick
}) => {
  return (
    <div
      onClick={onGoToCourse}
      className={`course-card-search group ${
        isSelected
          ? "course-card-search--selected"
          : "course-card-search--unselected"
      }`}
    >
      <div className="course-card-search__image-container">
        <Image
          src={course.image || "/placeholder.png"}
          alt={course.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="course-card-search__image"
          priority
        />
      </div>
      <div className="course-card-search__content">
        <div>
          <h2 className="course-card-search__title">{course.title}</h2>
          <p className="course-card-search__description">
            {course.description}
          </p>
        </div>
        <div className="mt-2">
          <p className="course-card-search__teacher">By {course.teacherName}</p>
          <div className="course-card-search__footer">
            <span className="course-card-search__price">
              {course.category}
            </span>
            <span className="course-card-search__enrollment">
              {course.enrollments?.length} Enroll
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCardSearch;
