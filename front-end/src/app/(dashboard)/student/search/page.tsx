"use client";

import Toolbar from "@/components/Toolbar";
import CourseCard from "@/components/CourseCard";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import React, { useState, useMemo, useEffect } from "react";
import Loading from "@/components/Loading";
import CourseCardSearch from "@/components/CourseCardSearch";
import SelectedCourse from "./SelectedCourse";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { CourseSkeleton } from "@/components/skeletons/CourseSkeleton";

interface SelectedCourseProps {
  course: Course | null;  // Changed this line to allow null
  handleEnrollNow: (courseId: string) => void;
}

// Define Course type
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

const dummyCourses: Course[] = [
  {
    courseId: "course1",
    title: "Introduction to React",
    description: "Learn the basics of React",
    image: "/placeholder.png",
    teacherName: "John Doe",
    teacherId: "teacher1",
    category: "Beginner",
    level: "Beginner" as "Beginner",
    status: "Published" as "Published",
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
    image: "/hero2.jpg",
    teacherName: "Jane Smith",
    teacherId: "teacher2",
    category: "Advanced",
    level: "Advanced" as "Advanced",
    status: "Draft" as "Draft",
  },
];

const Search = () => {

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
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


  const handleCourseSelect = (course: Course) => {
    setIsDialogOpen(true);
    setSelectedCourse(course);
    router.push(`/student/search?id=${course.courseId}`);
  };

  const handleEnrollNow = (courseId: string) => {
    router.push(`/signup`);
  };


  useEffect(() => {
    try {
      if (id) {
        const course = dummyCourses.find((course) => course.courseId === id);
        setSelectedCourse(course || dummyCourses[0]);
      } else {
        setSelectedCourse(dummyCourses[0]);
      }
    } catch (error) {
      console.error("Error setting selected course:", error);
    }
    // Add a longer delay before setting isLoading to false
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Increased to 3.5 seconds
  
    return () => clearTimeout(timer);
  }, [id]);

    if (isLoading) {
      return (
        <div className="user-courses">
          <Header 
            title="Search for courses" 
            subtitle="find new courses to gain more skills" 
          />
          <Toolbar
            onSearch={setSearchTerm}
            onCategoryChange={setSelectedCategory}
          />
          <h2>Loading courses...</h2>
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
      <Header 
        title="Search for courses" 
        subtitle="find new courses to gain more skills" 
      />
      <Toolbar
        onSearch={setSearchTerm}
        onCategoryChange={setSelectedCategory}
      />
      <h2>{filteredCourses.length} available courses</h2>
      <div className="user-courses__grid">
        {filteredCourses.map((course) => (
          <CourseCardSearch
            key={course.courseId}
            course={course}
            isSelected={selectedCourse?.courseId === course.courseId}
            onGoToCourse={() => handleCourseSelect(course)}
          />
        ))}
      </div>
      

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>

        <DialogTitle></DialogTitle>
        <DialogDescription></DialogDescription>
  <DialogContent className="search__selected-course">
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