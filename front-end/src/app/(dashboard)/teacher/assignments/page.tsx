"use client";

import Toolbar from "@/components/Toolbar";
import AssignmentCard from "@/components/AssignmentCard";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useState, useMemo, useEffect } from "react";
import Loading from "@/components/Loading";
import { AssignmentSkeleton } from "@/components/skeletons/AssignmentSkeleton";
import { Button } from "@/components/ui/button";
import TeacherAssignmentCard from "@/components/TeacherAssignmentCard";

const dummyAssignments = [
  {
    assignmentId: "assignment1",
    title: "React Fundamentals Quiz",
    courseTitle: "Introduction to React",
    description: "Complete the quiz about React basics",
    dueDate: "2025-04-10",
    teacherName: "John Doe",
    teacherTitle: "Senior React Developer",
    pdfUrl: "/assignments/react-quiz.pdf",
    status: "pending",
    maxPoints: 100,
    instructions: "Please complete all questions. You have 60 minutes to finish this assignment."
  },
  {
    assignmentId: "assignment2",
    title: "JavaScript Project",
    courseTitle: "Advanced JavaScript",
    description: "Build a simple JavaScript application",
    dueDate: "2025-04-15",
    teacherName: "Jane Smith",
    teacherTitle: "JavaScript Expert",
    pdfUrl: "/assignments/javascript-project.pdf",
    status: "pending",
    maxPoints: 100,
    instructions: "Build a JavaScript application following the provided specifications."
  },
];

const Assignments = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const filteredAssignments = useMemo(() => {
    return dummyAssignments.filter((assignment) => {
      const matchesSearch = assignment.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [searchTerm]);

  const handleGoToAssignment = (assignment: any) => {
    router.push(`/student/assignments/${assignment.assignmentId}`);
  };

  useEffect(() => {
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Increased to 3.5 seconds
  
    return () => clearTimeout(timer);
  }, []);

    if (isLoading) {
      return (
      <div className="user-assignments">
      <Header 
        title="Assignments to take" 
        subtitle="View your pending assignments" 
      />
      <div className="user-courses__grid">
          {filteredAssignments.map((assignment) => (
            <AssignmentSkeleton key={assignment.assignmentId}/>
          ))}
      </div>
    </div>
      );
    }

  return (
    <div className="user-assignments">
      <Header
        title="Assignments"
        subtitle="Browse your assignments"
        rightElement={
          <Button
            className="teacher-courses__header"
          >
            Create Assignment
          </Button>
        }
      />
      <div className="user-courses__grid">
        {filteredAssignments.map((assignment) => (
          <TeacherAssignmentCard
            key={assignment.assignmentId}
            assignment={assignment}
            onGoToCourse={() => handleGoToAssignment(assignment)}
          />
        ))}
      </div>
    </div>
  );
};

export default Assignments;