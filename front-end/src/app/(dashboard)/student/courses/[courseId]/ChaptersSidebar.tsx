"use client";

import { useState, useEffect, useRef, use } from "react";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  CheckCircle,
  Trophy,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import { ChaptersSidebarSkeleton } from "@/components/skeletons/ChaptersSidebarSkeleton";

interface Lesson {
  id: number;
  title: string;
  pathToUrlVid: string;
  publishedAt: string;
  courseModuleId: number;
}

interface CourseModule {
  id: number;
  title: string;
  order: number;
  publishedAt: string;
  lessons: Lesson[];
}

interface Course {
  id: number;
  title: string;
  description: string;
  courseModules: CourseModule[];
}

interface EnrollmentResponse {
  courseId: number;
  learnerId: number;
  course: Course;
}

const ChaptersSidebar = () => {
  const router = useRouter();
  const { setOpen } = useSidebar();
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [courseData, setCourseData] = useState<Course | null>(null);
  
  const sidebarRef = useRef<HTMLDivElement>(null);
  const {toggleSidebar} = useSidebar();

  const pathArray = window.location.pathname.split('/');
  const courseId = pathArray[pathArray.indexOf('courses') + 1];
  const lessonId = pathArray[pathArray.indexOf('lessons') + 1];

  useEffect(() => {
    toggleSidebar();
  }, []);
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await fetch(`http://localhost/api/learners/me/enrollments/by-course?courseId=${courseId}`);
        const data: EnrollmentResponse = await response.json();
        setCourseData(data.course);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching course data:', error);
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  if (isLoading || !courseData) {
    return <ChaptersSidebarSkeleton />;
  }

  const toggleModule = (moduleTitle: string) => {
    setExpandedModules((prevModules) =>
      prevModules.includes(moduleTitle)
        ? prevModules.filter((title) => title !== moduleTitle)
        : [...prevModules, moduleTitle]
    );
  };

  const handleLessonClick = (moduleId: number, lessonId: number) => {
    router.push(`/student/courses/${courseId}/chapters/${lessonId}`, {
      scroll: false,
    });
  };

  return (
    <div ref={sidebarRef} className="chapters-sidebar">
      <div className="chapters-sidebar__header">
        <h2 className="chapters-sidebar__title">{courseData.title}</h2>
        <hr className="chapters-sidebar__divider" />
      </div>
      {courseData.courseModules.map((module, index) => (
        <CourseModule
          key={module.id}
          module={module}
          index={index}
          lessonId={lessonId as string}
          courseId={courseId as string}
          expandedModules={expandedModules}
          toggleModule={toggleModule}
          handleLessonClick={handleLessonClick}
        />
      ))}
    </div>
  );
};

const CourseModule = ({
  module,
  index,
  lessonId,
  courseId,
  expandedModules,
  toggleModule,
  handleLessonClick,
}: {
  module: CourseModule;
  index: number;
  lessonId: string;
  courseId: string;
  expandedModules: string[];
  toggleModule: (moduleTitle: string) => void;
  handleLessonClick: (moduleId: number, lessonId: number) => void;
}) => {
  const totalLessons = module.lessons.length;
  const isExpanded = expandedModules.includes(module.title);

  return (
    <div className="chapters-sidebar__section">
      <div
        onClick={() => toggleModule(module.title)}
        className="chapters-sidebar__section-header"
      >
        <div className="chapters-sidebar__section-title-wrapper">
          <p className="chapters-sidebar__section-number">
            Module {module.order}
          </p>
          {isExpanded ? (
            <ChevronUp className="chapters-sidebar__chevron" />
          ) : (
            <ChevronDown className="chapters-sidebar__chevron" />
          )}
        </div>
        <h3 className="chapters-sidebar__section-title">
          {module.title}
        </h3>
      </div>
      <hr className="chapters-sidebar__divider" />

      {isExpanded && (
        <div className="chapters-sidebar__section-content">
          <ul className="chapters-sidebar__chapters">
            {module.lessons.map((lesson) => (
              <LessonItem
                key={lesson.id}
                lesson={lesson}
                moduleId={module.id}
                currentLessonId={lessonId}
                handleLessonClick={handleLessonClick}
              />
            ))}
          </ul>
        </div>
      )}
      <hr className="chapters-sidebar__divider" />
    </div>
  );
};

const LessonItem = ({
  lesson,
  moduleId,
  currentLessonId,
  handleLessonClick,
}: {
  lesson: Lesson;
  moduleId: number;
  currentLessonId: string;
  handleLessonClick: (moduleId: number, lessonId: number) => void;
}) => {
  const isCurrentLesson = Boolean(currentLessonId) && String(currentLessonId) === String(lesson.id);

  return (
    <li
      className={cn("chapters-sidebar__chapter", {
        "chapters-sidebar__chapter--current": isCurrentLesson,
      })}
      onClick={() => handleLessonClick(moduleId, lesson.id)}
    >
      <span
        className={cn("chapters-sidebar__chapter-title", {
          "chapters-sidebar__chapter-title--current": isCurrentLesson,
        })}
      >
        {lesson.title}
      </span>
      <FileText className="chapters-sidebar__text-icon" />
    </li>
  );
};

export default ChaptersSidebar;