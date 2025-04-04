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
 
type CourseCardProps = {
  course: {
    courseId: string;
    title: string;
    description?: string;
    image?: string;
    teacherName: string;
    category: string;
  };
  onGoToCourse: (course: any) => void;
};


const CourseCard = ({ course , onGoToCourse }: CourseCardProps) => {
  return (
    <Card className="course-card group" onClick={() => onGoToCourse(course)}>
      <CardHeader className="course-card__header">
        <Image
          src={course.image || "/placeholder.png"}
          alt={course.title}
          width={400}
          height={350}
          className="course-card__image"
          priority
        />
      </CardHeader>
      <CardContent className="course-card__content">
        <CardTitle className="course-card__title">
          {course.title}: {course.description}
        </CardTitle>

        <div>
          <p className="text-white-50 mb-2">Progress</p>
        <Progress value={30} className="w-[100%]" />
        </div>
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