"use client";

import { useRef, useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Loading from "@/components/Loading";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ProfileSkeleton } from "@/components/skeletons/ProfileSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

const dummyAssignment = {
    assignmentId: "assignment1",
    title: "React Fundamentals Quiz",
    courseTitle: "Introduction to React",
    dueDate: "2025-04-10",
    teacherName: "John Doe",
    teacherTitle: "Senior React Developer",
    pdfUrl: "/sample.pdf", // Place your PDF in the public folder
    status: "pending", // pending, submitted, graded
    maxPoints: 100,
    instructions: "Please complete all questions. You have 60 minutes to finish this assignment."
  };

  const Assignment = () => {
    const params = useParams();
    const { assignmentId } = params;
    
    const [isLoading, setIsLoading] = useState(true);
    const [assignment, setAssignment] = useState(dummyAssignment);
  
    useEffect(() => {
      // Simulate loading
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }, []);
  
    if (isLoading){
      return (
        <div>
          <ProfileSkeleton />
          <Skeleton className="h-[1080px] w-full rounded-xl"/>
        </div>
      );
    }
  
    return (
      <div className="assignment dark">
        <div className="assignment__container">
          <div className="assignment__breadcrumb">
            <div className="assignment__path">
              {assignment.courseTitle} /{" "}
              <span className="assignment__current">
                {assignment.title}
              </span>
            </div>
            <h2 className="assignment__title">{assignment.title}</h2>
            <div className="assignment__header">
              <div className="assignment__instructor">
                <Avatar className="assignment__avatar">
                  <AvatarImage alt={assignment.teacherName} />
                  <AvatarFallback className="assignment__avatar-fallback">
                    {assignment.teacherName[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="assignment__instructor-name">
                  {assignment.teacherName}
                </span>
              </div>
            </div>
          </div>
  
          <Card className="assignment__content">
            <CardHeader className="">
                <div className="flex justify-between">
                    <div className="">
              <CardTitle>Assignment Details</CardTitle>
              <CardDescription className="text-primary-200">
                Due Date: {assignment.dueDate} | Max Points: {assignment.maxPoints}
              </CardDescription>
              </div>
              <Button className="bg-primary text-white-50 hover:bg-white-50 hover:text-gray-800" onClick={() => alert("Download PDF")}>
                Mark as completed
                </Button>
                </div>
            </CardHeader>
            <CardContent>
              <div className="assignment__instructions mb-5">
                <h4>Instructions:</h4>
                <p>{assignment.instructions}</p>
              </div>
              <div className="assignment__pdf">
                <iframe
                  src={assignment.pdfUrl}
                  className="w-full h-[800px]"
                  title="Assignment PDF"
                />
              </div>
            </CardContent>
          </Card>
  
          <Tabs defaultValue="submission" className="w-full assignment-tab-bg">
            <TabsList className="grid w-full grid-cols-2 bg-customgreys-primarybg">
              <TabsTrigger value="submission">Submit Assignment</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
            </TabsList>
            <TabsContent value="submission">
              <Card className="assignment-tab-card bg-customgreys-primarybg">
                <CardHeader>
                  <CardTitle>Submit Your Work</CardTitle>
                  <CardDescription>
                    Upload your completed assignment here
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Add file upload component here */}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="feedback">
              <Card className="assignment-tab-card bg-customgreys-primarybg">
                <CardHeader>
                  <CardTitle>Teacher Feedback</CardTitle>
                  <CardDescription>
                    View feedback after submission
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {assignment.status === 'pending' && (
                    <p>No feedback available yet</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  };

export default Assignment;
