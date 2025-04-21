import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import React from "react";


interface Course {
  courseId: string;
  title: string;
  description: string;
  image: string;
  teacherName: string;
  teacherId: string;
  category: string;
  level: "Beginner" | "Advanced";
  status: "Published" | "Draft";
  sections?: {
    sectionId: string;
    sectionTitle: string;
    chapters: {
      chapterId: string;
      title: string;
      type: string;
    }[];
  }[];
}

interface CourseCardSearchProps {
  course: Course;
  isSelected: boolean;
  onGoToCourse: () => void;  // Changed from onClick to match parent component
}

const CourseCardSearch: React.FC<CourseCardSearchProps> = ({
  course,
  isSelected,
  onGoToCourse,
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
        /**src={course.image || "/placeholder.png"}*/
          src={"/placeholder.png"}
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
            {course.description || "No description available"}
          </p>
        </div>
        <div className="mt-2">
          <p className="course-card-search__teacher">By {course.teacherName}</p>
          <div className="course-card-search__footer">
            <span className="text-primary-600 flex items-center gap-2">
              <span className="px-2 py-1 text-xs rounded-full bg-primary-100 text-white-100">
                {course.level}
              </span>
            </span>
            <span className="course-card-search__status">
              {course.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCardSearch;
