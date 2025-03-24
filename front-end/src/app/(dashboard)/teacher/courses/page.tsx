"use client";

import Header from "@/components/ui/Header";
import Loading from "@/components/ui/Loading";
import TeacherCourseCard from "@/components//ui/TeacherCourseCard";
import Toolbar from "@/components/Toolbar";
import { Button } from "@/components/ui/button";
import {
    useCreateCourseMutation,
    useDeleteCourseMutation,
    useGetCoursesQuery,
} from "@/state/api";

import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

const Courses = () => {
    const router = useRouter();
    const {
        data: courses,
        isLoading,
        isError,
    } = useGetCoursesQuery({ category: "all" });

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
      //this was changed
    const handleCreateCourse = async () => {
        // Use static values for teacherId and teacherName
        const teacherId = "teacher-1";
        const teacherName = "John Doe";

        const result = await createCourse({
            teacherId: teacherId,
            teacherName: teacherName,
        }).unwrap();

        router.push(`/teacher/courses/${result.courseId}`, {
            scroll: false,
        });
    };

    if (isLoading) return <Loading />;
    if (isError || !courses) return <div>Error loading courses.</div>;

    //const user1 = {
      //  id: "teacher-1",
        //fullName: "John Doe"
    //};
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
                        isOwner={course.teacherId === "teacher-1"}
                    />
                ))}
            </div>
        </div>
    );
};

export default Courses;