"use client";

import Header from "@/components/Header";
import Loading from "@/components/Loading";
import TeacherCourseCard from "@/components/TeacherCourseCard";
import Toolbar from "@/components/Toolbar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";


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

const Courses = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredCourses = useMemo(() => {
    return dummyCourses.filter((course) => {
      const matchesSearch = course.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || course.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const handleEdit = (course: Course) => {
    router.push(`/teacher/courses/${course.courseId}`, {
      scroll: false,
    });
  };

  const handleDelete = async (course: Course) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      console.log("Deleting course:", course.courseId);
    }
  };

  const handleCreateCourse = () => {
    const newCourseId = "create-new-cours";
    const newCourse: Course = {
      courseId: newCourseId,
      teacherId: "teacher1",
      teacherName: "John Doe",
      title: "",
      description: "",
      image: "/placeholder.png",
      category: "",
      status: "draft",
      level: "Beginner",
      sections: []
    };
    
    console.log("Creating new course:", newCourse);
    router.push(`/teacher/courses/${newCourseId}`);
  };

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
            key={course.courseId}
            course={course}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isOwner={course.teacherId === "teacher1"} // Assuming current user is teacher1
          />
        ))}
      </div>
    </div>
  );
};

export default Courses;