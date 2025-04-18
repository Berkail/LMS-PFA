"use client";

import Header from "@/components/Header";

import TeacherCourseCard from "@/components/TeacherCourseCard";
import Toolbar from "@/components/Toolbar";
import { Button } from "@/components/ui/button";
import {
    useCreateCourseMutation,
    useDeleteCourseMutation,

} from "@/state/api";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

const courses = [
    {
        courseId: "course1",
        teacherId: "teacher2",
        title: "Advanced JavaScript",
        description: "Master JavaScript concepts",
        image: "/placeholder.png",
        category: "Programming",
        status: "draft",
        progress: 70,
    },
    {
        courseId: "course2",
        teacherId: "teacher1",
        title: "Advanced JavaScript",
        description: "Master JavaScript concepts",
        image: "/placeholder.png",
        category: "Programming",
        status: "published",
        progress: 70,
    }
];


// Option 1: Simple mock user hook
const useUser = () => {
    // Replace with your actual user logic or mock data
    return {
        user: {
            id: 'mock-teacher-id',
            fullName: 'Mock Teacher',
        }
    };
};

const Courses = () => {
    const router = useRouter();
    const { user } = useUser();


    const [createCourse] = useCreateCourseMutation();
    const [deleteCourse] = useDeleteCourseMutation();

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    const filteredCourses = useMemo(() => {
        if (!courses) return [];

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
            await deleteCourse(course.courseId).unwrap();
        }
    };

    const handleCreateCourse = async () => {
        try {
            if (!user) {
                console.error("No user found");
                return;
            }

            // Add default course data
            const courseData = {
                teacherId: user.id,
                teacherName: user.fullName || "Unknown Teacher",
                title: "New Course",
                description: "Course description",
                image: "/placeholder.png",
                category: "General",
                status: "draft",
                progress: 0,
            };

            console.log("Creating course with data:", courseData);

            const result = await createCourse(courseData).unwrap();
            console.log("Course created:", result);

            if (!result || typeof result.courseId !== "string") {
                throw new Error("Invalid course creation response: Missing or invalid courseId");
            }

            // Redirect to the newly created course
            router.push(`/teacher/courses/${result.courseId}`, { scroll: false });
        } catch (error) {
            console.error("Detailed course creation error:", error);

            if (error instanceof Error) {
                console.error("Error name:", error.name);
                console.error("Error message:", error.message);

                if (error.message.includes("<!DOCTYPE html>")) {
                    console.error("Received HTML instead of JSON. Check your API endpoint.");
                    alert("There was a problem creating the course. Please try again.");
                }
            }
        }
    };


   // if (isError || !courses) return <div>Error loading courses.</div>;

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
                        isOwner={course.teacherId === user?.id}
                    />
                ))}
            </div>
        </div>
    );
};

export default Courses;