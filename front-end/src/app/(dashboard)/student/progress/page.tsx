"use client"

import Header from '@/components/Header'
import React, { useEffect } from 'react'
import Image from 'next/image'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Progress } from '@/components/ui/progress'
import { Card } from '@/components/ui/card'
import ProgressSkeleton from '@/components/skeletons/ProgressSkeleton'
import { Skeleton } from '@/components/ui/skeleton'
 
const CourseProgress = [
  {
    course: "Introduction to React",
    courseId: 23,
    progress: 34,
    image: "/hero1.jpg",
    teacherName: "John Doe",
    startingDate: "2024-01-15",
    category: "Programming",
    totalHours: 20,
  },
  {
    course: "Advanced JavaScript",
    courseId: 2,
    progress: 75,
    image: "/hero1.jpg",
    teacherName: "Jane Smith",
    startingDate: "2024-02-01",
    category: "Programming",
    totalHours: 15,
  }
]



const progress = () => {

  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading){
    return (
      <div>
        <>
      <Header title='Progress' subtitle='View your progress' />
      <div className='p-4'>
        <Card className='bg-customgreys-primarybg border-none dark'>
          <Table>
            <TableCaption>Course Progress Overview</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
  {CourseProgress.map((Course) => (
    <TableRow key={Course.courseId}>
      <TableCell>
        <Skeleton className="h-8 w-8 rounded-md" />
      </TableCell>
      <TableCell><Skeleton className="h-4 w-[200px] rounded-xl" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[150px] rounded-xl" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[100px] rounded-xl" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[80px] rounded-xl" /></TableCell>
    </TableRow>
  ))}
</TableBody>
          </Table>
        </Card>
      </div>
    </>
      </div>
    );
  }
  
  return (
    <>
      <Header title='Progress' subtitle='View your progress' />
      <div className='p-4'>
        <Card className='bg-customgreys-primarybg border-none dark'>
          <Table>
            <TableCaption>Course Progress Overview</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CourseProgress.map((cp) => (
                <TableRow key={cp.course}>
                  <TableCell>
                    <div className="relative w-8 h-8">
                      <Image
                        src={cp.image}
                        alt={cp.course}
                        fill
                        className="object-cover h-8 w-8 rounded-lg"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{cp.course}</TableCell>
                  <TableCell>{cp.teacherName}</TableCell>
                  <TableCell>{cp.category}</TableCell>
                  <TableCell className='w-[30%]'>
                    <div className="space-y-1">
                      <Progress value={cp.progress} className="w-full" />
                      <p className="text-sm text-gray-500">{cp.progress}% Complete</p>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </>
  )
}

export default progress