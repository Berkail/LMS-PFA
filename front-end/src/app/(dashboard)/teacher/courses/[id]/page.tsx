"use client";

import { CustomFormField } from "@/components/CustomFormField";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { courseSchema } from "@/lib/schemas";
import {
    centsToDollars,
    createCourseFormData,
} from "@/lib/utils";
import { ArrowLeft, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// API base URL - adjust if needed
const API_BASE_URL = 'http://localhost/api';

// Type definitions
interface CourseFormData {
    courseTitle: string;
    courseDescription: string;
    courseCategory: string;
    coursePrice: string;
    courseStatus: boolean;
}

interface Section {
    id: string;
    title: string;
    position: number;
    chapters: Chapter[];
}

interface Chapter {
    id: string;
    title: string;
    position: number;
    videoUrl?: string;
    content?: string;
}

interface Course {
    id: string;
    title: string;
    description: string;
    category: string;
    price: number;
    status: string;
    sections: Section[];
}

const CourseEditor = () => {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [course, setCourse] = useState<Course | null>(null);
    const [sections, setSections] = useState<Section[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Modal states
    const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
    const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
    const [selectedSectionIndex, setSelectedSectionIndex] = useState<number | null>(null);
    const [selectedChapterIndex, setSelectedChapterIndex] = useState<number | null>(null);

    const methods = useForm<CourseFormData>({
        resolver: zodResolver(courseSchema),
        defaultValues: {
            courseTitle: "",
            courseDescription: "",
            courseCategory: "",
            coursePrice: "0",
            courseStatus: false,
        },
    });

    // Helper function for API requests with auth headers
    const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
        // Get authentication token - replace with your actual auth logic
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
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

    // Fetch course data
    const fetchCourse = async () => {
        setIsLoading(true);
        try {
            // For development, use mock data
            if (process.env.NODE_ENV === 'development') {
                // Mock course data
                const mockCourse = {
                    id: id,
                    title: "Sample Course",
                    description: "This is a sample course description",
                    category: "technology",
                    price: 2999, // in cents
                    status: "Draft",
                    sections: [
                        {
                            id: "section1",
                            title: "Introduction",
                            position: 0,
                            chapters: [
                                {
                                    id: "chapter1",
                                    title: "Getting Started",
                                    position: 0,
                                    videoUrl: "",
                                    content: "Welcome to the course!"
                                }
                            ]
                        }
                    ]
                };

                setCourse(mockCourse);
                setSections(mockCourse.sections);
                setIsLoading(false);
                return;
            }

            // Production code
            const response = await fetchWithAuth(`/courses/${id}`);
            const data = await response.json();
            setCourse(data);
            setSections(data.sections || []);
        } catch (err) {
            console.error('Error fetching course:', err);
            setError('Failed to load course data');
        } finally {
            setIsLoading(false);
        }
    };

    // Update course data
    const updateCourse = async (formData: any) => {
        try {
            // For development, just log and return mock data
            if (process.env.NODE_ENV === 'development') {
                console.log('Would update course with:', formData);
                return { success: true };
            }

            // Production code
            const response = await fetchWithAuth(`/courses/${id}`, {
                method: 'PUT', // or 'PATCH' depending on your API
                body: JSON.stringify(formData),
            });
            return await response.json();
        } catch (err) {
            console.error('Error updating course:', err);
            throw err;
        }
    };

    // Upload videos
    const uploadVideo = async (file: File, chapterId: string) => {
        try {
            // Mock function for development
            if (process.env.NODE_ENV === 'development') {
                console.log(`Would upload video for chapter ${chapterId}:`, file.name);
                return { url: `https://example.com/videos/${file.name}` };
            }

            // Get upload URL
            const uploadUrlResponse = await fetchWithAuth('/courses/upload-video', {
                method: 'POST',
                body: JSON.stringify({ chapterId }),
            });

            const { uploadUrl, videoUrl } = await uploadUrlResponse.json();

            // Upload the file to the provided URL
            await fetch(uploadUrl, {
                method: 'PUT',
                body: file,
                headers: {
                    'Content-Type': file.type,
                },
            });

            return { url: videoUrl };
        } catch (error) {
            console.error('Error uploading video:', error);
            throw error;
        }
    };

    useEffect(() => {
        fetchCourse();
    }, [id]);

    useEffect(() => {
        if (course) {
            methods.reset({
                courseTitle: course.title,
                courseDescription: course.description,
                courseCategory: course.category,
                coursePrice: centsToDollars(course.price),
                courseStatus: course.status === "Published",
            });
        }
    }, [course, methods]);

    const onSubmit = async (data: CourseFormData) => {
        setIsSubmitting(true);
        try {
            // Create form data for the course update
            const formData = {
                title: data.courseTitle,
                description: data.courseDescription,
                category: data.courseCategory,
                price: parseFloat(data.coursePrice) * 100, // convert to cents
                status: data.courseStatus ? "Published" : "Draft",
                sections: sections,
            };

            // Update the course
            await updateCourse(formData);

            // Refresh course data
            await fetchCourse();

            // Show success message
            alert("Course updated successfully!");
        } catch (error) {
            console.error("Failed to update course:", error);
            setError("Failed to update course. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Function to open section modal
    const openSectionModal = (sectionIndex: number | null) => {
        setSelectedSectionIndex(sectionIndex);
        setIsSectionModalOpen(true);
    };

    // Function to handle section creation/edit
    const handleSectionSave = (sectionData: { title: string }) => {
        const updatedSections = [...sections];

        if (selectedSectionIndex !== null) {
            // Edit existing section
            updatedSections[selectedSectionIndex] = {
                ...updatedSections[selectedSectionIndex],
                title: sectionData.title,
            };
        } else {
            // Create new section
            const newSection: Section = {
                id: `section-${Date.now()}`, // Use a proper ID generation method in production
                title: sectionData.title,
                position: sections.length,
                chapters: [],
            };
            updatedSections.push(newSection);
        }

        setSections(updatedSections);
        setIsSectionModalOpen(false);
    };

    // Basic section component for display
    const SectionItem = ({ section, index }: { section: Section, index: number }) => {
        return (
            <div className="bg-gray-800 p-4 rounded-md mb-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">{section.title}</h3>
                    <div className="flex space-x-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openSectionModal(index)}
                        >
                            Edit
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="text-primary-700"
                            onClick={() => {/* Open chapter modal */}}
                        >
                            <Plus className="mr-1 h-4 w-4" />
                            Add Chapter
                        </Button>
                    </div>
                </div>

                {section.chapters.length > 0 ? (
                    <div className="mt-2 space-y-2">
                        {section.chapters.map((chapter, chapterIndex) => (
                            <div
                                key={chapter.id}
                                className="bg-gray-700 p-2 rounded flex justify-between items-center"
                            >
                                <span>{chapter.title}</span>
                                <Button size="sm" variant="ghost">Edit</Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400 mt-2">No chapters yet</p>
                )}
            </div>
        );
    };

    return (
        <div>
            <div className="flex items-center gap-5 mb-5">
                <button
                    className="flex items-center border border-customgreys-dirtyGrey rounded-lg p-2 gap-2 cursor-pointer hover:bg-customgreys-dirtyGrey hover:text-white-100 text-customgreys-dirtyGrey"
                    onClick={() => router.push("/teacher/courses", { scroll: false })}
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Courses</span>
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                    <p>{error}</p>
                </div>
            )}

            <Form {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                    <Header
                        title="Course Setup"
                        subtitle="Complete all fields and save your course"
                        rightElement={
                            <div className="flex items-center space-x-4">
                                <CustomFormField
                                    name="courseStatus"
                                    label={methods.watch("courseStatus") ? "Published" : "Draft"}
                                    type="switch"
                                    className="flex items-center space-x-2"
                                    labelClassName={`text-sm font-medium ${
                                        methods.watch("courseStatus")
                                            ? "text-green-500"
                                            : "text-yellow-500"
                                    }`}
                                    inputClassName="data-[state=checked]:bg-green-500"
                                />
                                <Button
                                    type="submit"
                                    className="bg-primary-700 hover:bg-primary-600"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Saving..." : methods.watch("courseStatus")
                                        ? "Update Published Course"
                                        : "Save Draft"}
                                </Button>
                            </div>
                        }
                    />

                    <div className="flex justify-between md:flex-row flex-col gap-10 mt-5 font-dm-sans">
                        <div className="basis-1/2">
                            <div className="space-y-4">
                                <CustomFormField
                                    name="courseTitle"
                                    label="Course Title"
                                    type="text"
                                    placeholder="Write course title here"
                                    className="border-none"
                                    initialValue={course?.title}
                                />

                                <CustomFormField
                                    name="courseDescription"
                                    label="Course Description"
                                    type="textarea"
                                    placeholder="Write course description here"
                                    initialValue={course?.description}
                                />

                                <CustomFormField
                                    name="courseCategory"
                                    label="Course Category"
                                    type="select"
                                    placeholder="Select category here"
                                    options={[
                                        { value: "technology", label: "Technology" },
                                        { value: "science", label: "Science" },
                                        { value: "mathematics", label: "Mathematics" },
                                        {
                                            value: "Artificial Intelligence",
                                            label: "Artificial Intelligence",
                                        },
                                    ]}
                                    initialValue={course?.category}
                                />

                                <CustomFormField
                                    name="coursePrice"
                                    label="Course Price"
                                    type="number"
                                    placeholder="0"
                                    initialValue={course?.price}
                                />
                            </div>
                        </div>

                        <div className="bg-customgreys-darkGrey mt-4 md:mt-0 p-4 rounded-lg basis-1/2">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-2xl font-semibold text-secondary-foreground">
                                    Sections
                                </h2>

                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openSectionModal(null)}
                                    className="border-none text-primary-700 group"
                                >
                                    <Plus className="mr-1 h-4 w-4 text-primary-700 group-hover:white-100" />
                                    <span className="text-primary-700 group-hover:white-100">
                    Add Section
                  </span>
                                </Button>
                            </div>

                            {isLoading ? (
                                <p>Loading course content...</p>
                            ) : sections.length > 0 ? (
                                <div className="space-y-4">
                                    {sections.map((section, index) => (
                                        <SectionItem
                                            key={section.id}
                                            section={section}
                                            index={index}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p>No sections available</p>
                            )}
                        </div>
                    </div>
                </form>
            </Form>

            {/* Simple Section Modal (Replace with your actual modal components) */}
            {isSectionModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-xl font-bold mb-4">
                            {selectedSectionIndex !== null ? "Edit Section" : "Add Section"}
                        </h2>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                            placeholder="Section Title"
                            defaultValue={selectedSectionIndex !== null ? sections[selectedSectionIndex].title : ""}
                        />
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setIsSectionModalOpen(false)}>Cancel</Button>
                            <Button onClick={() => handleSectionSave({ title: "New Section" })}>Save</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseEditor;