import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { Progress } from "./ui/progress";

interface CourseModule {
  id: number;
  title: string;
  lessons: {
    id: number;
    title: string;
  }[];
}
 
type CourseCardProps = {
  course: {
    courseId: string;
    title: string;
    description?: string;
    image?: string;
    teacherName: string;
    category: string;
    courseModules?: CourseModule[];
  };
  onGoToCourse: (course: {
    id: number;
    title: string;
    courseModules?: CourseModule[];
  }) => void;
};

const CourseCard = ({ course, onGoToCourse }: CourseCardProps) => {
  const handleClick = () => {
    onGoToCourse({
      id: parseInt(course.courseId),
      title: course.title,
      courseModules: course.courseModules
    });
  };

  const imageUrl =`http://localhost/api/${course.image}`;


  return (
    <Card className="course-card group" onClick={handleClick}>
      <CardHeader className="course-card__header">
      <div 
          className="course-card-teacher__image"
          style={{ 
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      </CardHeader>
      <CardContent className="course-card__content">
        <CardTitle className="course-card__title">
          {course.title}
          {course.description && (
            <span className="text-sm text-muted-foreground block mt-2">
              {course.description}
            </span>
          )}
        </CardTitle>

        <CardFooter className="course-card__footer">
          <div className="course-card__category">{course.category}</div>
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarImage alt={course.teacherName} />
              <AvatarFallback className="bg-secondary-700 text-black">
                {course.teacherName[0]}
              </AvatarFallback>
            </Avatar>
            <p className="text-sm text-customgreys-dirtyGrey">
              {course.teacherName}
            </p>
          </div>
        </CardFooter>
      </CardContent>
    </Card>
  );
};

export default CourseCard;