import AccordionSections from '@/components/AccordionSections'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import React from 'react'

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

interface SelectedCourseProps {
  course: Course | null;
  handleEnrollNow: (courseId: string) => void;
}

const SelectedCourse = ({ course, handleEnrollNow }: SelectedCourseProps) => {
  if (!course) {
    return <div>No course selected</div>;
  }

  return (
    <div className="selected-course-container">
      <div className="selected-course">
        <div>
          <h3 className="selected-course__title">{course.title}</h3>
          <div className="flex items-center gap-2 mt-3">
            <Avatar className="w-6 h-6">
              <AvatarImage src={course.image} alt={course.teacherName} />
              <AvatarFallback className="bg-secondary-700 text-black">
                {course.teacherName[0]}
              </AvatarFallback>
            </Avatar>
            <p className="text-sm text-customgreys-dirtyGrey">
              {course.teacherName}
            </p>
            <span className="ml-2 px-2 py-1 text-xs rounded-full bg-primary-100">
              {course.level}
            </span>
          </div>
        </div>

        <div className="selected-course__content">
          <p className="selected-course__description">
            {course.description || "No description available"}
          </p>

          {course.sections && course.sections.length > 0 && (
            <div className="selected-course__sections">
              <h4 className="selected-course__sections-title">Course content</h4>
              <AccordionSections sections={course.sections} />
            </div>
          )}

          <div className="selected-course--footer mt-3">
            <div className="selected-course__status">
              <span className={`status-badge status-badge--${course.status.toLowerCase()}`}>
                {course.status}
              </span>
            </div>
            <Button 
              className="bg-primary selected-course__enroll-now" 
              onClick={() => handleEnrollNow(course.courseId)}
              disabled={course.status === "Draft"}
            >
              {course.status === "Published" ? "Enroll Now" : "Coming Soon"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SelectedCourse