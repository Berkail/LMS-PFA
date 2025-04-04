"use client"

import Header from '@/components/Header'
import React from 'react'
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
 
const CourseProgress = [
  {
    course: "Introduction to React",
    progress: 34,
    image: "/hero1.jpg",
    teacherName: "John Doe",
    startingDate: "2024-01-15",
    category: "Programming",
    totalHours: 20,
  },
  {
    course: "Advanced JavaScript",
    progress: 75,
    image: "/hero1.jpg",
    teacherName: "Jane Smith",
    startingDate: "2024-02-01",
    category: "Programming",
    totalHours: 15,
  }
]

const progress = () => {
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