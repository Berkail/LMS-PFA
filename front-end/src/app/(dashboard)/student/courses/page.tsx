"use client";

import Toolbar from "@/components/Toolbar";
import CourseCard from "@/components/CourseCard";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useState, useMemo, useEffect } from "react";
import { CourseSkeleton } from "@/components/skeletons/CourseSkeleton";
import { useSidebar } from "@/components/ui/sidebar";


interface Instructor {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface Course {
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
  instructor: Instructor;
}

interface Enrollment {
  courseId: number;
  learnerId: number;
  enrolledAt: string;
  status: string;
  course: Course;
}

interface EnrollmentResponse {
  data: Enrollment[];
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

interface Lesson {
  id: number;
  title: string;
  pathToUrlVid: string;
  courseModuleId: number;
}

interface CourseModule {
  id: number;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface CourseDetails {
  id: number;
  title: string;
  courseModules: CourseModule[];
}

interface CourseDetailsResponse {
  data: CourseDetails[];
}

const Courses = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await fetch('http://localhost/api/learners/me/enrollments', {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch enrolled courses');
        }

        const data: EnrollmentResponse = await response.json();
const courses = data.data
  .filter(enrollment => enrollment && enrollment.course) // Filter out null/undefined entries
  .map(enrollment => enrollment.course);
setEnrolledCourses(courses);
console.log('API Response:', data);
console.log('Mapped courses:', data.data.map(enrollment => enrollment.course));
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    return enrolledCourses.filter((course) => {
      // Add null check
      if (!course || !course.title) {
        return false;
      }
      
      const matchesSearch = course.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || selectedCategory === "Programming";
      return matchesSearch && matchesCategory;
    });
  }, [enrolledCourses, searchTerm, selectedCategory]);

  const handleGoToCourse = async (course: Course) => {
    try {
      const response = await fetch('http://localhost/api/courses/', {
        credentials: 'include'
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch course details');
      }
  
      const courseDetails: CourseDetailsResponse = await response.json();
      // Find the specific course from the response
      const specificCourse = courseDetails.data.find(c => c.id === course.id);
  
      if (!specificCourse || !specificCourse.courseModules.length) {
        throw new Error('Course or modules not found');
      }
  
      const firstModule = specificCourse.courseModules[0];
      const firstLesson = firstModule.lessons[0];
  
      if (firstLesson) {
        router.push(`/student/courses/${course.id}/chapters/${firstLesson.id}`);
      } else {
        console.error('No lessons found in this course');
      }
    } catch (error) {
      console.error('Error fetching course details:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="user-courses">
        <Header title="My Courses" subtitle="View your enrolled courses" />
        <Toolbar
          onSearch={setSearchTerm}
          onCategoryChange={setSelectedCategory}
        />
        <div className="user-courses__grid">
          {Array(3).fill(0).map((_, index) => (
            <CourseSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="user-courses">
      <Header title="My Courses" subtitle="View your enrolled courses" />
      <Toolbar
        onSearch={setSearchTerm}
        onCategoryChange={setSelectedCategory}
      />
      <div className="user-courses__grid">
        {filteredCourses.map((course) => (
          <CourseCard
            key={course.id}
            course={{
              courseId: course.id.toString(),
              title: course.title,
              description: course.description || "No description available",
              image: course.pathToImg,
              teacherName: `${course.instructor.firstName} ${course.instructor.lastName}`,
              category: "Programming"
            }}
            onGoToCourse={() => handleGoToCourse(course)}
          />
        ))}
      </div>
    </div>
  );
};

export default Courses;