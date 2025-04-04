import AccordionSections from '@/components/AccordionSections'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import React from 'react'

const SelectedCourse = ({ course, handleEnrollNow} : SelectedCourseProps) => {
  return (
    <div className=''>
        <div className='selected-course'>
            <div>
            <h3 className='selected-course__title'>{course.title}</h3>
            <div className="flex items-center gap-2 mt-3">
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
            </div>

            <div className='selected-course__content'>
                <p className='selected-course__description'>{course.description}</p>

                <div className='selected-course__sections'>
                    <h4 className='selected-course__sections-title'>Course content</h4>
                    <AccordionSections sections={course.sections} />
                </div>
                <div className='selected-course--footer mt-3'>
                    <span className='selected-course__price'></span>
                    <Button className='bg-primary selected-course__enroll-now' onClick={() => handleEnrollNow(course.courseId)}>
                        Enroll Now
                    </Button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SelectedCourse