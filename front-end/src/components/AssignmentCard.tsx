import {
    Card,
    CardHeader,
    CardContent,
    CardTitle,
    CardFooter,
    CardDescription,
  } from "@/components/ui/card";
  import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "./ui/button";
   
  type AssignmentCardProps = {
    assignment: {
      id: number;
      title: string;
      description: string;
      pdfPath: string;
      pdfName: string;
      publishedAt: string | null;
      createdAt: string;
      updatedAt: string;
      instructorId: number;
    };
    onGoToCourse: (assignment: any) => void;
  };
  
  
  const AssignmentCard = ({ assignment , onGoToCourse }: AssignmentCardProps) => {
    return (
      <Card className="assignment-card group">
        <CardHeader className="assignment-card__header">
        <CardTitle className="assignment-card__title">
            {assignment.title}
          </CardTitle>
          <CardDescription className="assignment-card__description">
          {assignment.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="assignment-card__content">
          
  
          <CardFooter className="assignment-card__footer flex justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarImage alt={"Instructor Image"} />
              <AvatarFallback className="bg-secondary-700 text-black">
                I
              </AvatarFallback>
            </Avatar>
  
            <p className="text-sm text-customgreys-dirtyGrey">
            Intructor
            </p>
          </div>
            <Button className="hover:bg-white-50 hover:text-gray-800" onClick={() => onGoToCourse(assignment)}>Take assignment</Button>
          </CardFooter>

        </CardContent>
      </Card>
    );
  };
  
  export default AssignmentCard;