"use client";

import Header from "@/components/Header";
import TeacherCourseCard from "@/components/TeacherCourseCard";
import Toolbar from "@/components/Toolbar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useMemo, useState, useEffect } from "react";

// Define course type
interface Course {
    courseId: string;
    teacherId: string;
    title: string;
    description: string;
    image: string;
    category: string;
    status: string;
    progress: number;
}

// Mock courses data for initial display
const mockCourses = [
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

// Option 1: Simple mock user hook - update with actual authentication logic
const useUser = () => {
    // Replace with your actual user data and auth system
    return {
        user: {
            id: 'mock-teacher-id',
            fullName: 'Mock Teacher',
        },
        // Get the token from localStorage, cookies, or your auth context
        getAuthHeaders: () => {
            // This is where you would get your actual auth headers
            // Example with JWT from localStorage:
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

            return {
                'Authorization': token ? `Bearer ${token}` : '',
                // You might need other headers like 'X-CSRF-Token' depending on your API
            };
        }
    };
};

// API base URL - adjust if needed
const API_BASE_URL = 'http://localhost/api';

const Courses = () => {
    const router = useRouter();
    const { user, getAuthHeaders } = useUser();

    const [courses, setCourses] = useState<Course[]>(mockCourses); // Start with mock data
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    // Helper function for API requests with auth headers
    const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
        const headers = {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
            ...options.headers
        };

        try {
            const response = await fetch(`${API_BASE_URL}${url}`, {
                ...options,
                headers,
                credentials: 'include', // Include cookies if your API uses cookie-based auth
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                const errorMessage = errorData?.message || 'Unknown error occurred';
                throw new Error(`API Error (${response.status}): ${errorMessage}`);
            }

            return response;
        } catch (err) {
            console.error(`Error with ${options.method || 'GET'} request to ${url}:`, err);
            throw err;
        }
    };

    // Fetch courses on component mount
    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        setIsLoading(true);
        try {
            const response = await fetchWithAuth('/courses');
            const data = await response.json();
            setCourses(data);
        } catch (err) {
            console.error('Error fetching courses:', err);
            setError('Could not load courses from API. Using mock data instead.');
            // Keep using mock data
        } finally {
            setIsLoading(false);
        }
    };

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
            try {
                // For development - simulate delete without API call
                if (process.env.NODE_ENV === 'development') {
                    // Simulate success
                    setCourses(courses.filter(c => c.courseId !== course.courseId));
                    return;
                }

                // Production code
                await fetchWithAuth(`/courses/${course.courseId}`, {
                    method: 'DELETE',
                });

                // Update the local state after successful deletion
                setCourses(courses.filter(c => c.courseId !== course.courseId));
            } catch (err) {
                console.error('Error deleting course:', err);
                alert('Failed to delete course. Please try again.');
            }
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

            // For development - simulate creating a course without API call
            if (process.env.NODE_ENV === 'development') {
                // Create a mock course with a generated ID
                const newCourse = {
                    ...courseData,
                    courseId: `course-${Date.now()}`,
                };

                // Add to local state
                setCourses([...courses, newCourse]);

                // Redirect to the edit page
                router.push(`/teacher/courses/${newCourse.courseId}`, { scroll: false });
                return;
            }

            // Production code - actual API call
            const response = await fetchWithAuth('/courses', {
                method: 'POST',
                body: JSON.stringify(courseData),
            });

            const result = await response.json();

            if (!result || typeof result.courseId !== "string") {
                throw new Error("Invalid course creation response: Missing or invalid courseId");
            }

            // Redirect to the newly created course
            router.push(`/teacher/courses/${result.courseId}`, { scroll: false });
        } catch (error) {
            console.error("Detailed course creation error:", error);

            if (error instanceof Error) {
                if (error.message.includes('Forbidden')) {
                    alert("You don't have permission to create courses. Please contact your administrator.");
                } else {
                    alert(`Error creating course: ${error.message}`);
                }
            } else {
                alert("There was a problem creating the course. Please try again.");
            }
        }
    };

    if (isLoading) return <div>Loading courses...</div>;

    return (
        <div className="teacher-courses">
            {error && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
                    <p>{error}</p>
                </div>
            )}

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
                            isOwner={course.teacherId === user?.id}
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center py-10">
                        No courses found. Create your first course!
                    </div>
                )}
            </div>
        </div>
    );
};

export default Courses;