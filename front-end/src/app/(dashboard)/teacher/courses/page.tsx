"use client";

import Header from "@/components/Header";
import Loading from "@/components/Loading";
import TeacherCourseCard from "@/components/TeacherCourseCard";
import Toolbar from "@/components/Toolbar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

const Courses = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Fetch courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost/api/courses");
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
        // If API fails, fallback to dummy data for development
        setCourses(dummyCourses);
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

  const handleEdit = (course: Course) => {
    router.push(`/teacher/courses/${course.courseId}`, {
      scroll: false,
    });
  };

  const handleDelete = async (course: Course) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost/api/courses/${course.courseId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to delete course");
        }

        // Remove the deleted course from state
        setCourses((prevCourses) =>
            prevCourses.filter((c) => c.courseId !== course.courseId)
        );

      } catch (error) {
        console.error("Error deleting course:", error);
        alert("Failed to delete course. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCreateCourse = async () => {
    setIsLoading(true);
    try {
      // Create a new course template
      const newCourse: Partial<Course> = {
        teacherId: "teacher1", // You might want to get this from auth context
        teacherName: "John Doe", // You might want to get this from auth context
        title: "New Course",
        description: "Course description",
        image: "/placeholder.png",
        category: "General",
        status: "draft",
        level: "Beginner",
        sections: []
      };

      const response = await fetch("http://localhost/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCourse),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create course");
      }

      const createdCourse = await response.json();

      // Navigate to the edit page for the new course
      router.push(`/teacher/courses/${createdCourse.courseId}`);
    } catch (error) {
      console.error("Error creating course:", error);
      alert("Failed to create course. Please try again.");
      setIsLoading(false);
    }
  };

  if (isLoading) {
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
          {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                  <TeacherCourseCard
                      key={course.courseId}
                      course={course}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      isOwner={course.teacherId === "teacher1"} // Replace with actual user ID check
                  />
              ))
          ) : (
              <p>No courses found. Create your first course!</p>
          )}
        </div>
      </div>
  );
};

// Fallback dummy data in case API fails
const dummyCourses: Course[] = [
  {
    courseId: "course1",
    teacherId: "teacher1",
    teacherName: "John Doe",
    title: "Advanced JavaScript",
    description: "Master JavaScript concepts",
    image: "/placeholder.png",
    category: "Programming",
    status: "draft",
    level: "Beginner",
    sections: []
  },
  {
    courseId: "course2",
    teacherId: "teacher1",
    teacherName: "John Doe",
    title: "React Fundamentals",
    description: "Learn React from scratch",
    image: "/hero2.jpg",
    category: "Web Development",
    status: "published",
    level: "Intermediate",
    sections: []
  }
];

export default Courses;