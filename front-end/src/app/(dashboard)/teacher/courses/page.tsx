"use client";

import Header from "@/components/Header";
import Loading from "@/components/Loading";
import TeacherCourseCard from "@/components/TeacherCourseCard";
import Toolbar from "@/components/Toolbar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

interface Lesson {
  id: number;
  title: string;
}

interface CourseModule {
  id: number;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface Instructor {
  id: number;
  username: string;
}

interface Course {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  publishedAt: string | null;
  description: string;
  pathToImg: string;
  difficulty: string;
  instructorId: number;
  courseModules: CourseModule[];
  instructor: Instructor;
}

interface ApiResponse {
  data: Course[];
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



const Courses = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [instructor, setInstructor] = useState<Instructor| null>(null);

// First useEffect to fetch instructor data
useEffect(() => {
    const fetchInstructor = async () => {
        try {
            const endpoint = 'http://localhost/api/instructors/me';
              
            const response = await fetch(endpoint, {
                credentials: 'include'
            });
            
            if (!response.ok) throw new Error(`Failed to fetch data`);
            const data = await response.json();
            setInstructor(data);
        } catch (error) {
            console.error(`Error fetching data:`, error);
        }
    };

    fetchInstructor();
}, []);

// Second useEffect to fetch courses when instructor is available
useEffect(() => {
    const fetchCourses = async () => {
        if (!instructor?.id) return; // Add this check
        
        try {
            const response = await fetch(`http://localhost/api/courses?filter.instructorId=${instructor.id}`, {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch courses');
            }

            const data: ApiResponse = await response.json();
            setCourses(data.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    fetchCourses();
}, [instructor]); 

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch = course.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [courses, searchTerm]);

  const handleEdit = (course: Course) => {
    router.push(`/teacher/courses/${course.id}`, {
      scroll: false,
    });
  };

  const handleDelete = async (course: Course) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        const response = await fetch(`http://localhost/api/courses/${course.id}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to delete course');
        }

        // Remove the deleted course from the state
        setCourses(courses.filter(c => c.id !== course.id));
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Failed to delete the course. Please try again.');
      }
    }
  };
  const handlePublish = async (course: Course) => {
    if (window.confirm("Are you sure you want to publish this course?")) {
      try {
        const response = await fetch(`http://localhost/api/courses/${course.id}/publish`, {
          method: 'PATCH',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to publish course');
        }

        // Optionally, you can update the course state here
        setCourses(courses.map(c => c.id === course.id ? { ...c, publishedAt: new Date().toISOString() } : c));
      } catch (error) {
        console.error('Error publishing course:', error);
        alert('Failed to publish the course. Please try again.');
      }
    }
  }

  const handleUpdate = async (course: Course) => {
    try {
      // Update course details
      const courseResponse = await fetch(`http://localhost/api/courses/${course.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          title: course.title,
          description: course.description,
          difficulty: course.difficulty,
          pathToImg: course.pathToImg,
        }),
      });
  
      if (!courseResponse.ok) {
        throw new Error('Failed to update course');
      }
  
      // Update course modules (sections)
      for (const module of course.courseModules) {
        const moduleResponse = await fetch(`http://localhost/api/course-modules/${module.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            title: module.title,
            order: module.order,
          }),
        });
  
        if (!moduleResponse.ok) {
          throw new Error(`Failed to update module ${module.id}`);
        }
  
        // Update lessons (chapters) for each module
        for (const lesson of module.lessons) {
          const lessonResponse = await fetch(`http://localhost/api/lessons/${lesson.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              title: lesson.title,
            }),
          });
  
          if (!lessonResponse.ok) {
            throw new Error(`Failed to update lesson ${lesson.id}`);
          }
        }
      }
  
      // Update the local state with the new course data
      setCourses(courses.map(c => c.id === course.id ? course : c));
      alert('Course updated successfully!');
    } catch (error) {
      console.error('Error updating course:', error);
      alert('Failed to update the course. Please try again.');
    }
  };

  
  const handleCreateCourse = () => {
    router.push('/teacher/courses/create');
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="teacher-courses">
      <Header
        title="Courses"
        subtitle="Browse your courses"
        rightElement={
          <Button
            onClick={handleCreateCourse}
            className="teacher-courses__header"
          >
            Create Course
          </Button>
        }
      />
      <Toolbar
        onSearch={setSearchTerm}
        onCategoryChange={setSelectedCategory}
      />
      <div className="teacher-courses__grid">
        {filteredCourses.map((course) => (
          <TeacherCourseCard
            key={course.id}
            course={course}
            onEdit={() => handleEdit(course)}
            onDelete={() => handleDelete(course)}
            onPublish={() => handlePublish(course)}
            isOwner={course.instructorId === 1} // You might want to get the actual instructor ID from auth
          />
        ))}
      </div>
    </div>
  );
};

export default Courses;