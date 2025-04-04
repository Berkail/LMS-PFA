"use client";

import Toolbar from "@/components/Toolbar";
import AssignmentCard from "@/components/AssignmentCard";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useState, useMemo } from "react";
import Loading from "@/components/Loading";

const dummyAssignments = [
  {
    assignmentId: "assignment1",
    title: "React Fundamentals Quiz",
    description: "Complete the quiz about React basics",
    teacherName: "John Doe"
  },
  {
    assignmentId: "assignment2",
    title: "JavaScript Project",
    description: "Build a simple JavaScript application",
    teacherName: "Jane Smith"
  },
];

const Assignments = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

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

  if (isLoading) return <Loading />;

  return (
    <div className="user-assignments">
      <Header title="Assignments to take" subtitle="View your pending assignments" />
      <div className="user-courses__grid">
        {filteredAssignments.map((assignment) => (
          <AssignmentCard
            key={assignment.assignmentId}
            assignment={assignment}
            onGoToCourse={handleGoToAssignment}
          />
        ))}
      </div>
    </div>
  );
};

export default Assignments;