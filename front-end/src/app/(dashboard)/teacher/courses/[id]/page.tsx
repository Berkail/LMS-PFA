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
import { openSectionModal, resetCourseEditor, setSections } from "@/state";
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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const courseSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),
    courseImg: z.custom<File | null>()
    .refine((file) => {
      if (!file) return true;
      return file instanceof File;
    }, "Please upload a valid file")
    .refine((file) => {
      if (!file) return true;
      const size = file instanceof File ? file.size : 0;
      return size <= MAX_FILE_SIZE;
    }, `Image must be less than 2MB`)
    .refine((file) => {
      if (!file) return true;
      return ACCEPTED_IMAGE_TYPES.includes(file.type);
    }, "Only .jpg, .jpeg, .png and .webp formats are supported")
    .nullable(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"], {
    required_error: "Please select a difficulty level",
  }),
  courseStatus: z.boolean().default(false),
});

type CourseFormData = z.infer<typeof courseSchema>;

const CourseEditor = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { sections } = useAppSelector((state) => state.global.courseEditor);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);


  useEffect(() => {
    return () => {
      dispatch(resetCourseEditor());
    };
  }, [dispatch]);

  const methods = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      courseImg: null,
      difficulty: "beginner",
      courseStatus: false,
    },
    mode: "onBlur", // This will show errors when user leaves a field
  });
  
    useEffect(() => {
      if (process.env.NODE_ENV === 'development') {
        const formState = methods.formState;
        if (formState.errors && Object.keys(formState.errors).length > 0) {
          console.log('Form Errors:', formState.errors);
        }
      }
    }, [methods.formState]);
  

  const createCourseModule = async (courseId: number, title: string, order: number) => {
    const response = await fetch(`http://localhost/api/courses/${courseId}/course-modules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ title, order })
    });

    if (!response.ok) throw new Error('Failed to create course module');
    return await response.json();
  };

  const createLesson = async (courseModuleId: number, title: string, pathToUrlVid: string) => {
    const response = await fetch(`http://localhost/api/course-modules/${courseModuleId}/lessons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ title, pathToUrlVid })
    });

    if (!response.ok) throw new Error('Failed to create lesson');
    return await response.json();
  };

  const onSubmit = async (data: CourseFormData) => {
  setIsSubmitting(true);
  try {
    // Validate image size before submission
    if (data.courseImg instanceof File) {
      const fileSizeInMB = data.courseImg.size / (1024 * 1024);
      if (fileSizeInMB > 2) { // Using 2MB as limit
        setFormError(`File size (${fileSizeInMB.toFixed(2)}MB) exceeds 2MB limit`);
        setIsSubmitting(false);
        return;
      }
    }

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('difficulty', data.difficulty);
    
    if (data.courseImg instanceof File) {
      formData.append('courseImg', data.courseImg);
    }

    const response = await fetch('http://localhost/api/courses', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null) as { message?: string };
      if (response.status === 413) {
        throw new Error("The image file is too large. Please choose a smaller image (max 2MB).");
      }
      throw new Error(errorData?.message || `Failed to create course: ${response.statusText}`);
    }

    const newCourse = await response.json();

    // Create sections and chapters
    for (const section of sections) {
      try {
        const newModule = await createCourseModule(newCourse.id, section.title, section.order);
        
        if (section.chapters?.length) {
          for (const chapter of section.chapters) {
            try {
              await createLesson(newModule.id, chapter.title, chapter.videoUrl || '');
            } catch (err) {
              toast.error(`Failed to create lesson "${chapter.title}"`);
            }
          }
        }
      } catch (err) {
        toast.error(`Failed to create section "${section.title}"`);
      }
    }

    toast.success('Course created successfully');
    router.push('/teacher/courses');
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to create course';
    setFormError(errorMessage);
  } finally {
    setIsSubmitting(false);
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
  disabled={isSubmitting}
>
  {isSubmitting ? 'Creating...' : 'Save'}
</Button>
              </div>
            }
          />

          <div className="flex justify-between md:flex-row flex-col gap-10 mt-5 font-dm-sans">
            <div className="basis-1/2">
              <div className="space-y-4">
              {formError && (
      <div className="p-3 mb-4 text-sm text-red-500 bg-red-100 rounded-md border border-red-200">
        Error: {formError}
      </div>
    )}
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
  className="[&_select]:text-white [&_option]:text-white"
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
