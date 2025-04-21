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
import { useRouter } from "next/router";


interface Assignment {
  id: number;
  title: string;
  description: string;
  pdfPath: string;
  pdfName: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  instructorId: number;
}

const Assignment = () => {
  const params = useParams();
  const assignmentId = params?.assignmentId;
  
  const [isLoading, setIsLoading] = useState(true);
  const [assignment, setAssignment] = useState<Assignment>();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!assignmentId) return;
  
      try {
        const response = await fetch(`http://localhost/api/exams/${assignmentId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch assignment');
        }
        const data = await response.json();
        console.log('API Response:', data); // Debug log
  
        // Check if data exists and handle different response structures
        const assignment = data.data || data;
        if (!assignment) {
          throw new Error('No assignment found');
        }
  
        // If assignment is an array, take first item, otherwise use as is
        setAssignment(Array.isArray(assignment) ? assignment[0] : assignment);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching assignments:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch');
        setIsLoading(false);
      }
    };
  
    fetchAssignments();
  }, [assignmentId]);
  
  // ...rest of the component remains the same
  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }
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
              {assignment?.title} /{" "}
              <span className="assignment__current">
              {assignment?.title}
              </span>
            </div>
            <h2 className="assignment__title">{assignment?.title}</h2>
            <div className="assignment__header">
              <div className="assignment__instructor">
                <Avatar className="assignment__avatar">
                  <AvatarImage alt="Instructor" />
                  <AvatarFallback className="assignment__avatar-fallback">
                    {assignment?.id}
                  </AvatarFallback>
                </Avatar>
                <span className="assignment__instructor-name">
                Instructor
                </span>
              </div>
            </div>
          </div>
  
          <Card className="assignment__content">
            <CardHeader className="">
                <div className="flex justify-between">
                    <div className="">
              <CardTitle className="mb-2">Assignment Details</CardTitle>
              <CardDescription className="text-primary-200">
                Created At: {assignment?.createdAt}
              </CardDescription>
              </div>
                </div>
            </CardHeader>
            <CardContent>
              <div className="assignment__instructions mb-5">
                <h4>Description:</h4>
                <p>{assignment?.description}</p>
              </div>
              <div className="assignment__pdf">
                <iframe
                  src={`http://localhost/api/${assignment?.pdfPath}`}
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
                <CardContent>{/* Add feedback display component here 
                  {assignment.status === 'pending' && (
                    <p>No feedback available yet</p>
                  )}
                    */}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  };

export default Assignment;
