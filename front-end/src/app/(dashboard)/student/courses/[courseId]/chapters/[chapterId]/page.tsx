"use client";

import { useRef, useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Loading from "@/components/Loading";
import { useParams } from "next/navigation";

const dummyCourse = {
  courseId: "course1",
  title: "Introduction to React",
  teacherName: "John Doe",
  teacherTitle: "Senior UX Designer",
  teacherBio: "A seasoned Senior UX Designer with over 15 years of experience in creating intuitive and engaging digital experiences.",
  sections: [
    {
      sectionId: "section1",
      sectionTitle: "Getting Started",
      chapters: [
        {
          chapterId: "chapter1",
          title: "Introduction to React",
          type: "PDF",
          content: "/sample.pdf", // Place your PDF in the public folder
          video: null
        },
        {
          chapterId: "chapter2",
          title: "Setting Up Your Environment",
          type: "Text",
          content: "Learn how to set up your development environment for React.",
          video: null
        }
      ]
    }
  ]
};

const dummyProgress = {
  sections: [
    {
      sectionId: "section1",
      chapters: [
        { chapterId: "chapter1", completed: true },
        { chapterId: "chapter2", completed: false }
      ]
    }
  ]
};

const Course = () => {
  const params = useParams();
  const { courseId, chapterId } = params;
  
  const [isLoading, setIsLoading] = useState(true);
  const [course, setCourse] = useState(dummyCourse);
  const [userProgress, setUserProgress] = useState(dummyProgress);
  const [hasMarkedComplete, setHasMarkedComplete] = useState(false);
  
  const currentSection = course.sections.find(section => 
    section.chapters.some(chapter => chapter.chapterId === chapterId)
  );
  
  const currentChapter = currentSection?.chapters.find(
    chapter => chapter.chapterId === chapterId
  );

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const isChapterCompleted = () => {
    return userProgress.sections
      .find(section => section.sectionId === currentSection?.sectionId)
      ?.chapters.find(chapter => chapter.chapterId === currentChapter?.chapterId)
      ?.completed;
  };

  const handleProgress = ({ played }: { played: number }) => {
    if (
      played >= 0.8 &&
      !hasMarkedComplete &&
      currentChapter &&
      currentSection &&
      !isChapterCompleted()
    ) {
      setHasMarkedComplete(true);
      updateChapterProgress(
        currentSection.sectionId,
        currentChapter.chapterId,
        true
      );
    }
  };

  const updateChapterProgress = (sectionId: string, chapterId: string, completed: boolean) => {
    setUserProgress(prev => ({
      ...prev,
      sections: prev.sections.map(section => {
        if (section.sectionId === sectionId) {
          return {
            ...section,
            chapters: section.chapters.map(chapter => {
              if (chapter.chapterId === chapterId) {
                return { ...chapter, completed };
              }
              return chapter;
            })
          };
        }
        return section;
      })
    }));
  };

  if (isLoading) return <Loading />;
  if (!currentChapter || !currentSection) return <div>Chapter not found</div>;

  return (
    <div className="course">
      
      <div className="course__container">
        <div className="course__breadcrumb">
          <div className="course__path">
            {course.title} / {currentSection?.sectionTitle} /{" "}
            <span className="course__current-chapter">
              {currentChapter?.title}
            </span>
          </div>
          <h2 className="course__title">{currentChapter?.title}</h2>
          <div className="course__header">
            <div className="course__instructor">
              <Avatar className="course__avatar">
                <AvatarImage alt={course.teacherName} />
                <AvatarFallback className="course__avatar-fallback">
                  {course.teacherName[0]}
                </AvatarFallback>
              </Avatar>
              <span className="course__instructor-name">
                {course.teacherName}
              </span>
            </div>
          </div>
        </div>

        <Card className="course__video">
          <CardContent className="course__video-container">
          <iframe 
      src="https://www.youtube.com/embed/19g66ezsKAg"
      title="Course Video"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen 
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
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Make changes to your account here. Click save when you're done.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
          </CardContent>
          <CardFooter>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="Resources">
        <Card className="course-tab-card">
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password here. After saving, you'll be logged out.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            
          </CardContent>
          <CardFooter>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>


          <Card className="course__instructor-card">
            <CardContent className="course__instructor-info">
              <div className="course__instructor-header">
                <Avatar className="course__instructor-avatar">
                  <AvatarImage alt={course.teacherName} />
                  <AvatarFallback className="course__instructor-avatar-fallback">
                    {course.teacherName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="course__instructor-details">
                  <h4 className="course__instructor-name">
                    {course.teacherName}
                  </h4>
                  <p className="course__instructor-title">Senior UX Designer</p>
                </div>
              </div>
              <div className="course__instructor-bio">
                <p>
                  A seasoned Senior UX Designer with over 15 years of experience
                  in creating intuitive and engaging digital experiences.
                  Expertise in leading UX design projects.
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
