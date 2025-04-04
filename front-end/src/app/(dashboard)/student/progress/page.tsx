"use client"

import Header from '@/components/Header'
import {ProgressChart} from '@/components/ProgressChart'
import React from 'react'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
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
  },
  {
    course: "Advancer JavaScript",
    progress: 75,
  }
]

const progress = () => {

  return (
    <>


    <Header title='Progress' subtitle='View your progress' />
    <div className='content dark'>
      <Card className='profile-container dark border-none'>
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">course</TableHead>
          <TableHead>Progress</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {CourseProgress.map((cp) => (
          <TableRow key={cp.course}>
            <TableCell className="font-medium">{cp.course}</TableCell>
            <TableCell><Progress value={cp.progress} className="w-[60%]" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">...</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
    </Card>
    </div>
  </>
  )
}

export default progress