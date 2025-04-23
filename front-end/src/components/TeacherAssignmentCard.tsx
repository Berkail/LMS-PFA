import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { Pencil, Trash2 } from "lucide-react";

type AssignmentCardProps = {
  assignment: {
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
  };
  onEdit: (assignment: any) => void;
  onDelete: (assignment: any) => void;
};

const TeacherAssignmentCard = ({ assignment, onEdit, onDelete }: AssignmentCardProps) => {

  return (
    <Card className="teacher-assignment-card group">
      <CardHeader className="assignment-card__header">
        <CardTitle className="assignment-card__title">
          {assignment.title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {assignment.description}
        </p>
      </CardHeader>
      <CardContent className="assignment-card__content">
        {/**<div className="flex items-center gap-2">
          <Avatar className="w-6 h-6">
            <AvatarImage alt="instructor" />
            <AvatarFallback className="bg-secondary-700 text-black">
              I
            </AvatarFallback>
          </Avatar>
          <p className="text-sm text-customgreys-dirtyGrey">
            Instructor
          </p>
        </div>
        */}
        <CardFooter className="assignment-card__footer flex justify-between p-0 mt-4">
          <div className="flex gap-3">
            <Button
              className="course-card-teacher__edit-button"
              onClick={() => onEdit(assignment)}
              variant="outline"
              size="sm"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              className="course-card-teacher__delete-button"
              onClick={() => onDelete(assignment)}
              variant="destructive"
              size="sm"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </CardFooter>
      </CardContent>
    </Card>
  );
};

export default TeacherAssignmentCard;