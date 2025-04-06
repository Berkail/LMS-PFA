"use client";

import Toolbar from "@/components/Toolbar";
import CourseCard from "@/components/CourseCard";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useState, useMemo, useEffect } from "react";
import Loading from "@/components/Loading";
import { CourseSkeleton } from "@/components/skeletons/CourseSkeleton";

const dummyCourses = [
  {
    courseId: "course1",
    title: "Introduction to React",
    description: "Learn the basics of React",
    image: "/placeholder.png",
    teacherName: "John Doe",
    category: "Programming",
    progress: 30,
    sections: [
      {
        sectionId: "section1",
        sectionTitle: "Getting Started",
        chapters: [
          { chapterId: "chapter1", title: "Introduction to React", type: "Text" },
          { chapterId: "chapter2", title: "Setting Up Environment", type: "Text" }
        ]
      },
      {
        sectionId: "section2",
        sectionTitle: "React Fundamentals",
        chapters: [
          { chapterId: "chapter3", title: "Components", type: "Text" },
          { chapterId: "chapter4", title: "Props & State", type: "Text" }
        ]
      }
    ]
  },
  {
    courseId: "course2",
    title: "Advanced JavaScript",
    description: "Master JavaScript concepts",
    image: "/placeholder.png",
    teacherName: "Jane Smith",
    category: "Programming",
    progress: 70,
  },
];

const Courses = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

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

  const handleGoToCourse = (course: any) => {
    if (
      course.sections &&
      course.sections.length > 0 &&
      course.sections[0].chapters.length > 0
    ) {
      const firstChapter = course.sections[0].chapters[0];
      router.push(
        `/student/courses/${course.courseId}/chapters/${firstChapter.chapterId}`
      );
    } else {
      router.push(`/student/courses/${course.courseId}`);
    }
  };
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Set to 3.5 seconds

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="user-courses">
        <Header title="My Courses" subtitle="View your enrolled courses" />
        <Toolbar
          onSearch={setSearchTerm}
          onCategoryChange={setSelectedCategory}
        />
        <div className="user-courses__grid">
          {filteredCourses.map((course) => (
            <CourseSkeleton key={course.courseId} />
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
            key={course.courseId}
            course={course}
            onGoToCourse={handleGoToCourse}
          />
        ))}
      </div>
    </div>
  );
};

export default Courses;
