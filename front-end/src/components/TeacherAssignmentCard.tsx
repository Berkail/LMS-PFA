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
      assignmentId: string;
      title: string;
      description?: string;
      teacherName: string;
    };
    onGoToCourse: (assignment: any) => void;
  };
  
  
  const TeacherAssignmentCard = ({ assignment , onGoToCourse }: AssignmentCardProps) => {
    return (
      <Card className="assignment-card group" onClick={() => onGoToCourse(assignment)}>
        <CardHeader className="assignment-card__header">
        <CardTitle className="assignment-card__title">
            {assignment.title}: {assignment.description}
          </CardTitle>
        </CardHeader>
        <CardContent className="assignment-card__content">
          
  
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarImage alt={assignment.teacherName} />
              <AvatarFallback className="bg-secondary-700 text-black">
                {assignment.teacherName[0]}
              </AvatarFallback>
            </Avatar>
  
            <p className="text-sm text-customgreys-dirtyGrey">
              {assignment.teacherName}
            </p>
          </div>
  
          <CardFooter className="assignment-card__footer flex justify-between">
          <div className="flex gap-3">
              <div>
                <Button
                  className="course-card-teacher__edit-button"
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
              <div>
                <Button
                  className="course-card-teacher__delete-button"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </CardFooter>

        </CardContent>
      </Card>
    );
  };
  
  export default TeacherAssignmentCard;