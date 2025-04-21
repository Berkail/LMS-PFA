"use client";

import Toolbar from "@/components/Toolbar";
import AssignmentCard from "@/components/AssignmentCard";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useState, useMemo, useEffect } from "react";
import Loading from "@/components/Loading";
import { AssignmentSkeleton } from "@/components/skeletons/AssignmentSkeleton";

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

const Assignments = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [assignments, setAssignments] = useState<Assignment[]>([]);


  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch('http://localhost/api/exams');
        const data = await response.json();
        setAssignments(data.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching assignments:', error);
        setIsLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const filteredAssignments = useMemo(() => {
    return assignments.filter((assignment) => {
      const matchesSearch = assignment.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [searchTerm, assignments]);

  const handleGoToAssignment = (assignment: Assignment) => {
    router.push(`/student/assignments/${assignment.id}`);
  };

  if (isLoading) {
    return (
      <div className="user-assignments">
        <Header 
          title="Assignments to take" 
          subtitle="View your pending assignments" 
        />
        <div className="user-courses__grid">
          {[1, 2, 3].map((index) => (
            <AssignmentSkeleton key={index}/>
          ))}
        </div>
      </div>
    );
    }

  return (
    <div className="user-assignments">
      <Header 
        title="Assignments to take" 
        subtitle="View your pending assignments" 
      />
      <div className="user-courses__grid">
        {filteredAssignments.map((assignment:Assignment) => (
          <AssignmentCard
            key={assignment.id}
            assignment={assignment}
            onGoToCourse={() => handleGoToAssignment(assignment)}
          />
        ))}
      </div>
    </div>
  );
};

export default Assignments;