"use client";

import Toolbar from "@/components/Toolbar";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import React, { useState, useMemo, useEffect } from "react";
import CourseCardSearch from "@/components/CourseCardSearch";
import SelectedCourse from "./SelectedCourse";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CourseSkeleton } from "@/components/skeletons/CourseSkeleton";

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

interface CourseResponse {
  data: ApiCourse[];
  meta: {
    itemsPerPage: number;
    sortBy: [string, string][];
  };
  links: {
    previous: string | null;
    current: string;
    next: string | null;
  };
}

interface ApiCourse {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  publishedAt: string | null;
  description: string | null;
  pathToImg: string;
  difficulty: string;
  instructorId: number;
  courseModules: ApiCourseModule[];
  instructor: {
    id: number;
    username: string;
  }
}

interface ApiCourseModule {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  publishedAt: string | null;
  order: number;
  courseId: number;
  lessons: ApiLesson[];
}

interface ApiLesson {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  publishedAt: string | null;
  pathToUrlVid: string;
  courseModuleId: number;
}

const Search = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const transformApiCourse = (apiCourse: ApiCourse): Course => ({
    courseId: apiCourse.id.toString(),
    title: apiCourse.title,
    description: apiCourse.description || "",
    image: `http://localhost/api/${apiCourse.pathToImg}`,
    teacherName: apiCourse.instructor.username,
    teacherId: apiCourse.instructor.id.toString(),
    category: "Programming",
    level: apiCourse.difficulty === "beginner" ? "Beginner" : "Advanced",
    status: apiCourse.publishedAt ? "Published" : "Draft",
    sections: apiCourse.courseModules.map(module => ({
      sectionId: module.id.toString(),
      sectionTitle: module.title,
      chapters: module.lessons.map(lesson => ({
        chapterId: lesson.id.toString(),
        title: lesson.title,
        type: "Video"
      }))
    }))
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost/api/courses', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }

        const courseData: CourseResponse = await response.json();
        const transformedCourses = courseData.data.map(transformApiCourse);
        setCourses(transformedCourses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch = course.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || course.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [courses, searchTerm, selectedCategory]);

  useEffect(() => {
    if (id && courses.length > 0) {
      const course = courses.find((course) => course.courseId === id);
      setSelectedCourse(course || courses[0]);
    }
  }, [id, courses]);

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    setIsDialogOpen(true);
  };

  const handleEnrollNow = async (courseId: string) => {
    try {
      const response = await fetch(`http://localhost/api/courses/${courseId}/enrollments`, {
        method: 'POST',
        credentials: 'include',
      });
  
      if (!response.ok) {
        throw new Error('Failed to enroll in course');
      }
  
      router.push(`/student/courses/${courseId}`);
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  return (
    <div className="user-courses">
      <Header 
        title="Search for courses" 
        subtitle="Find new courses to gain more skills" 
      />
      <Toolbar
        onSearch={setSearchTerm}
        onCategoryChange={setSelectedCategory}
      />
      <h2>{filteredCourses.length} available courses</h2>
      <div className="user-courses__grid">
        {isLoading ? (
          Array(6).fill(0).map((_, index) => (
            <CourseSkeleton key={index} />
          ))
        ) : filteredCourses.length === 0 ? (
          <p className="text-muted-foreground">No courses found</p>
        ) : (
          filteredCourses.map((course) => (
            <CourseCardSearch
              key={course.courseId}
              course={course}
              isSelected={selectedCourse?.courseId === course.courseId}
              onGoToCourse={() => handleCourseSelect(course)}
            />
          ))
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="search__selected-course">
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <SelectedCourse
            course={selectedCourse}
            handleEnrollNow={handleEnrollNow}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Search;