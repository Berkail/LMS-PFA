import {
    Card,
    CardHeader,
    CardContent,
    CardTitle,
    CardFooter,
  } from "@/components/ui/card";
  import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "./ui/button";
   
  type AssignmentCardProps = {
    assignment: {
      assignmentId: string;
      title: string;
      description?: string;
      teacherName: string;
    };
    onGoToCourse: (assignment: any) => void;
  };
  
  
  const AssignmentCard = ({ assignment , onGoToCourse }: AssignmentCardProps) => {
    return (
      <Card className="assignment-card group" onClick={() => onGoToCourse(assignment)}>
        <CardHeader className="assignment-card__header">
        <CardTitle className="assignment-card__title">
            {assignment.title}: {assignment.description}
          </CardTitle>
        </CardHeader>
        <CardContent className="assignment-card__content">
          
  
          <CardFooter className="assignment-card__footer flex justify-between">
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
            <Button className="hover:bg-white-50 hover:text-gray-800">Take assignment</Button>
          </CardFooter>

        </CardContent>
      </Card>
    );
  };
  
  export default AssignmentCard;