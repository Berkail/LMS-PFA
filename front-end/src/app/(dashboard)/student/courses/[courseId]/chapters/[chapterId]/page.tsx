"use client";

import { useRef, useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useParams } from "next/navigation";
import { ProfileSkeleton } from "@/components/skeletons/ProfileSkeleton";
import { CourseVideoSkeleton } from "@/components/skeletons/CourseVideoSkeleton";

interface Instructor {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

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
  instructor: Instructor;
  courseModules: CourseModule[];
}

// ...existing imports and interfaces...

const Course = () => {
  const params = useParams();
  const { courseId, chapterId } = params;
  
  const [isLoading, setIsLoading] = useState(true);
  const [course, setCourse] = useState<Course | null>(null);
  const [userProgress, setUserProgress] = useState<any>(null);
  const [hasMarkedComplete, setHasMarkedComplete] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch('http://localhost/api/courses/', {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch course');
        }

        const responseData = await response.json();
        // Find the specific course from all courses
        const specificCourse = responseData.data.find(
          (course: Course) => course.id.toString() === courseId
        );

        if (!specificCourse) {
          throw new Error('Course not found');
        }

        setCourse(specificCourse);
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  
  const currentModule = course?.courseModules.find(module => 
    module.lessons.some(lesson => lesson.id.toString() === chapterId)
  );
  
  const currentLesson = currentModule?.lessons.find(
    lesson => lesson.id.toString() === chapterId
  );

  if (isLoading) {
    return (
      <div className="course">
        <div className="course__container">
          <div className="pt-4 course__instructor">
            <ProfileSkeleton />
          </div>
          <div className="w-full">
            <div className="w-full">
              <CourseVideoSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentLesson || !currentModule || !course) {
    return <div>Chapter not found</div>;
  }

  return (
    <div className="course">
      <div className="course__container">
        <div className="course__breadcrumb">
          <div className="course__path">
            {course.title} / {currentModule.title} /{" "}
            <span className="course__current-chapter">
              {currentLesson.title}
            </span>
          </div>
          <h2 className="course__title">{currentLesson.title}</h2>
          <div className="course__header">
          <div className="course__instructor">
  <Avatar className="course__avatar">
    <AvatarFallback className="course__avatar-fallback">
      {course?.instructor?.firstName?.[0] || 'U'}
    </AvatarFallback>
  </Avatar>
  <span className="course__instructor-name">
    {course?.instructor ? 
      `${course.instructor.firstName} ${course.instructor.lastName}` : 
      'Unknown Instructor'
    }
  </span>
</div>
          </div>
        </div>

        <Card className="course__video">
          <CardContent className="course__video-container">
            <iframe 
              src={currentLesson.pathToUrlVid}
              title="Course Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen 
              className="bg-customgreys-secondarybg"
            />
          </CardContent>
        </Card>

        <div className="course__content">
          <Tabs defaultValue="Notes" className="w-full course-tab-bg">
            <TabsList className="grid w-full grid-cols-2 bg-customgreys-secondarybg">
              <TabsTrigger value="Notes">Notes</TabsTrigger>
              <TabsTrigger value="Resources">Resources</TabsTrigger>
            </TabsList>
            <TabsContent value="Notes">
              <Card className="course-tab-card">
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                  <CardDescription>
                    Take notes for this lesson
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {/* Add note-taking functionality here */}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="Resources">
              <Card className="course-tab-card">
                <CardHeader>
                  <CardTitle>Resources</CardTitle>
                  <CardDescription>
                    Additional learning materials
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {/* Add resources here */}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="course__instructor-card">
  <CardContent className="course__instructor-info">
    <div className="course__instructor-header">
      <Avatar className="course__instructor-avatar">
        <AvatarFallback className="course__instructor-avatar-fallback">
          {course?.instructor?.firstName?.[0] || 'U'}
        </AvatarFallback>
      </Avatar>
      <div className="course__instructor-details">
        <h4 className="course__instructor-name">
          {course?.instructor ? 
            `${course.instructor.firstName} ${course.instructor.lastName}` : 
            'Unknown Instructor'
          }
        </h4>
        <p className="course__instructor-title">
          {course?.instructor?.username || 'No username available'}
        </p>
      </div>
    </div>
    <div className="course__instructor-bio">
      <p>
        {course?.instructor?.email || 'No email available'}
      </p>
    </div>
  </CardContent>
</Card>
        </div>
      </div>
    </div>
  );
};

export default Course;