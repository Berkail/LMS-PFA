"use client";

import Toolbar from "@/components/Toolbar";
import AssignmentCard from "@/components/AssignmentCard";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useState, useMemo, useEffect, use } from "react";
import Loading from "@/components/Loading";
import { AssignmentSkeleton } from "@/components/skeletons/AssignmentSkeleton";
import { Button } from "@/components/ui/button";
import TeacherAssignmentCard from "@/components/TeacherAssignmentCard";



interface Assignment {
  id: number;
  title: string;
  description: string;
  pdfPath: string | null;
  pdfName: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  instructorId: number;
}
interface User {
  id: number;
  username: string; 
  firstName: string;
  lastName: string;
  email: string;
}
const Assignments = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [instructor, setInstructor] = useState<User| null>(null);

  // First useEffect to fetch instructor data
  useEffect(() => {
      const fetchInstructor = async () => {
          try {
              const endpoint = 'http://localhost/api/instructors/me';
                
              const response = await fetch(endpoint, {
                  credentials: 'include'
              });
              
              if (!response.ok) throw new Error(`Failed to fetch data`);
              const data = await response.json();
              setInstructor(data);
          } catch (error) {
              console.error(`Error fetching data:`, error);
          }
      };
  
      fetchInstructor();
  }, []);
  
  // Second useEffect to fetch assignments when instructor is available
  useEffect(() => {
      const fetchAssignments = async () => {
          if (!instructor?.id) return;
          
          try {
              const response = await fetch(`http://localhost/api/exams?instructorId=${instructor.id}`);
              const result = await response.json();
              setAssignments(result.data); // Changed from setInstructor to setAssignments
          } catch (error) {
              console.error('Error fetching assignments:', error);
          } finally {
              setIsLoading(false);
          }
      };
  
      fetchAssignments();
  }, [instructor]); // Added instructor as dependency

  const filteredAssignments = useMemo(() => {
    return assignments.filter((assignment) => 
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [assignments, searchTerm]);

  const handleEdit = (assignment: Assignment) => {
    router.push(`/teacher/assignments/${assignment.id}`);
  }

  const handleDelete = async (assignment: Assignment) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the assignment "${assignment.title}"?`);
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost/api/exams/${assignment.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });
  
        const data = await response.json();
  
        if (response.ok) {
          setAssignments(assignments.filter(a => a.id !== assignment.id));
        } else {
          alert(`Failed to delete: ${data.message || 'Unknown error occurred'}`);
        }
      } catch (error) {
        console.error('Error deleting assignment:', error);
        alert('Failed to delete the assignment. Please check your connection and try again.');
      }
    }
  };

  const handleCreateAssignment = () => {
    router.push('/teacher/assignments/create');
  };

  if (isLoading) {
    return (
      <div className="user-assignments">
        <Header 
          title="Assignments" 
          subtitle="Loading assignments..." 
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
        title="Assignments"
        subtitle={`${assignments.length} assignments available`}
        rightElement={
          <Button
            className="teacher-courses__header"
            onClick={handleCreateAssignment}
          >
            Create Assignment
          </Button>
        }
      />
      <div className="user-courses__grid">
        {filteredAssignments.length > 0 ? (
          filteredAssignments.map((assignment) => (
            <TeacherAssignmentCard
              key={assignment.id}
              assignment={assignment}
              onEdit={() => handleEdit(assignment)}
              onDelete={() => handleDelete(assignment)}
            />
          ))
        ) : (
          <p>No assignments found.</p>
        )}
      </div>
    </div>
  );
};

export default Assignments;