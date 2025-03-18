import Header from '@/components/Header'
import {ProgressChart} from '@/components/ProgressChart'
import React from 'react'

const progress = () => {
  return (
    <>
    <Header title='Progress' subtitle='View your progress' />
    <div className='content'>
      <ProgressChart />
    </div>
  </>
  )
}

export default progress