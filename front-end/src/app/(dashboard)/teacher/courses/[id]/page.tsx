"use client";

import { CustomFormField } from "@/components/CustomFormField";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  centsToDollars,
  createCourseFormData,
  uploadAllVideos,
} from "@/lib/utils";
import { openSectionModal, setSections } from "@/state";
import {
  useGetCourseQuery,
  useUpdateCourseMutation,
  useGetUploadVideoUrlMutation,
} from "@/state/api";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DroppableComponent from "./Droppable";
import ChapterModal from "./ChapterModal";
import SectionModal from "./SectionModal";
import { z } from "zod";
import { toast } from "sonner";

interface Lesson {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  publishedAt: string | null;
  pathToUrlVid: string;
  courseModuleId: number;
}

interface CourseModule {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  publishedAt: string | null;
  order: number;
  courseId: number;
  lessons: Lesson[];
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
  courseModules: CourseModule[];
}

const courseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  courseImg: z.any(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  courseStatus: z.boolean().default(false),
});

type CourseFormData = z.infer<typeof courseSchema>;

const CourseEditor = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const courseId = typeof id === 'string' ? parseInt(id, 10) : undefined;
  
  
  const [isLoading, setIsLoading] = useState(true);
  const [course, setCourse] = useState<Course | null>(null);
  

  const dispatch = useAppDispatch();
  const { sections } = useAppSelector((state) => state.global.courseEditor);

  const methods = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      courseImg: "",
      difficulty: "beginner",
      courseStatus: false,
    },
  });

  

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost/api/courses/${courseId}`, {
          credentials: 'include'
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch course');
        }
  
        const responseData = await response.json();
        console.log('API Response:', responseData);
  
        if (!responseData || !responseData.title) {
          console.error('Invalid course data received:', responseData);
          return;
        }
  
        // Set course data
        setCourse(responseData);
  
        // Map CourseModules to sections
        if (responseData.courseModules) {
          const formattedSections = responseData.courseModules.map((module: CourseModule) => ({
            id: module.id,
            title: module.title,
            order: module.order,
            chapters: module.lessons.map((lesson: Lesson) => ({
              id: lesson.id,
              title: lesson.title,
              videoUrl: lesson.pathToUrlVid,
              sectionId: module.id
            }))
          }));
  
          // Dispatch sections to Redux store
          dispatch(setSections(formattedSections));
        }
  
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    if (courseId && !isNaN(courseId)) {
      console.log('Fetching course with ID:', courseId);
      fetchCourse();
    }
  }, [courseId, dispatch]);


  useEffect(() => {
    if (course) {
      methods.reset({
        title: course.title,
        description: course.description || "",
        difficulty: course.difficulty as "beginner" | "intermediate" | "advanced",
        courseStatus: course.publishedAt !== null,
        courseImg: "" // Keep empty since it's a file input
      });
    }
  }, [course, methods]);

  const createCourseModule = async (courseId: number, title: string, order: number) => {
    const response = await fetch(`http://localhost/api/courses/${courseId}/course-modules`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ title, order })
    });
  
    if (!response.ok) {
      throw new Error('Failed to create course module');
    }
  
    return await response.json();
  };


  const createLesson = async (courseModuleId: number, title: string, pathToUrlVid: string) => {
    const response = await fetch(`http://localhost/api/course-modules/${courseModuleId}/lessons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ title, pathToUrlVid })
    });
  
    if (!response.ok) {
      throw new Error('Failed to create lesson');
    }
  
    return await response.json();
  };


  const onSubmit = async (data: CourseFormData) => {
    if (!courseId) {
      toast.error('Course ID is required');
      return;
    }
  
    try {
      let imagePath = data.courseImg;
      if (data.courseImg instanceof File) {
        // Handle file upload if needed
        imagePath = course?.pathToImg || '';
      }
  
      // Update course data
      const response = await fetch(`http://localhost/api/courses/${courseId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          difficulty: data.difficulty,
          pathToImg: imagePath,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update course');
      }
  
      // Update sections/modules and their lessons
      for (const section of sections) {
        if (section.id) {
          // Update existing module
          await fetch(`http://localhost/api/course-modules/${section.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              title: section.title,
              order: section.order,
            }),
          });
  
          // Update existing chapters/lessons
          for (const chapter of section.chapters || []) {
            if (chapter.id) {
              await fetch(`http://localhost/api/lessons/${chapter.id}`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                  title: chapter.title,
                  pathToUrlVid: chapter.videoUrl,
                }),
              });
            }
          }
        } else {
          // Handle new sections and chapters if needed
          const newModule = await createCourseModule(courseId, section.title, section.order);
          
          for (const chapter of section.chapters || []) {
            if (!chapter.id) {
              await createLesson(newModule.id, chapter.title, chapter.videoUrl || '');
            }
          }
        }
      }
  
      toast.success('Course updated successfully');
      router.push('/teacher/courses');
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update course');
    }
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

      <Form {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Header
            title="Course Setup"
            subtitle="Complete all fields and save your course"
            rightElement={
              <div className="flex items-center space-x-4">
                <Button
                  type="submit"
                  className="bg-primary-700 hover:bg-primary-600"
                >
                  Save
                </Button>
              </div>
            }
          />

          <div className="flex justify-between md:flex-row flex-col gap-10 mt-5 font-dm-sans">
            <div className="basis-1/2">
              <div className="space-y-4">
              <CustomFormField
  name="title"
  label="Course Title"
  type="text"
  placeholder="Write course title here"
  className="border-none"
/>

<CustomFormField
  name="description"
  label="Course Description"
  type="textarea"
  placeholder="Write course description here"
/>

<CustomFormField
  name="courseImg"
  label="Course Image"
  type="file"
  accept="image/*"
  className="border-none"
/>

<CustomFormField
  name="difficulty"
  label="Course Difficulty"
  type="select"
  placeholder="Select difficulty level"
  options={[
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
  ]}
/>


              </div>
            </div>

            <div className="bg-customgreys-darkGrey mt-4 md:mt-0 p-4 rounded-lg basis-1/2">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-semibold text-white-50">
                  Sections
                </h2>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    dispatch(openSectionModal({ sectionIndex: null }))
                  }
                  className="border-none text-primary-700 group"
                >
                  <Plus className="mr-1 h-4 w-4 text-primary-700 group-hover:white-100" />
                  <span className="text-primary-700 group-hover:white-100">
                    Add Section
                  </span>
                </Button>
              </div>

              {/**isLoading ? (
                <p>Loading course content...</p>
              ) : sections.length > 0 ? (*/
                <DroppableComponent />
              /** ) : (
                <p>No sections available</p>
              )*/}
            </div>
          </div>
        </form>
      </Form>

      <ChapterModal />
      <SectionModal />
    </div>
  );
};

export default CourseEditor;
